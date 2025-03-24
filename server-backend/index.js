require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const app = express();

app.use(express.json());
app.use(cors);

mongoose.connect(process.env.MONGO_URI)
.then(()=> app.listen(5000,()=>console.log("Server running successfully..")))
.catch((err)=>console.log(err));