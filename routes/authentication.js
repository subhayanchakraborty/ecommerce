const router=require("express").Router();
const User=require("../models/User");
const CryptoJS=require("crypto-js");
const jwt =require("jsonwebtoken");
//Register
//we will create new user when when we get post request using user model
router.post("/register",async(req,res)=>{
   const newUser= new User({
    username:req.body.username,
    email:req.body.email,
    password:CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
   });
   //till now we have not created our user in db,...to store in db we do save method
   try{
    const savedUser=await newUser.save();
    res.status(201).json(savedUser);
   }catch(err){
    res.status(500).json(err);
   }
})

//Login
router.post("/login",async(req,res)=>{
   try{
     const user=await User.findOne({username:req.body.username});
     !user && res.status(401).json("wrong credentials");
     const hashedPassword=CryptoJS.AES.decrypt(user.password,process.env.PASS_SEC);
     const Originalpassword =hashedPassword.toString(CryptoJS.enc.Utf8);
     Originalpassword!==req.body.password && res.status(401).json("wrong credentials");

     //after login is ok i will assign jsonwebtoken
     const accessToken=jwt.sign({
      id:user._id,
      isAdmin:user.isAdmin
     },process.env.JWT_SEC,{expiresIn:"2d"})


     //i will send user details except password
     const { password,...others}=user._doc;  //._doc because mongodb stores document in this folder so if we use this extra things will not get displayed to user
     res.status(200).json({...others,accessToken});
   }catch(err){
      res.status(500).json(err);
   }
 
});






module.exports =router;