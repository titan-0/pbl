const checkLocation = (longitude, latitude) => {
    // Validate coordinates
    if (!longitude || !latitude) {
        throw new Error('Both longitude and latitude are required');
    }

    const lng = Number(longitude);
    const lat = Number(latitude);

    if (isNaN(lng) || lng < -180 || lng > 180) {
        throw new Error('Invalid longitude. Must be between -180 and 180');
    }

    if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new Error('Invalid latitude. Must be between -90 and 90');
    }

    // Return the validated coordinates in the correct order
    return { longitude: lng, latitude: lat };
};

module.exports = { checkLocation };