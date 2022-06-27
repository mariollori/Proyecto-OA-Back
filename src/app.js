require('dotenv').config();
const express =require('express');
const morgan = require('morgan');
const routes =require('./allRutas');
const cors = require("cors");
const app = express();
var corsOptions = {
    origin: "https://oidoamigo.netlify.app",
    // origin: "http://localhost:4200",
    optionsSuccessStatus: 200 
}
const allrutas = require("./allRutas");


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/EX3", routes);

app.get('/',function(req,res){
 res.send('Bienvenido a Oido Amigo')
})
app.listen(process.env.PORT || 5050,cors(corsOptions) ,() => {
    console.log("Listen Server on port 5050");
});
    


