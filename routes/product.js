const router=require("express").Router();
const Product = require("../models/Product");
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}=require("./verifyToken");



//CREATE
router.post("/", verifyTokenAndAdmin,async(req,res)=>{
 const newProduct= new Product(req.body)  //we will take everything that is inside the body
 try{
  const savedProduct= await newProduct.save();
  res.status(200).json(savedProduct);
 }catch(err){
    res.status(500).json(err);
 }
});

//update
router.put("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body   //take everything from body and set it again
        },{new:true});
        res.status(200).json(updatedProduct);  
    } catch(err){
        res.status(500).json(err);
    }
});

//Delete
router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
     await Product.findByIdAndDelete(req.params.id);
     res.status(200).json("product has been deleted successfully");
     } catch(err){
       res.status(500).json(err);
    }
});

//GET Product
router.get("/find/:id",async(req,res)=>{
    try{
     const product =await Product.findById(req.params.id);
     res.status(200).json(product);
     } catch(err){
       res.status(500).json(err);
    }
});

//GET ALL Products
router.get("/",async(req,res)=>{
    //now we will have two queries fetch by new and fetch by categories
    const qnew=req.query.new;
    const qcategory=req.query.category;
    try{
        let products;
        if(qnew){
            products=await Product.find().sort({createdAt:-1}).limit(5)
        } else if(qcategory){
            products=await Product.find({categories:{
                $in:[qcategory],
            }})
        } else {
            products=await Product.find();
        }
     
     res.status(200).json(products);
     } catch(err){
       res.status(500).json(err);
    }
});


module.exports =router;