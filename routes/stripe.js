const router=require("express").Router();
const KEY=process.env.STRIPE_KEY
const stripe=require("stripe")(KEY);

router.post("/payment",(req,res)=>{
   stripe.charges.create({
    source:req.body.tokenId,   //when we make any payment stripe is gonna return us a token id which we use here
    amount:req.body.amount,
    currency:"INR",
   },(stripeErr,stripeRes)=>{
    if(stripeErr){
        res.status(500).json(stripeErr);
    } else{
        res.status(200).json(stripeRes);
    }
   });
});





module.exports=router;