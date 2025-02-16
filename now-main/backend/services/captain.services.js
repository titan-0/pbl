const captainmodel = require('../models/captain.model');

module.exports.createcaptain = async ({
    shopname,
    fullname,
    email,
    password,
    shop
}) => {
    if (!fullname || !email || !password || !shop || !shopname) {
        throw new Error('All fields are required');
    }

    // Hash the password
    const hashedPassword = await captainmodel.hashpassword(password);

    const captain = new captainmodel({
        shopname,
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password: hashedPassword,
        shop: {
            shop_address: shop.shop_address,
            gstNumber: shop.gstNumber,
            licenseNumber: shop.licenseNumber,
            services: shop.services,
            location: {
                lat: shop.location.lat,
                lng: shop.location.lng
            }
        }
    });

    await captain.save();
    return captain;
};

module.exports.findCaptainByEmail = async (email, includePassword = false) => {
    if (includePassword) {
        return await captainmodel.findOne({ email }).select('+password');
    }
    return await captainmodel.findOne({ email });
};