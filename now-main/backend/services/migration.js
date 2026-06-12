require('dotenv').config();
const mongoose = require('mongoose');
const Captain = require('../models/captain.model');
const logger = require('../utils/logger');

async function updateShopLocations() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        logger.info('migration_database_connected');

        const result = await Captain.updateMany(
            { 'shop.location.lat': { $exists: true } },
            [{
                $set: {
                    'shop.location': {
                        type: 'Point',
                        coordinates: [
                            '$shop.location.lng',
                            '$shop.location.lat'
                        ]
                    }
                }
            }]
        );

        logger.info('migration_documents_updated', { modifiedCount: result.modifiedCount });

        // Ensure the 2dsphere index exists
        await Captain.collection.createIndex({ 'shop.location': '2dsphere' });
        logger.info('migration_index_created', { index: 'shop.location_2dsphere' });

    } catch (error) {
        logger.error('migration_failed', { error });
    } finally {
        await mongoose.disconnect();
        logger.info('migration_database_disconnected');
    }
}

updateShopLocations();
