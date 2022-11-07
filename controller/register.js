const connection = require('../model/conexionBd');
const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
const bcryptjs = require('bcryptjs');

// RERGISTAR
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const nombre = req.body.nombre;
    const rol = req.body.rol;
    const password = req.body.password;
    let passwordHaash = await bcryptjs.hash(password, 8)

    connection.connect(function (err) {
        if (err) console.log(err);

        connection.query('INSERT INTO admin SET ?', { user: user, nombre: nombre, rol: rol, password: passwordHaash }, async (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.render('../view/registrarse', {
                    alert: true,
                    alertTitle: "Registro",
                    alertMessage: "Registro de usario creado exitosamente",
                    alertIcon: 'success',
                    showCancelButton: false,
                    time: 1500,
                    ruta: ''
                })
            }
        });
    });
});

module.exports = app