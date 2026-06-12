require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

function connectdb() {
    const dbUri = process.env.DB_CONNECT;

    if (!dbUri) {
        logger.error('database_config_missing', { missingEnv: 'DB_CONNECT' });
        return;
    }

    mongoose.connect(dbUri)
        .then(() => {
            logger.info('database_connected');
        })
        .catch(err => {
            logger.error('database_connection_failed', { error: err });
        });
}

module.exports = connectdb;
