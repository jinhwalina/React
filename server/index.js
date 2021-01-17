const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/dev');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json()); // 이 부분에 오타가 있었는데 어떻게 에러가 안났을까...
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected..'))
.catch(err => console.log(err))


app.get('/', (req, res) => { res.send('안녕하세요 !! 이게 몇번째야!') })

app.get('/api/hello', (req, res) => {    res.send("안녕하세요~!") })


app.post('/api/users/register', (req, res)=> {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 DB에 넣어준다. 

    const user = new User(req.body)
    user.save((err, userInfo) => {
        // 몽고DB에서 오는 메서드
        // 이렇게 써주면 위에 있는 정보들이 DB에 저장되는것임.
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


app.post('/api/users/login', (req, res) => {

    User.findOne({ email: req.body.email }, (err,user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다!"
            })
        }
        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다!"})
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                // 토큰을 저장한다. 어디에?! 쿠키, 로컬스토리지..등..
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})

app.get('/api/users/auth', auth , (req, res)=> {

    // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true 라는 말 
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        // role 1 Admin     role 2 특정 부서 Admin
        // role 0 > 일반 유저   role 0 이 아니면 관리자 
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    console.log(1)
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
    , (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })