const { verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Cart=require("../models/Cart");
const router=require("express").Router();

//CREATE
router.post("/", verifyToken,async(req,res)=>{
 const newCart= new Product(req.body)  //we will take everything that is inside the body
 try{
  const savedCart= await newCart.save();
  res.status(200).json(savedCart);
 }catch(err){
    res.status(500).json(err);
 }
});

//update
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const updatedCart=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body   //take everything from body and set it again
        },{new:true});
        res.status(200).json(updatedCart);  
    } catch(err){
        res.status(500).json(err);
    }
});

//Delete
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
     await Cart.findByIdAndDelete(req.params.id);
     res.status(200).json("cart has been deleted successfully");
     } catch(err){
       res.status(500).json(err);
    }
});

// //GET USER Cart
router.get("/find/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
     const cart =await Cart.find({userId:req.params.userId});
     res.status(200).json(cart);
     } catch(err){
       res.status(500).json(err);
    }
});

// //GET ALL 
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    try{
     const carts=await Cart.find();
     res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err);
    }
})







module.exports =router;