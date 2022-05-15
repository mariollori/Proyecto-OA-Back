import express from "express";
import morgan from "morgan";
import allRoutes from "./allRutas";
require('dotenv').config();

const app = express();
var cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
var corsOptions = {
origin: "https://oidoamigo.netlify.app",
// origin: "http://localhost:4200",
    optionsSuccessStatus: 200 
}
//RUTAS
app.use("/EX3", allRoutes);

const allrutas = require("./allRutas");
app.use(allrutas);

const { pg } = require("./database");

//DATABASE

//console.log(process.env.PORT);
app.listen(process.env.PORT || 5050,cors(corsOptions) ,() => {
    console.log("Listen Server on port 5050");
});
    


