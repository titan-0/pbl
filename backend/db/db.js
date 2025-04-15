require('dotenv').config();
const mongoose = require('mongoose');

function connectdb() {
    const dbUri = process.env.DB_CONNECT;

    if (!dbUri) {
        console.error('Error: DB_CONNECT environment variable is not defined');
        return;
    }

    mongoose.connect(dbUri)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(err => {
            console.error('Error connecting to DB:', err);
        });
}

module.exports = connectdb;
