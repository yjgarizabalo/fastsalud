
const connection = require('../model/conexionBd');
const path = require("path");
const view_paciente = '../view/pacientes'
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// SESSION
const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))



app.post('/registrarPaciente', function (req, res) {
    let { nombre, identificacion, eps, telefono } = req.body;
    console.log(session.Cookie.length);
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