const mongoose = require('mongoose');

const medicalschema = new mongoose.Schema({
    medicine_name: {
        type: String,
        required: true,
        minlength: [3, 'Medicine name must be at least 3 characters long']
    },
    category: {
        type: String,
        required: true,
        minlength: [3, 'Category must be at least 3 characters long']
    },
    price: {
        type: Number,
        required: true,
        min: [1, 'Price must be at least 1']
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    }
});

const medicalmodel = mongoose.model('medicine', medicalschema);

module.exports = medicalmodel;