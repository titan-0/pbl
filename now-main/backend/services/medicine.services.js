const medicalmodel = require('../models/medicaldata');

module.exports.addmedicine = async ({
    medicine_name,
    category,
    price,
    quantity
}) => {
    if (!medicine_name || !category || !price || !quantity) {
        throw new Error('All fields are required');
    }

    const medicine = new medicalmodel({
        medicine_name,
        category,
        price,
        quantity
    });

    await medicine.save();
    return medicine;
};

module.exports.findMedicineByName = async (medicine_name) => {
    return await medicalmodel.findOne({ medicine_name });
};