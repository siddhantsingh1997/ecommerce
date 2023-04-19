const mongoose  = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");




const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"Name can not exceed 30 character"],
        minLength:[4,"Name should have more than 4 character"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minLength:[8,"Password Should not be greater than 8 character"],
        select:false
    },
    avatar:{
            public_id: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
          },
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken: String,
    resetPasswordDate:Date,
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });

// JWT TOKEN

userSchema.methods.getJWTTOKEN =function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// Compare Password

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

//Generating Passowrd Reset Token

userSchema.methods.getResetPasswordToken = async function(){
     
    // Generating Token
    const resetToken = crypto.randomBytes(20);

    // Hashing and reseting password token to username

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpirt = Date.now() + 15 * 60 * 1000
    
    return resetToken;
}


module.exports = mongoose.model("User",userSchema);