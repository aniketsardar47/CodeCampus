require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes"); 
app.use("/api/auth", authRoutes); 


mongoose.connect(process.env.MONGO_URI)
.then(()=> app.listen(5001,()=>console.log("Server running successfully..")))
.catch((err)=>console.log(err));