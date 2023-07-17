const express = require('express');
const cors = require('cors'); // for cross orgin requests

const authRoutes = require("./routes/auth.js")

const app = express();
const PORT = process.env.PORT || 5000;

// allow us to call the environmental variable inside the node application
require('dotenv').config();
const accountSid = "AC38842b61b22bb338bd9e61c912c699e1";
const authToken = "7e390bd4f3fc948f1a7edda2dbbf27f4";
const messagingServiceSid = "MG4613a41ac607065f8e7b600ebb6d07b0";
const twilioClient = require('twilio')(accountSid, authToken);

// Middlewares
app.use(cors());
app.use(express.json());   //allow us to pass json payload from frontend to backend
app.use(express.urlencoded());


app.get('/', (req, res) => {
    res.send("Med Link Server scripts access Denied");
})
// we can test it only after deploying it
app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if (type === "message.new") {
        members
            .filter((member) => member.user_id !== sender.id) //exclude the sudouser
            .forEach(({ user }) => {
                if (!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName}-${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    }).then(() => {
                        console.log("Message send");
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            });

        res.status(200).send("Message send.");
    }
    return res.status(200).send("Not a new message request.");
})

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))