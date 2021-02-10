const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrenotaSchema = new Schema({
    data: {
        type: String,
        required: [true, "Data obbligatoria"]
    },
    aula: {
        type: String,
        required: [true, "Aula obbligatoria"]
    },
    responsabile: {
        type: String
    },
    postiDisponibili: {
        type: Number
    },
    utente: {
        type: String
    } 
});

const Prenota = mongoose.model("prenota", PrenotaSchema);
module.exports = Prenota;
