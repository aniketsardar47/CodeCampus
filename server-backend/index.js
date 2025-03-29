require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

app.options('/api/v2/execute', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send();
});


const authRoutes = require("./routes/authRoutes"); 
app.use("/api/auth", authRoutes); 

const userRoute = require("./routes/userRoute");
app.use("/api",userRoute);


mongoose.connect(process.env.MONGO_URI)
.then(()=> app.listen(5001,()=>console.log("Server running successfully..")))
.catch((err)=>console.log(err));

mongoose.connection.on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
});
