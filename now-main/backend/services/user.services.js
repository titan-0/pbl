const usermodel = require('../models/user.model'); // Fixed typo
const Order = require('../models/order.model'); // Import the order model

module.exports.createuser = async ({ firstname, lastname, email, password }) => {
    // Validate required fields
    if (!firstname || !email || !password) {
        throw new Error('All fields are required');
    }

    try {
        // Create the user in the database
        const user = await usermodel.create({
            fullname: {
                firstname,
                lastname
            },
            email,
            password
        });

        return user;
    } catch (error) {
        // Handle errors (e.g., duplicate email, database errors)
        throw new Error(`Error creating user: ${error.message}`);
    }
};
module.exports.placeOrder = async ({ email, storeemail, medicineName, quantity, address, number }) => {
    // Validate required fields
    if (!email || !storeemail || !medicineName || !quantity || !address || !number) {
        throw new Error('All fields are required');
    }

    try {
        // Create the order in the database
        const order = await Order.create({
            email:storeemail, // Store's email
            useremail:email,
            medicineName,
            quantity,
            address,
            phone:number,
            status: 'pending' // Default status
        });

        return order;
    } catch (error) {
        // Handle errors (e.g., duplicate order, database errors)
        throw new Error(`Error placing order: ${error.message}`);
    }
}