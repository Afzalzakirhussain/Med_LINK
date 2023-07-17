const stream = require('getstream');
const bcrypt = require("bcrypt");
const StreamChat = require('stream-chat').StreamChat;
const crypto = require("crypto");

// require('dotenv').config();
// const API_KEY = process.env.STREAM_API_KEY;
// const API_SECRET = process.env.STREAM_API_SECRET;
// const APP_ID = process.env.STREAM_APP_ID;

// NEW 
const API_KEY = "vv9mmtcardg3";
const API_SECRET = "x6n4nu64ht7ng9hzmy3ykhh72xh23r2uaqvmwt868dewy3h7h2k4th9h64n22bjf";
const APP_ID = "1257971";

// const API_KEY = "jwdbahpgmdbp";
// const API_SECRET = "9zjsg6h5fedunzt5x2desyx6fpvmsez2f3vxn56ugt7t2hb8kt4qbfw9wkbjfx5p";
// const APP_ID = "1249113";


const signup = async (req, res) =>
{
    try
    {
        const { fullName, userName, phoneNumber, password } = req.body //we get all datas in req.body , de-structuring to extract the specific ones.
        // create a random user id for each user
        const userId = crypto.randomBytes(16).toString("hex");

        // connection to stream (server connection db)
        const serverClient = stream.connect(API_KEY, API_SECRET);

        // create hashed password encription level=10
        const hashedPassword = await bcrypt.hash(password, 10);

        const token = serverClient.createUserToken(userId);

        // return data to front-end (we also get the username fullname phonenumber in the front-end but we are passing it from the backed to make it more secure.)
        res.status(200).json({ token, fullName, userName, userId, hashedPassword, phoneNumber });

    } catch (error)
    {
        console.log(error);

        res.status(500).json({ message: error });
    }
};


const login = async (req, res) =>
{
    try
    {
        const { userName, password } = req.body;

        //connect to server
        const ServerClient = stream.connect(API_KEY, API_SECRET, APP_ID);

        // create a new instance of streamchat (get the instance of currend user)
        const client = StreamChat.getInstance(API_KEY, API_SECRET);

        // take all user from db and make query to match the requested username
        const { users } = await client.queryUsers({ name: userName });

        if (!users.length) return res.status(400).json({ message: "USER_NOT_FOUND" });

        // compare the password and hashedpassword of current user 
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        //passing the specific user id (not new userid passing existing id in the db)
        const token = ServerClient.createUserToken(users[0].id);

        if (success)
        {
            res.status(200).json({ token, fullName: users[0].fullName, userName, userId: users[0].id })
        } else
        {
            res.status(400).json({ message: "INCORRECT_PASSWORD" });
        }

    } catch (error)
    {
        res.status(500).json({ message: error });
        // reg contains the data that are sended from front-end
    }
}


module.exports = { signup, login }
