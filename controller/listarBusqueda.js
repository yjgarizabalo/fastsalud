const connection = require('../model/conexionBd');
const path = require("path");
const listarpaciente = '../view/buscarPaciente'
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/buscar', function (req, res) {
    var { identificacion } = req.query

    var consulta = `SELECT * FROM paciente WHERE identificacion LIKE  "%${identificacion}%" `;
    connection.query(consulta, function (err, data) {
        if (err) console.log(err);
        res.render(path.join(__dirname, listarpaciente), { paciente: data });
    });

})

module.exports = app