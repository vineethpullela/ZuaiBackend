const jwt = require("jsonwebtoken");


module.exports=function(req,res,next){
    try{
        let token= req.header("x-token");
        if(!token){
            return res.status(400).send("toekn not found");
        }
        let decode = jwt.verify(token,"jwtSecret");
        req.user=decode.user
        next();

}catch(err){
    console.log("error");
}

}

