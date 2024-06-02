const express = require("express");
const cors = require("cors"); // for cross orgin requests
// allow us to call the environmental variable inside the node application
require("dotenv").config();

const authRoutes = require("./routes/auth.js");

console.log(process.env.PORT);
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); //allow us to pass json payload from frontend to backend
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Dr.Chat Server side scripts access Denied");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
