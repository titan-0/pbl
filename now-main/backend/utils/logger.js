const { AsyncLocalStorage } = require('async_hooks');

const requestContext = new AsyncLocalStorage();
const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const configuredLevel = (process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')).toLowerCase();
const activeLevel = Object.prototype.hasOwnProperty.call(LOG_LEVELS, configuredLevel)
    ? configuredLevel
    : 'info';

function shouldLog(level) {
    return LOG_LEVELS[level] <= LOG_LEVELS[activeLevel];
}

function serializeError(error) {
    if (!error) {
        return undefined;
    }

    return {
        message: error.message,
        code: error.code,
        status: error.status
    };
}

function currentRequestMeta() {
    return requestContext.getStore() || {};
}

function getCallerLocation() {
    const stackHolder = {};
    Error.captureStackTrace(stackHolder, getCallerLocation);

    const stackLines = stackHolder.stack ? stackHolder.stack.split('\n') : [];
    for (const rawLine of stackLines) {
        const line = rawLine.trim();

        if (!line || line.includes('\\utils\\logger.js')) {
            continue;
        }

        const withFunctionMatch = line.match(/\((.*):(\d+):(\d+)\)$/);
        const directMatch = line.match(/at (.*):(\d+):(\d+)$/);
        const match = withFunctionMatch || directMatch;

        if (match) {
            const fullPath = match[1];
            const normalizedPath = fullPath.replace(/\\/g, '/');
            const fileName = normalizedPath.split('/').pop();

            return {
                file: fileName,
                line: match[2]
            };
        }
    }

    return {
        file: 'unknown',
        line: '0'
    };
}

function formatMeta(meta) {
    const entries = Object.entries(meta).filter(([, value]) => value !== undefined);
    if (!entries.length) {
        return '';
    }

    return entries.map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            if (key === 'error') {
                return `${key}=${value.message || 'Unknown error'}`;
            }

            try {
                return `${key}=${JSON.stringify(value)}`;
            } catch (error) {
                return `${key}=[unserializable]`;
            }
        }

        return `${key}=${String(value)}`;
    }).join(' ');
}

function write(level, message, meta = {}) {
    if (!shouldLog(level)) {
        return;
    }

    const payload = {
        ...currentRequestMeta(),
        ...meta
    };

    if (payload.error instanceof Error) {
        payload.error = serializeError(payload.error);
    }

    const caller = getCallerLocation();
    const metaText = formatMeta(payload);
    const finalMessage = metaText ? `${message} ${metaText}` : message;
    const line = `|${caller.line}|${caller.file}|${new Date().toISOString()}|${finalMessage}|${level}|`;

    if (level === 'error') {
        process.stderr.write(`${line}\n`);
        return;
    }

    process.stdout.write(`${line}\n`);
}

function child(defaultMeta = {}) {
    return {
        error(message, meta = {}) {
            write('error', message, { ...defaultMeta, ...meta });
        },
        warn(message, meta = {}) {
            write('warn', message, { ...defaultMeta, ...meta });
        },
        info(message, meta = {}) {
            write('info', message, { ...defaultMeta, ...meta });
        },
        debug(message, meta = {}) {
            write('debug', message, { ...defaultMeta, ...meta });
        }
    };
}

module.exports = {
    requestContext,
    serializeError,
    child,
    error(message, meta = {}) {
        write('error', message, meta);
    },
    warn(message, meta = {}) {
        write('warn', message, meta);
    },
    info(message, meta = {}) {
        write('info', message, meta);
    },
    debug(message, meta = {}) {
        write('debug', message, meta);
    }
};
