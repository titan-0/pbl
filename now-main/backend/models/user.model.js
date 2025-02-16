const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userschema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required: true,
            minlength:[3,'first name must be atleast 3 chars'],
        },
        lastname:{
            type: String,
            minlength:[3,'last name must be atleast 3 chars'],
        }
    },
    email:{
        type: String,
        required:true,
        unique:true,
        minlength:[5,'email must be atleast 3 chars'],
    },
    password:{
        type:String,
        required: true,
        select:false,
    },
    socketid:{
        type:String,
    },
    
})

userschema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userschema.methods.comparepassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userschema.statics.hashpassword = async function (password) {
    return await bcrypt.hash(password,10);
}

const usermodel = mongoose.model('user',userschema);

module.exports=usermodel;