
const connection = require('../model/conexionBd');
const path = require("path");
const view_paciente = '../view/pacientes'
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/registrarPaciente', function (req, res) {
    let { nombre, identificacion, eps, telefono } = req.body;

    connection.connect(function (err) {
        if (err) console.log(err);

        var consulta = "INSERT INTO paciente(nombre, identificacion, eps, telefono) VALUES('" + nombre + "', '" + identificacion + "', '" + eps + "', '" + telefono + "')";

        connection.query(consulta, function (err, data) {
            let paciente = [{ nombre: nombre, identificacion: identificacion, eps: eps, telefono: telefono, id: data.insertId }];
            if (err) console.log(err);
            res.render(path.join(__dirname, view_paciente), { paciente });
        });
    });
});

module.exports = app