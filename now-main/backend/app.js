const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();

const connecttodb = require('./db/db');
const userroutes = require('./routes/user.routes');
const captainroutes = require('./routes/captain.routes');
const medicineroutes = require('./routes/medical.routes');


const cookieparser = require('cookie-parser');
connecttodb();

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.get('/', (req, res) => {
    res.send('hello world');
});


app.use('/users', userroutes);
app.use('/captains', captainroutes);
app.use('/medicines', medicineroutes);
app.use('/maps', require('./routes/map.routes'));
module.exports = app;