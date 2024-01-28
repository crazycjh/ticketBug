// const crypto = require('crypto');
// const { promisify } = require('util');
// const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);



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

    
    console.log(me.data);

    res.redirect('http://localhost:5173');

}