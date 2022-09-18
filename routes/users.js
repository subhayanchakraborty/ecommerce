const router=require("express").Router();
const User = require("../models/User");
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}=require("./verifyToken");

//put because we are updating
//update
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    if(req.body.password){  //if the user updates password i have to encrypt it again
        password:CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
    }
    try{
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{
            $set:req.body   //take everything from body and set it again
        },{new:true});
        res.status(200).json(updatedUser);  
    } catch(err){
        res.status(500).json(err);
    }
});

//Delete
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
     await User.findByIdAndDelete(req.params.id);
     res.status(200).json("user has been deleted successfully");
     } catch(err){
       res.status(500).json(err);
    }
});
//GET User(only admin can get user)
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
     const user =await User.findById(req.params.id);
     const { password,...others}=user._doc;
     res.status(200).json(others);
     } catch(err){
       res.status(500).json(err);
    }
});

//GET ALL Users
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    //if there is any query linke localhost:3000/api/users?new=true
    const query=req.query.new
    try{
     const users =query? await User.find().sort({_id:-1}).limit(5):await User.find();  //if there is query new then last 5users will be shown else all users
     res.status(200).json(users);
     } catch(err){
       res.status(500).json(err);
    }
});

//GET USER STATS(it will show total users per month)
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    var date=new Date();
    var lastYear=new Date(date.setFullyear(date.getFullyear() -1)); //it will return last year today
    try{
      //to group my items use mongodb aggregate
      var data=await User.aggregate([
        { $match:{ createdAt:{$gte:lastYear}}},
        { $project:{month:{ $month:"$createdAt"} },
      },
      {
        $group:{
            _id:"$month",
            total:{$sum:1},
        }
      }
      ]);
      res.status(200).json(data);
    }catch(err){
     res.status(500).json(err);
    }
});

module.exports =router;