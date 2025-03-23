const checkLocation = (latitude, longitude) => {
    if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid location coordinates');
    }

    if (lat < -90 || lat > 90) {
        throw new Error('Invalid latitude value');
    }

    if (lng < -180 || lng > 180) {
        throw new Error('Invalid longitude value');
    }

    return { latitude: lat, longitude: lng };
};

module.exports = { checkLocation };