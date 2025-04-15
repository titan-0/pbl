const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    medicine_name: {
        type: String,
        required: [true, 'Medicine name is required'],
        minlength: [3, 'Medicine name must be at least 3 characters long']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        minlength: [3, 'Category must be at least 3 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [1, 'Price must be at least 1']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    }
});

const shopSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    location: {
        type: { 
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: [true, 'Location coordinates are required']
        }
    },
    shopname: {
        type: String,
        required: [true, 'Shop name is required'],
        minlength: [3, 'Shop name must be at least 3 characters long']
    },
    medicines: [medicineSchema] // Medicines stored as an array
});
shopSchema.index({ "location": "2dsphere" });


const ShopModel = mongoose.model('Shop', shopSchema);

module.exports = ShopModel;


