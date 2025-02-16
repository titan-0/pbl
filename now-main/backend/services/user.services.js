const usermodel = require('../models/user.model'); // Fixed typo

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