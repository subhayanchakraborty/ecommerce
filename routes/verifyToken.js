const jwt =require("jsonwebtoken");


const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token //inside headers we write our token in postman
    if(authHeader){   //if token is present
        const token=authHeader.split(" ")[1];
    jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
        if(err) res.status(403).json("token is not valid"); //it can be expired or wrong token

        req.user=user;
        next(); //it will leave this function and go to our router
    })
    }else {
        return res.status(401).json("you are not authenticated");
    }
};

const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        //first of all i have to decide whether this token belongs to client or admin
    if(req.user.id===req.params.id|| req.user.isAdmin){    //they are same user or admin then they can update
     next();
    } else{
        res.status(403).json("you are not allowed to do that");
    }
    });
};
const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
    if(req.user.isAdmin){    
     next();
    } else{
        res.status(403).json("you are not allowed to do that");
    }
    });
};

module.exports={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};