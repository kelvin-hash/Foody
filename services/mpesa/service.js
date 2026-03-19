const {
    CONSUMER_KEY,
    CONSUMER_SECRET,
    SHORT_CODE,
    BASE_URL,
    PASSKEY,
    CALLBACK_BASE_URL
} = process.env
const axios = require('axios');
const authUrl = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
const moment = require("moment")

const getAccessToken = async ()=>{
    // 
    // encode consumer keys in base64
    const encoded = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    //
    // make a get request to the auth endpoint
    const token = await axios.get(`${authUrl}`,{
        headers:{
            Authorization:`Basic ${encoded}`
        }
    });
    //
    // return the access token
    return token.data.access_token;
};
// generate timestamp in YYYYMMDDHHmmss format
const generateTimeStamp =()=>{
  return moment().format("YYYYMMDDHHmmss")
};
const generatePassword =()=>{
    const timestamp = generateTimeStamp();
    // generate password using passley and timestamp
    const password = Buffer.from(`${SHORT_CODE}${PASSKEY}${timestamp}`).toString("base64");
    // teturn the timestamp and password which are needed for the stk push
    return { password, timestamp };
};
// the stk push function respaonsible for the actual prompt
const stkPush = async (amount,phone)=>{
    // get the auth token
    const authToken=await getAccessToken();
    // get the pass and timestamp
    const {password,timestamp}=generatePassword();
    // make a post call to the mpesa api
    const response = await axios.post(`${BASE_URL}`,
        {
            BusinessShortCode: SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: SHORT_CODE,
            PhoneNumber: phone,
            CallBackURL: `${CALLBACK_BASE_URL}/api/mpesa/callback`,
            AccountReference: "TestPayment",
            TransactionDesc: "Testing STK Push"
        },
        {
            headers:{
                Authorization:`Bearer ${authToken}`
            }
        }
    );
    return response.data

};
module.exports={getAccessToken,generatePassword,stkPush};

