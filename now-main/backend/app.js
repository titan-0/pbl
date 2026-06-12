const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const redis = require('redis');
const logger = require('./utils/logger');
const requestMiddleware = require('./middleware/request.middleware');

const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free';
const MEDICINE_LLM_ENABLED = process.env.MEDICINE_LLM_ENABLED !== 'false';
const OPENROUTER_COOLDOWN_MS = 2 * 60 * 1000;
const MEDICINE_CACHE_TTL_MS = 10 * 60 * 1000;
const MEDICINE_CACHE_VERSION = 'v2';
const redisUrl = process.env.REDIS_URL;
const client = redisUrl
    ? redis.createClient({ url: redisUrl })
    : null;
const memoryMedicineCache = new Map();
let openRouterCooldownUntil = 0;

if (client) {
    client.on('error', err => {
        logger.error('redis_client_error', { error: err });
    });
}

async function connectRedis() {
    if (!client) {
        logger.warn('redis_disabled', { reason: 'REDIS_URL is not set' });
        return;
    }

    try {
        await client.connect();
        logger.info('redis_connected');
    } catch (error) {
        logger.error('redis_connection_failed', { error });
    }
}

connectRedis();


const connecttodb = require('./db/db');
const userroutes = require('./routes/user.routes');
const captainroutes = require('./routes/captain.routes');
const medicineroutes = require('./routes/medical.routes');


const cookieparser = require('cookie-parser');
connecttodb();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(requestMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.get('/', (req, res) => {
    res.send('hello world');
});

function firstNonEmptyArrayValue(...values) {
    for (const value of values) {
        if (Array.isArray(value) && value.length > 0) {
            const joined = value
                .map(item => String(item || '').trim())
                .filter(Boolean)
                .join(' ');

            if (joined) {
                return joined;
            }
        }

        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return '';
}

function combineLabelSections(...sections) {
    const combined = sections
        .flatMap(section => Array.isArray(section) ? section : [section])
        .map(section => String(section || '').trim())
        .filter(Boolean);

    if (!combined.length) {
        return '';
    }

    return combined.join(' ');
}

async function fetchMedicineInfo(medName) {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.substance_name:"${medName}"&limit=1`;

    try {
        const res = await axios.get(url, { timeout: 8000 });

        if (!res.data.results || res.data.results.length === 0) {
            logger.warn('medicine_not_found_in_openfda', { medicineName: medName });
            return null;
        }

        const item = res.data.results[0];
        const description = firstNonEmptyArrayValue(
            item.description,
            item.purpose,
            item.spl_product_data_elements,
            item.indications_and_usage
        );
        const limitations = combineLabelSections(
            item.contraindications,
            item.do_not_use,
            item.stop_use,
            item.ask_doctor,
            item.ask_doctor_or_pharmacist
        );
        const precautions = combineLabelSections(
            item.warnings,
            item.boxed_warning,
            item.when_using,
            item.keep_out_of_reach_of_children
        );

        return {
            name: item.openfda.brand_name?.[0] || medName,
            description: description || "No description available.",
            raw_uses: item.indications_and_usage?.[0] || "No use information available.",
            raw_limitations: limitations || "No limitation data available.",
            raw_precautions: precautions || "No warnings/precautions listed."
        };

    } catch (err) {
        if (err.response && err.response.status === 404) {
            logger.warn('medicine_lookup_404', { medicineName: medName, error: err });
        } else {
            logger.error('medicine_lookup_failed', { medicineName: medName, error: err });
        }
        return null;
    }
}

// Step 2: Parse and clean with OpenRouter (LLM)
async function cleanWithLLM(promptText) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  if (Date.now() < openRouterCooldownUntil) {
    throw new Error('OpenRouter temporarily skipped after rate limit');
  }

  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: promptText }],
        temperature: 0.2
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "User-Agent": "sianfkp63@gmail.com"
        },
        timeout: 6000
      }
    );

    const content = res.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter returned an empty response');
    }

    return content.trim();
  } catch (error) {
    if (error.response?.status === 429) {
      openRouterCooldownUntil = Date.now() + OPENROUTER_COOLDOWN_MS;
      logger.warn('openrouter_rate_limited', {
        model: OPENROUTER_MODEL,
        cooldownMs: OPENROUTER_COOLDOWN_MS
      });
    }

    throw error;
  }
}

function fallbackSummary(text, maxLength = 240) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength) || 'No information available.';
}

function fallbackBulletSummary(text, fallbackMessage) {
  const cleaned = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return fallbackMessage;
  }

  const parts = cleaned
    .split(/(?<=[.!?;])\s+/)
    .map(part => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (!parts.length) {
    return fallbackMessage;
  }

  return parts.map(part => `- ${part}`).join('\n');
}

// Step 3: Combine logic
async function getStructuredMedicineData(medName) {
  const normalizedName = `${MEDICINE_CACHE_VERSION}:${String(medName || '').trim().toLowerCase()}`;
  const cachedMedicine = memoryMedicineCache.get(normalizedName);
  if (cachedMedicine && cachedMedicine.expiresAt > Date.now()) {
    logger.info('medicine_memory_cache_hit', { medicineName: medName });
    return cachedMedicine.data;
  }

  const med = await fetchMedicineInfo(medName);
  if (!med) return;

  const llmPrompt = `
You are formatting medicine information for a user-facing healthcare app.
Return valid JSON only with these exact keys:
- description
- uses
- limitations
- precautions

Rules:
- description: 1-2 short clear sentences.
- uses: array of up to 3 short bullet-style strings.
- limitations: array of up to 3 short bullet-style strings.
- precautions: array of up to 3 short bullet-style strings.
- Keep the wording simple and concise.
- If a field has little information, return the best short summary from the provided text.

Medicine name: ${med.name}

Description source:
${med.description}

Uses source:
${med.raw_uses}

Limitations source:
${med.raw_limitations}

Precautions source:
${med.raw_precautions}
  `.trim();

  let structuredFields = {
    description: fallbackSummary(med.description),
    uses: fallbackBulletSummary(med.raw_uses, 'No use information available.'),
    limitations: fallbackBulletSummary(med.raw_limitations, 'No limitation data available.'),
    precautions: fallbackBulletSummary(med.raw_precautions, 'No warnings/precautions listed.')
  };

  if (MEDICINE_LLM_ENABLED) {
    try {
      const llmResponse = await cleanWithLLM(llmPrompt);
      const parsed = JSON.parse(llmResponse);

      structuredFields = {
        description: parsed.description || structuredFields.description,
        uses: Array.isArray(parsed.uses)
          ? parsed.uses.map(item => `- ${String(item).trim()}`).join('\n')
          : (parsed.uses || structuredFields.uses),
        limitations: Array.isArray(parsed.limitations)
          ? parsed.limitations.map(item => `- ${String(item).trim()}`).join('\n')
          : (parsed.limitations || structuredFields.limitations),
        precautions: Array.isArray(parsed.precautions)
          ? parsed.precautions.map(item => `- ${String(item).trim()}`).join('\n')
          : (parsed.precautions || structuredFields.precautions)
      };
    } catch (error) {
      logger.warn('medicine_llm_fallback_used', {
        medicineName: medName,
        field: 'all',
        error
      });
    }
  } else {
    logger.info('medicine_llm_skipped', {
      medicineName: medName,
      reason: 'MEDICINE_LLM_ENABLED is false'
    });
  }

  const finalData = {
    name: medName,
    brandName: med.name,
    description: structuredFields.description,
    uses: structuredFields.uses,
    limitations: structuredFields.limitations,
    precautions: structuredFields.precautions
  };

  memoryMedicineCache.set(normalizedName, {
    data: finalData,
    expiresAt: Date.now() + MEDICINE_CACHE_TTL_MS
  });

  logger.debug('medicine_data_structured', {
    medicineName: medName,
    brandName: med.name,
    model: OPENROUTER_MODEL
  });

  return finalData;
}

// API Route for fetching structured medicine data
app.post('/api/medicine', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Medicine name is required.' });
    }

    try {
        const structuredData = await getStructuredMedicineData(name);
        if (!structuredData) {
            return res.status(404).json({ error: 'Medicine information not found.' });
        }
        res.json(structuredData);
    } catch (err) {
        logger.error('medicine_structured_fetch_failed', { medicineName: name, error: err });
        res.status(500).json({ error: 'Failed to fetch medicine data. Please try again later.' });
    }
});

// API Route for fetching medicine details
app.post('/api/medicine-details', async (req, res) => {

    
    const { medicine_name } = req.body;

    if (!medicine_name) {
        return res.status(400).json({ error: 'Medicine name is required.' });
    }

    if (client) {
        try {
            const value = await client.get(medicine_name);
            if (value) {
                logger.info('medicine_cache_hit', { medicineName: medicine_name });
                return res.json(JSON.parse(value));
            }
        } catch (error) {
            logger.error('redis_cache_read_failed', { medicineName: medicine_name, error });
        }
    }

    try {
        const structuredData = await getStructuredMedicineData(medicine_name);
        if (!structuredData) {
            return res.status(404).json({ error: 'Medicine information not found.' });
        }

        if (client) {
            try {
                await client.set(medicine_name, JSON.stringify(structuredData), { EX: 300 });
            } catch (error) {
                logger.error('redis_cache_write_failed', { medicineName: medicine_name, error });
            }
        }

        res.json(structuredData);
    } catch (err) {
        logger.error('medicine_details_fetch_failed', { medicineName: medicine_name, error: err });
        res.status(500).json({ error: 'Failed to fetch medicine details. Please try again later.' });
    }
});

app.use('/users', userroutes);
app.use('/captains', captainroutes);
app.use('/medicines', medicineroutes);
app.use('/maps', require('./routes/map.routes'));
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    logger.error('unhandled_request_error', {
        method: req.method,
        path: req.originalUrl,
        error: err
    });

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Internal server error'
    });
});

module.exports = app;
