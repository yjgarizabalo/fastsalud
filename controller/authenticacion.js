const connection = require('../model/conexionBd');
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const bcryptjs = require('bcryptjs');

// RERGISTAR
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const password = req.body.password;
    let passwordHaash = await bcryptjs.hash(password, 8)

    if (user && password) {
        connection.query('SELECT * FROM admin WHERE user = ?', [user], async (err, result) => {
            if (result.length == 0 || !(await bcryptjs.compare(password, result[0].password))) {
                res.render('../view/iniciarSesion', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña o usario incorrectos",
                    alertIcon: 'error',
                    showCancelButton: false,
                    time: false,
                    ruta: 'iniciarSesion'
                })
            } else {
                req.session.iniciado = true
                req.session.nombre = result[0].nombre
                res.render('../view/iniciarSesion', {
                    alert: true,
                    alertTitle: "Bien",
                    alertMessage: "Authenticacion correcta",
                    alertIcon: 'success',
                    showCancelButton: false,
                    time: 1500,
                    ruta: ''
                })
            }
        })
    } else {
        res.render('../view/iniciarSesion', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingresar usario y contraseña porfavor.",
            alertIcon: 'warning',
            showCancelButton: false,
            time: 1500,
            ruta: 'iniciarSesion'
        })
    }
})

module.exports = app