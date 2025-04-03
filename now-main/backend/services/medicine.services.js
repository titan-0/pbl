const { checkLocation } = require('../utils/location');
const Captain = require('../models/captain.model');

const mapService = require('./map.services');

const findMedicineByName = async (shop_name, medicine_name) => {
    const shop = await Captain.findOne({ shop_name });
    if (!shop) {
        throw new Error(`Shop '${shop_name}' not found`);
    }

    const medicine = shop.medicines.find(med => 
        med.medicine_name.toLowerCase().includes(medicine_name.toLowerCase())
    );

    if (!medicine) {
        throw new Error(`Medicine '${medicine_name}' not found in shop '${shop_name}'`);
    }

    return medicine;
};

const findNearestMedicinesByName = async (userLocation, medicine_name, radius = 25) => {
    if (!userLocation || !medicine_name) {
        const error = new Error('Missing required parameters: userLocation and medicine_name');
        error.status = 400;
        throw error;
    }

    console.log('Validated user location:', userLocation);
    console.log('Searching for medicine:', medicine_name);

    const validatedLocation = checkLocation(userLocation.longitude, userLocation.latitude);

    console.log('Validated location:', validatedLocation);

    const shops = await Captain.find({
        'shop.location': {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [validatedLocation.longitude, validatedLocation.latitude]
                },
                $maxDistance: radius * 1000 // Convert km to meters
            }
        }
    }).select('shopname shop.location shop.shop_address medicines');

    console.log(`Shops found: ${shops.length}`);
    if (!shops.length) {
        const error = new Error('No shops found in the specified radius');
        error.status = 404;
        throw error;
    }

    const results = [];
    const errors = [];

    for (const shop of shops) {
        try {
            console.log(`Checking shop: ${shop.shopname}`);
            
            if (!shop.medicines || shop.medicines.length === 0) {
                console.log(`No medicines found in shop: ${shop.shopname}`);
                errors.push(`No medicines in shop: ${shop.shopname}`);
                continue;
            }

            const medicine = shop.medicines.find(med =>
                med.medicine_name.toLowerCase().includes(medicine_name.toLowerCase())
            );

            if (!medicine) {
                console.log(`Medicine '${medicine_name}' not found in shop: ${shop.shopname}`);
                continue;
            }

            console.log(`Medicine '${medicine_name}' found in shop: ${shop.shopname}`);

            // Get the distance between the user and the shop using mapService
            const originCoords = `${validatedLocation.latitude},${validatedLocation.longitude}`;
            const destCoords = `${shop.shop.location.coordinates[1]},${shop.shop.location.coordinates[0]}`;
            const distanceData = await mapService.getdistancetime(originCoords, destCoords);

            results.push({
                shop_name: shop.shopname,
                shop_address: shop.shop.shop_address,
                medicine: {
                    name: medicine.medicine_name,
                    category: medicine.category,
                    price: medicine.price,
                    quantity: medicine.quantity
                },
                coordinates: shop.shop.location.coordinates,
                distance: distanceData.distance, // Distance in km
                duration: distanceData.time // Duration in minutes
            });
        } catch (error) {
            console.error(`Error processing shop ${shop.shopname}:`, error);
            errors.push(`Error processing shop ${shop.shopname}: ${error.message}`);
            continue;
        }
    }

    console.log(`Results found: ${results.length}`);
    if (!results.length) {
        const error = new Error('No medicine found in nearby stores');
        error.status = 404;
        throw error;
    }

    // Sort results by distance (ascending)
    results.sort((a, b) => a.distance - b.distance);

    // Limit results to the 5 nearest shops
    const limitedResults = results.slice(0, 5);

    return {
        success: true,
        data: limitedResults,
        errors: errors.length > 0 ? errors : undefined
    };
};

module.exports = { 
    findNearestMedicinesByName, 
    findMedicineByName 
};
