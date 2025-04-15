require('dotenv').config();
const mongoose = require('mongoose');
const Captain = require('../models/captain.model');

async function updateShopLocations() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB');

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

        console.log(`Updated ${result.modifiedCount} documents`);

        // Ensure the 2dsphere index exists
        await Captain.collection.createIndex({ 'shop.location': '2dsphere' });
        console.log('Created 2dsphere index');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

updateShopLocations();