const ErrorHandler = require("../utils/errorHandler");


module.exports=(err,req,res,next)=>{
    
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error"

    //Wrong Mongodb ID

    if(err.name === "CastError"){
        const message=`Resource not found, Invalid: ${err.path}`;
        err = new ErrorHandler(message,400)
    }
    
    // Mongoose duplicate Error

    if(err.code === 11000){
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message,400);
    }

    // Wrong jwt error

    // Wrong Jwt Token
    if(err.code === "JsonWebTokenError"){
        const message = `Json Web Token in invalid, Try again`;
        err = new ErrorHandler(message,400);
    }
    
    // JWT expire Token error

    if(err.code === "Token Expired Error"){
        const message = `Json web token is Expired,try again`;
        err = new ErrorHandler(message,400);
    }

  

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}