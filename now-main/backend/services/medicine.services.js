const { checkLocation } = require('../utils/location');
const Captain = require('../models/captain.model');
const ShopModel = require('../models/medicaldata');
const mapService = require('./map.services');

const findMedicineByName = async (shop_name, medicine_name) => {
    const shop = await ShopModel.findOne({ shop_name });
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

const findNearestMedicinesByName = async (userLocation, medicine_name, radius = 5) => {
    if (!userLocation || !medicine_name) {
        throw new Error('Missing required parameters: userLocation and medicine_name');
    }

    console.log('Search Parameters:', {
        medicine_name,
        location: userLocation,
        radius
    });

    // Validate location
    const validatedLocation = checkLocation(userLocation.latitude, userLocation.longitude);

    // Find shops within radius
    const shops = await Captain.find({
        'shop.location': {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [validatedLocation.longitude, validatedLocation.latitude]
                },
                $maxDistance: radius * 1000
            }
        }
    }).select('-password');

    console.log(`Found ${shops.length} shops within ${radius}km radius:`, 
        shops.map(s => ({
            shopname: s.shopname,
            coordinates: s.shop.location.coordinates
        }))
    );

    const results = [];
    const errors = [];
    let medicineFoundCount = 0;

    // Check each shop for the medicine
    for (const shop of shops) {
        try {
            console.log(`Checking shop: ${shop.shopname}`);
            const shopData = await ShopModel.findOne({ shop_name: shop.shopname });
            
            if (!shopData) {
                console.log(`No shop data found for: ${shop.shopname}`);
                errors.push(`Shop data not found: ${shop.shopname}`);
                continue;
            }

            if (!shopData.medicines || shopData.medicines.length === 0) {
                console.log(`No medicines found in shop: ${shop.shopname}`);
                errors.push(`No medicines in shop: ${shop.shopname}`);
                continue;
            }

            const medicine = shopData.medicines.find(med => 
                med.medicine_name.toLowerCase().includes(medicine_name.toLowerCase())
            );

            if (!medicine) {
                console.log(`Medicine '${medicine_name}' not found in: ${shop.shopname}`);
                errors.push(`Medicine not available in: ${shop.shopname}`);
                continue;
            }

            medicineFoundCount++;

            // Format coordinates properly for the map service
            const originCoords = `${validatedLocation.latitude},${validatedLocation.longitude}`;
            const destCoords = `${shop.shop.location.coordinates[1]},${shop.shop.location.coordinates[0]}`;

            // Calculate simple distance first
            const R = 6371; // Earth's radius in km
            const dLat = (shop.shop.location.coordinates[1] - validatedLocation.latitude) * Math.PI / 180;
            const dLon = (shop.shop.location.coordinates[0] - validatedLocation.longitude) * Math.PI / 180;
            const a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(validatedLocation.latitude * Math.PI / 180) * 
                Math.cos(shop.shop.location.coordinates[1] * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const simpleDist = R * c;

            // Only call map service if distance is significant
            let distanceData;
            if (simpleDist < 0.05) { // If less than 50 meters
                distanceData = {
                    distance: simpleDist,
                    duration: Math.max(1, Math.round(simpleDist * 15)) // Assume walking speed of 4km/h
                };
            } else {
                // Get distance using map service
                distanceData = await mapService.getDistanceByNames(originCoords, destCoords);
            }

            results.push({
                shop_name: shop.shopname,
                shop_address: shop.shop.shop_address,
                medicine: {
                    name: medicine.medicine_name,
                    category: medicine.category,
                    price: medicine.price,
                    quantity: medicine.quantity
                },
                distance: Number(distanceData.distance).toFixed(2), // Round to 2 decimal places
                duration: Number(distanceData.duration).toFixed(0), // Round to nearest minute
                coordinates: shop.shop.location.coordinates,
                travelMode: simpleDist < 0.05 ? 'walking' : 'driving'
            });

            console.log(`Distance calculation for ${shop.shopname}:`, {
                from: originCoords,
                to: destCoords,
                simpleDistance: simpleDist.toFixed(3),
                apiDistance: distanceData.distance,
                duration: distanceData.duration,
                travelMode: simpleDist < 0.05 ? 'walking' : 'driving'
            });

        } catch (error) {
            console.error(`Error processing shop ${shop.shopname}:`, error);
            continue;
        }
    }

    if (results.length === 0) {
        throw new Error('No medicine found in nearby stores');
    }

    // Sort results by distance
    results.sort((a, b) => a.distance - b.distance);

    return {
        success: true,
        data: {
            totalShops: results.length,
            averagePrice: results.length > 1 ? 
                (results.reduce((sum, shop) => sum + shop.medicine.price, 0) / results.length).toFixed(2) : 
                results[0].medicine.price,
            nearestShop: {
                distance: results[0].distance,
                duration: results[0].duration
            },
            shops: results
        }
    };
};

module.exports = { 
    findNearestMedicinesByName, 
    findMedicineByName 
};
