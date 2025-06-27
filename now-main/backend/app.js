const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.get('/', (req, res) => {
    res.send('hello world');
});
async function fetchMedicineInfo(medName) {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.substance_name:"${medName}"&limit=1`;

    try {
        const res = await axios.get(url);
        console.log("OpenFDA response:", res.data);

        if (!res.data.results || res.data.results.length === 0) {
            console.warn(`No results found for medicine: ${medName}`);
            return null;
        }

        const item = res.data.results[0];
        return {
            name: item.openfda.brand_name?.[0] || medName,
            description: item.description?.[0] || "No description available.",
            raw_uses: item.indications_and_usage?.[0] || "No use information available.",
            raw_limitations: item.contraindications?.[0] || "No limitation data available.",
            raw_precautions: item.warnings?.[0] || "No warnings/precautions listed."
        };

    } catch (err) {
        if (err.response && err.response.status === 404) {
            console.error(`Medicine not found: ${medName}`);
        } else {
            console.error("Failed to fetch medicine info:", err.message);
        }
        return null;
    }
}

// Step 2: Parse and clean with OpenRouter (LLM)
async function cleanWithLLM(promptText) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "mistralai/mistral-7b-instruct", // or llama2 if you prefer
      messages: [{ role: "user", content: promptText }],
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost", // recommended
        "User-Agent": "sianfkp63@gmail.com"
      }
    }
  );

  return res.data.choices[0].message.content.trim();
}

// Step 3: Combine logic
async function getStructuredMedicineData(medName) {
  const med = await fetchMedicineInfo(medName);
  if (!med) return;

  // LLM prompts
  const usesPrompt = `Summarize the following medical use instructions for ${med.name} in 3 very short bullet points:\n\n${med.raw_uses}`;
  const limitationsPrompt = `Summarize any limitations or contraindications for ${med.name} in 3 very short bullet points:\n\n${med.raw_limitations}`;
  const precautionsPrompt = `List 3 important precautions in or warnings for ${med.name} based on this:\n\n${med.raw_precautions} in 3 short  lines.`;
  const descPrompt = `Summarize this description of ${med.name} in 1-2 clear 2 line sentensces:\n\n${med.description}`;

  // Send to LLM
  const [description, uses, limitations, precautions] = await Promise.all([
    cleanWithLLM(descPrompt),
    cleanWithLLM(usesPrompt),
    cleanWithLLM(limitationsPrompt),
    cleanWithLLM(precautionsPrompt)
  ]);

  const finalData = {
    name: med.name,
    description,
    uses,
    limitations,
    precautions
  };
  console.log("Final structured data:", finalData);
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
        console.error('Error fetching structured medicine data:', err.message);
        res.status(500).json({ error: 'Failed to fetch medicine data. Please try again later.' });
    }
});

// API Route for fetching medicine details
app.post('/api/medicine-details', async (req, res) => {
    const { medicine_name } = req.body;

    if (!medicine_name) {
        return res.status(400).json({ error: 'Medicine name is required.' });
    }

    try {
        const structuredData = await getStructuredMedicineData(medicine_name);
        if (!structuredData) {
            return res.status(404).json({ error: 'Medicine information not found.' });
        }
        res.json(structuredData);
    } catch (err) {
        console.error('Error fetching medicine details:', err.message);
        res.status(500).json({ error: 'Failed to fetch medicine details. Please try again later.' });
    }
});

app.use('/users', userroutes);
app.use('/captains', captainroutes);
app.use('/medicines', medicineroutes);
app.use('/maps', require('./routes/map.routes'));
module.exports = app;