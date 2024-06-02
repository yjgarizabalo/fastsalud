const connection = require('../model/conexionBd');
const express = require("express");
const bodyParser = require("body-parser");
const bcryptjs = require('bcryptjs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// AUTENTICAR
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    if (user && password) {
        connection.query('SELECT * FROM admin WHERE user = ?', [user], async (err, result) => {
            if (err) {
                console.error('Error en la consulta a la base de datos:', err);
                res.render('../view/iniciarSesion', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error en la base de datos",
                    alertIcon: 'error',
                    showCancelButton: false,
                    time: false,
                    ruta: 'iniciarSesion'
                });
                return;
            }

            if (!result || result.length === 0 || !(await bcryptjs.compare(password, result[0].password))) {
                res.render('../view/iniciarSesion', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña o usuario incorrectos",
                    alertIcon: 'error',
                    showCancelButton: false,
                    time: false,
                    ruta: 'iniciarSesion'
                });
                return;
            }

            // Autenticación exitosa
            req.session.iniciado = true;
            req.session.nombre = result[0].nombre;
            res.render('../view/iniciarSesion', {
                alert: true,
                alertTitle: "Bien",
                alertMessage: "Autenticación correcta",
                alertIcon: 'success',
                showCancelButton: false,
                time: 1500,
                ruta: ''
            });
        });
    } else {
        res.render('../view/iniciarSesion', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese usuario y contraseña, por favor.",
            alertIcon: 'warning',
            showCancelButton: false,
            time: 1500,
            ruta: 'iniciarSesion'
        });
    }
});

module.exports = app;
