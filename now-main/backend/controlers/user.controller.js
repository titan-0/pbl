const usermodel = require('../models/user.model');
const userservies = require('../services/user.services');
const {validationResult} = require('express-validator');
const blacklisttokenmodel=require('../models/blacklist.model');

module.exports.registeruser=async(req,res,next)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {fullname,email,password}=req.body;
    const isuseralreadyexist = await usermodel.findOne({email});
    if(isuseralreadyexist){
        return res.status(400).json({msg:'User already exist'});
    }

    const hashpassword = await usermodel.hashpassword(password);

    const user = await userservies.createuser({
        firstname: fullname.firstname,lastname: fullname.lastname,email,password: hashpassword
    });
    const token = user.generateAuthToken();

    res.status(201).json({token,user});
}

module.exports.loginuser=async(req,res,next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;
    const user = await usermodel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({msg:'Invalid Email or Password'});
    }

    const isMatch = await user.comparepassword(password);
    if(!isMatch){
        return res.status(401).json({msg:'Invalid Email or Password'});
    }

    const token = user.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({token,user});
}
module.exports.getuserprofile=async(req,res,next)=>{
      res.status(200).json(req.user);
}
module.exports.logoutuser=async(req,res,next)=>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blacklisttokenmodel.create({token});

    res.status(200).json({msg:'Logged out successfully'});
}