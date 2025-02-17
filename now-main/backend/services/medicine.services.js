const ShopModel = require('../models/medicaldata');

module.exports.addmedicine = async ({
    shop_name,
    medicine_name,
    category,
    price,
    quantity
}) => {
    if (!shop_name || !medicine_name || !category || !price || !quantity) {
        throw new Error('All fields are required');
    }

    const shop = await ShopModel.findOne({ shop_name });
    if (!shop) {
        throw new Error('Shop not found');
    }

    const isMedicineExist = shop.medicines.some(med => med.medicine_name === medicine_name);
    if (isMedicineExist) {
        throw new Error('Medicine already exists in this shop');
    }

    shop.medicines.push({ medicine_name, category, price, quantity });
    await shop.save();
    return shop;
};

module.exports.findMedicineByName = async (shop_name, medicine_name) => {
    const shop = await ShopModel.findOne({ shop_name });
    if (!shop) {
        throw new Error('Shop not found');
    }

    return shop.medicines.find(med => med.medicine_name === medicine_name);
};