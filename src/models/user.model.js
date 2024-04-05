const mongoose = require('mongoose')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
    {
    username:  {
        type:String,
        unique: true,
        required:true,
        lowercase:true,
        trim:true,
        index:true
},

email:  {
    type:String,
    unique: true,
    required:true,
    lowercase:true,
    trim:true,
    
},
fullname:  {
    type:String,
    unique: true,
    required:true,
    
    index:true
},

avatar:  {
    type:String, // Cludinary url
    required:true,
},
coverImage:  {
    type:String, // Cludinary url
   
},
watchHistory:  [{
    type: Schema.Types.ObjectId,
    ref:"Video"

}],
password: {
    type: String,
    required: [true, "Password Is Required "]
},
refreshToken: {
    type:String,
}
},
{
    timestamps:true,
}

)
userSchema.pre("save",  async function (next){
    if(!this.isModifed ("password"))  return(next)
   this.password = bcrypt.hash(this.password, 10)
next()
})

userSchema.methods.isPasswordCorrect=  async function (password) {
return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken= function (){
 return   jwt.sign({
        _id= this.-id,
        email= this.email,
        username= this.username,
        fullname= this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : ACCESS_TOKEN_EXPIRY
        
    }
    )
}
userSchema.methods.generateRefreshToken= function() {
    return   jwt.sign({
        _id= this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : REFRESH_TOKEN_EXPIRY
        
    }
    )
}
const  user =  mongoose.model("User", userSchema)
module.exports = user