const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

module.exports = function requestMiddleware(req, res, next) {
    const requestId = req.headers['x-request-id'] || randomUUID();
    const startedAt = Date.now();

    logger.requestContext.run({ requestId }, () => {
        req.requestId = requestId;
        res.setHeader('x-request-id', requestId);

        logger.info('request_started', {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        res.on('finish', () => {
            const durationMs = Date.now() - startedAt;
            const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

            logger[level]('request_completed', {
                method: req.method,
                path: req.originalUrl,
                statusCode: res.statusCode,
                durationMs
            });
        });

        next();
    });
};
