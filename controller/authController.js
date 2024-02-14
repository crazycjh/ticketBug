// const crypto = require('crypto');
// const { promisify } = require('util');

const { UserInfo } = require('../models/userModel')

const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// 設定JWT
const secretKey = process.env.JWT_SECRETKEY

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

// 建立JWT
const signToken = ( email ) => {
    return jwt.sign(
        { email }, 
        secretKey, 
        {
            expiresIn:process.env.JWT_EXPIRES_IN
        }
    )
} 

const createSendToken = ( email, statusCode, res ) => {
    const token = signToken( email );
    
    // 設定回傳Cookie的options
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
    }

    // 產品模式改成HTTPS
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    res.cookie('isLogin', true);
    res.cookie('email', email);
    
    res.status(statusCode).redirect('http://localhost:5173/membercenter');

}

exports.googleAuth = (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ]
    const url = oAuth2Client.generateAuthUrl({
        scope: scopes,
        prompt: 'consent',
    })
    res.redirect(url);
}

exports.googleAuthCallback = async(req, res) => {
    let statusCode;
    const code = req.query.code;
    
    // get access token
    const {tokens} = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // 設定people的設定，這是用來存取使用者資料
    const people = google.people({ version: 'v1', auth: oAuth2Client });
    // 取得user profile
    const me = await people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
    });

    // 使用者相關帳號建立或是讀取資料
    // 確認是否已經存在

    

    // 存在/不存在都回傳相關帳號資料
    const result = await findUser(me.data.emailAddresses[0].value)
    
    //不存在 -> 建立帳號
    if(!result) {
        createAccountByGoogleLogin(me.data.emailAddresses[0].value)
        // 創建新的
        statusCode = 201;
        
    }else {
        statusCode = 200;
    }
    
    createSendToken(me.data.emailAddresses[0].value, statusCode, res);
    // console.log(me.data.emailAddresses[0].value);

    

}

async function findUser(email) {
    const user = await UserInfo.findOne({where: {email: email}});
    return user;
}
// const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
function createAccountByGoogleLogin(email) {
    // 建立base on Google登入的帳號，密碼會是空的，下次使用者可以透過忘記密碼幫忙建立一個，再由使用者修改，或是進到設定設定密碼
    const result = UserInfo.create({ email:email, google:true})
}

// 建立使用者