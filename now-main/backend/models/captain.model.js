const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainschema = new mongoose.Schema({
    shopname:{
        type:String,
        required: true,
        minlength:[3,'Shop name must be atleast 3 characters long']
    },
    fullname:{
        firstname:{
            type:String,
            required: true,
            minlength:[3,'First name must be atleast 3 characters long']
        },
        lastname:{
            type:String,
            minlength:[3,'Last name must be atleast 3 characters long']
        }
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        match:[/^\S+@\S+\.\S+$/,'Please enter a valid email']
    },
    password:{
        type:String,
        required: true,
        select:false,
        minlength:[6,'password must be of length 6 or greater than 6']
    },
    socketid:{
        type:String
    },
    status:{
        type:String,
        ennum:['active','inactive'],
        default:'inactive',
    },
    shop:{
        shop_address:{
        type:String,
        required: true,
        minlength:[3,' Shop address must be atleast 3 characters long']
        },
        
        gstNumber:{
            type:Number,
            required: true,
            min:[1,'Give valid GST number']
        },
        licenseNumber:{
            type:Number,
            required: true,
            min:[1,'Give valid licence number']
        },
        services: {
            type: [String],  // Example: ["Home Delivery", "Online Orders"]
            enum: ['Home Delivery', 'Online Orders', 'Emergency Medicines', 'Insurance Accepted'],
            default: []
        },
        location:{
            lat:{
                type:Number,
            },
            lng:{
                type:Number,
            }
        }
    }
})

captainschema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}
captainschema.methods.comparepassword = async function(password){
    const isMatch = await bcrypt.compare(password,this.password);
    return isMatch;
}
captainschema.statics.hashpassword = async function(password){
    const hashpassword = await bcrypt.hash(password,10);
    return hashpassword;
}

const captainmodel = mongoose.model('medical',captainschema);

module.exports = captainmodel;