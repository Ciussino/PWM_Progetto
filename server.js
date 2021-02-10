const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const engine = require("ejs-mate");
const path = require("path");
const routes = require("./routes/routes");
require("dotenv/config");

const app = express();

app.use(express.static(__dirname + "/public/"));

app.set("views", path.join(__dirname, "/public/"));
app.engine("ejs", engine);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

//middleware per le sessionID
app.use(session({
    secret:"key",
    resave:"false",
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 //durata 1 ora
    }
}));

app.use("/", routes);

//connessione database
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
db.once("open", () => {
    console.log("Database connesso!")
});

//connessione server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server connesso sulla porta " + port + "!")
});