const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs')

// HOME
app.get('/', function (req, res) {
    res.render(__dirname + "/view/inicio");
});

// RERGISTAR PACIENTE
app.get('/registrarPaciente', function (req, res) {
    res.render(__dirname + "/view/registrarPaciente");
});

app.get('/buscarPaciente', function (req, res) {
    res.render(path.join(__dirname, "/view/buscarPaciente"), { paciente: [] });
});

app.get('/iniciarSesion', function (req, res) {
    res.render(__dirname + "/view/iniciarSesion");
});


// MIDALWARES
app.use(require(__dirname + "/controller/registrarPaciente"))

app.use(require(__dirname + "/controller/buscar"));

app.use(require(__dirname + "/controller/listarBusqueda"))

app.use(require(__dirname + "/controller/listarPaciente"))

// ARCHIVOS ESTATICOS

app.use(express.static('public'));

app.use('/wiew', express.static('wiew'));


// PAGINA NO ENCONTRADA
app.use(function (req, res) {
    res.render(path.join(__dirname, "/view/paginaNoEncontrada"));
});


// SERVIDOR
app.listen(7000)
console.log(`[fastsalud] server en el puerto ${7000}`);

