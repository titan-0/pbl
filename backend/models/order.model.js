const mongoose = require('mongoose'); // Change import to CommonJS

const orderSchema = new mongoose.Schema({
  email: { // store's email
    type: String,
    required: true
  },
  useremail: { // customer's email
    type: String,
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order; // Change export to CommonJS
