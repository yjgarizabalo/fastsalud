const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs')
const connection = require('./model/conexionBd');
const view_paciente = './view/pacientes'
const view_editarPaciente = './view/editarPaciente'


// INICIAR SESION
app.get('/iniciarSesion', function (req, res) {
    res.render(__dirname + "/view/iniciarSesion");
});

// REGISTRAR GESTORES
app.get('/registrarse', function (req, res) {
    res.render(__dirname + "/view/registrarse")
});

// // EDITAR PACIENTE
// app.get('/editarPaciente', function (req, res) {
//     res.render(__dirname + "/view/editarPaciente")
// });

// LOGIN
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// SESSION
const session = require('express-session')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// DOTENV
const dotenv = require('dotenv')
dotenv.config({ path: '/.env' })


// AUTHENTICACION EN PAGINAS
app.get('/', (req, res) => {
    if (req.session.iniciado) {
        res.render(__dirname + "/view/inicio", {
            login: true,
            nombre: req.session.nombre
        })
    } else {
        res.render(__dirname + "/view/inicio", {
            login: false,
            nombre: 'Debe iniciar sesion'
        })
    }
})

// CERRAR SESION
app.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})


// REGISTRAR PACIENTE
app.get('/registrarPaciente', (req, res) => {
    res.render(path.join(__dirname, "/view/registrarPaciente"), {
        paciente: [],
        login: true,
        nombre: req.session.nombre
    })
})

// BUSCAR PACIENTE
app.get('/buscarPaciente', (req, res) => {
    res.render(path.join(__dirname, "/view/buscarPaciente"), {
        paciente: [],
        login: true,
        nombre: req.session.nombre
    })
})
app.post('/registrarPaciente', (req, res) => {
    let { nombre, identificacion, eps, telefono } = req.body;
    let nombre_sesion = req.session.nombre;
    connection.connect(function (err) {
        if (err) console.log(err);

        var consulta = "INSERT INTO paciente(nombre, identificacion, eps, telefono) VALUES('" + nombre + "', '" + identificacion + "', '" + eps + "', '" + telefono + "')";

        connection.query(consulta, function (err, data) {
            let paciente = [{ nombre: nombre, identificacion: identificacion, eps: eps, telefono: telefono, id: data.insertId }];
            if (err) console.log(err);
            res.render(path.join(__dirname, view_paciente), { paciente, login: true, nombre_sesion });
        });


    });
})

//EDIGAR PACIENTE
app.get('/editarPaciente/:id', (req, res) => {
    const id = req.params.id;
    connection.query(' SELECT * FROM paciente user WHERE id=?', [id], (err, results) => {
        if (err) {
            throw err;
        } else {
            res.render(path.join(__dirname, view_editarPaciente), { paciente: results[0] });
        }
    })
})


// PACIENTE CREADO
app.post('/pacientes', (req, res) => {
    res.render(path.join(__dirname, "/view/pacientes"), {
        login: true,
        nombre: req.session.nombre
    });
})

// MIDALWARES
// app.use(require(__dirname + "/controller/registrarPaciente"))

// app.use(require(__dirname + "/controller/buscar"))

// app.use(require(__dirname + "/controller/listarPaciente"))

app.use(require(__dirname + "/controller/listarBusqueda"))

app.use(require(__dirname + "/controller/register"))

app.use(require(__dirname + "/controller/authenticacion"))

// ARCHIVOS ESTATICOS

app.use(express.static('public'));

app.use('/wiew', express.static('wiew'));


// PAGINA NO ENCONTRADA
app.use(function (req, res) {
    res.render(path.join(__dirname, "/view/paginaNoEncontrada"));
});


// SERVIDOR
app.listen(7000)
console.log(`[fastsalud] server en el puerto || ${7000}`);

