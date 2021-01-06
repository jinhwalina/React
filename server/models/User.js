const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        minlength: 5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{ // 이걸로 관리자 권한을 설정할 수 있다. 기본값은 0
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save', function( next ){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next() // 비밀번호 말고 다른걸 바꿀 때는 그냥 나갈 수 있도록. 아니면 그냥 여기 갇히게된다.
    }
})

userSchema.methods.comparePassword = function(plainPassword,cb){
    // plain 평범한 암호! 암호화된 비밀번호! 둘이 맞는지 확인을 해야함 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    // jsonwebtoken을 이용해서
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // user._id + '' = token
    // 토큰을 decode 한다.  
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token 과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

const User = mongoose.model('User', userSchema)
module.exports = { User }