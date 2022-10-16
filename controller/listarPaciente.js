const connection = require('../model/conexionBd');
const path = require("path");
const view_paciente = '../view/pacientes'
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/pacientes', function (req, res) {

    var consulta = `SELECT * FROM paciente `;
    connection.query(consulta, function (err, data) {
        if (err) console.log(err);
        res.render(path.join(__dirname, view_paciente), { paciente: data });
    });

})

module.exports = app