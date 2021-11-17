import express from "express";
import morgan from "morgan";
import allRoutes from "./allRutas";
require('dotenv').config();

const app = express();
var cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//RUTAS
app.use("/EX3", allRoutes);

const allrutas = require("./allRutas");
app.use(allrutas);

const { pg } = require("./database");

//DATABASE

//console.log(process.env.PORT);
app.listen(process.env.PORT || 5050, () => {
    console.log("Listen Server on port 5050");
});
    


