const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

const captainSchema = new mongoose.Schema({
    shopname: {
        type: String,
        required: [true, 'Shop name is required'],
        
        minlength: [3, 'Shop name must be at least 3 characters long']
    },
    fullname: {
        firstname: {
            type: String,
            required: [true, 'First name is required'],
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long']
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    shop: {
        shop_address: {
            type: String,
            required: [true, 'Shop address is required'],
            minlength: [3, 'Shop address must be at least 3 characters long']
        },
        gstNumber: {
            type: String,
            required: [true, 'GST number is required'],
            match: [/^[0-9A-Z]{15}$/, 'GST Number must be exactly 15 characters']
        },
        licenseNumber: {
            type: Number,
            required: [true, 'License number is required'],
            min: [1, 'Give valid license number']
        },
        services: {
            type: [String],
            enum: ['Home Delivery', 'Online Orders'],
            default: []
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
        }
    },
    medicines: [medicineSchema]
});

// Add the 2dsphere index
captainSchema.index({ "shop.location": "2dsphere" });

// Methods
captainSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.methods.comparepassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashpassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

const Captain = mongoose.model('captain', captainSchema);
module.exports = Captain;