const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Prenota = require("../models/prenota");
const bcrypt = require("bcryptjs");
// const path = require("path");

//funzione di autenticazione
const isAuth = (req,res,next) => {
    if(req.session.isAuth){
        next()
    } else {
        res.redirect("/login");
    }
};

router.get("/", (req,res) => {
    if(!isAuth){
        res.redirect("/login")
    }else{
        res.redirect("/prenota")
    } 
});

/*  CANCELLATO /REGISTER IN QUANTO UTILIZZATO SOLO PER INSERIRE GLI UTENTI NEL DB 
router.get("/register", (req,res) => {
    res.sendFile(path.join(__dirname, "../public/registra/register.html"))
});

router.post("/register", async (req,res) => {
    const {username, usertype, password} = req.body;
    var user = await User.findOne({username});
    
    if(user) {
        return res.redirect("/register");
    }

    //Hash della password
    const hashedPsw = await bcrypt.hash(password, 12);

    user = new User({
        username,
        usertype,
        password: hashedPsw
    })

    await user.save();
    res.redirect("/login");
}); */


router.get("/login", (req,res) => {
    res.render("login/login", {message: ""});
});

router.post("/login", async (req,res) => {
    
    const {username, usertype, password} = req.body;
    
    var user = await User.findOne({username, usertype});

    if(!user){
        res.render("login/login", {message: "Nome utente e/o Password errati!"});
    }
    
    const checkPsw = await bcrypt.compare(password, user.password);
    if(!checkPsw){
        res.render("login/login", {message: "Nome utente e/o Password errati!"});
    }

    req.session.isAuth = true;
    utenteCheck = req.body.username;
    res.redirect("/prenota");
});

router.get("/prenota", isAuth, (req,res) => {
    res.render("prenota/prenota", {message: "", success: ""});   
});

router.post("/prenota", (req,res) => {
    const {data, aula} = req.body;
    const utente = utenteCheck;
    var responsabile;
    if(aula=="1A" || aula=="1B"){
        responsabile = "Paolo Ceravolo";
    } else{
        responsabile = "Mario Rossi";
    };
    var postiDisponibili;
    if(aula=="1A" || aula=="2A"){
        postiDisponibili = 2;
    } else{
        postiDisponibili = 3;
    };
    
    var today = new Date();
    var mese = today.getMonth()+1;
	if(mese<10){
		mese = "0" + mese;
	}
	var gg = today.getDate();
	if(gg<10){
		gg = "0" + gg;
	}

    var oggi = today.getFullYear() + "-" + mese + "-" + gg;
    
    Prenota.countDocuments({data: data, utente: utente}, (err, countPerData) => {
        if(err){
            console.log(err);
        } 
        else if(countPerData > 0) {
            res.render("prenota/prenota", {message: "Prenotazione già esistente per la data selezionata!", success: ""});
        }
        else(Prenota.countDocuments({utente: utente, data: {$lt: oggi}}, (err, countScadute) => {
            if(err) {
                console.log(err);
            }
            else(Prenota.countDocuments({utente: utente}, (err, countPerUtente) => {
                if(err){
                    console.log(err);
                }
                else if(countPerUtente - countScadute > 4) {
                    res.render("prenota/prenota", {message: "Raggiunto il numero massimo di prenotazioni contemporanee!", success: ""});
                }
                else(Prenota.countDocuments({data: data, aula: aula}, async (err, countPostiAula) => {
                    if(err){
                        console.log(err);
                    }
                    else if(countPostiAula == postiDisponibili) {
                        res.render("prenota/prenota", {message: "L'aula selezionata risulta al completo!", success: ""});
                    } 
                    else {
                    prenota = new Prenota({
                        data,
                        aula,
                        responsabile,
                        postiDisponibili,
                        utente
                    })

                    await prenota.save();
                    res.render("prenota/prenota", {message: "", success: "Prenotazione avvenuta con successo!"});
                    }
                }));
            }));
        }));
    }); 
});

router.get("/view", isAuth, async (req, res) => {
    const utente = utenteCheck;
    var today = new Date();

    var mese = today.getMonth()+1;
	if(mese<10){
		mese = "0" + mese;
	}
	var gg = today.getDate();
	if(gg<10){
		gg = "0" + gg;
	}

    var oggi = today.getFullYear() + "-" + mese + "-" + gg;
    const prenota = await Prenota.find({utente, "data": {$gte: oggi}}).sort("data");
    res.render("view/index", {prenota: prenota, message: ""});
});

//cancellare la prenotazione
router.post("/view/:id", async (req, res) => {
    await Prenota.findByIdAndRemove({_id: req.params.id}, {useFindAndModify: false});

    const utente = utenteCheck;
    var today = new Date();
    var mese = today.getMonth()+1;
	if(mese<10){
		mese = "0" + mese;
	}
	var gg = today.getDate();
	if(gg<10){
		gg = "0" + gg;
	}

    var oggi = today.getFullYear() + "-" + mese + "-" + gg;
    const prenota = await Prenota.find({utente, "data": {$gte: oggi}}).sort("data");

    res.render("view/index", {prenota: prenota, message: "Prenotazione eliminata con successo!"});
});

router.post("/logout", (req,res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect("/");
    });
});

module.exports = router;