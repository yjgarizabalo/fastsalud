const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const connection = require('./model/conexionBd');

// Configuración de middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Configuración de la vista
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Configuración de sesiones
const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Rutas de vista
app.get('/iniciarSesion', (req, res) => {
  res.render("iniciarSesion");
});

app.get('/registrarse', (req, res) => {
  res.render("registrarse");
});

// Página de inicio con autenticación
app.get('/', (req, res) => {
  if (req.session.iniciado) {
    res.render("inicio", {
      login: true,
      nombre: req.session.nombre
    });
  } else {
    res.render("inicio", {
      login: false,
      nombre: 'Debe iniciar sesion'
    });
  }
});

// Cerrar sesión
app.get('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Registrar paciente
app.get('/registrarPaciente', (req, res) => {
  res.render("registrarPaciente", {
    paciente: [],
    login: true,
    nombre: req.session.nombre
  });
});

// Registrar paciente
app.post('/registrarPaciente', (req, res) => {
  const { nombre, identificacion, eps, telefono } = req.body;
  const nombre_sesion = req.session.nombre;

  connection.query("INSERT INTO paciente (nombre, identificacion, eps, telefono) VALUES (?, ?, ?, ?)", [nombre, identificacion, eps, telefono], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error al registrar paciente");
    }
    const paciente = [{ id: data.insertId, nombre, identificacion, eps, telefono }];
    res.render("pacientes", { paciente, login: true, nombre_sesion });
  });
});

// Buscar paciente
app.get('/buscarPaciente', (req, res) => {
  res.render("buscarPaciente", {
    paciente: [],
    login: true,
    nombre: req.session.nombre
  });
});

// Editar paciente
app.get('/editarPaciente/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM paciente WHERE id=?', [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener datos del paciente');
    } else {
      if (results.length > 0) {
        res.render(path.join(__dirname, 'view/editarPaciente'), { paciente: results[0] });
      } else {
        res.status(404).send('Paciente no encontrado');
      }
    }
  });
});

// Actualizar paciente
app.post('/actualizarPaciente', (req, res) => {
  const { id, nombre, identificacion, eps, telefono } = req.body;
  connection.query(
      'UPDATE paciente SET nombre = ?, identificacion = ?, eps = ?, telefono = ? WHERE id = ?',
      [nombre, identificacion, eps, telefono, id],
      (err, results) => {
          if (err) {
              console.error(err);
              res.status(500).send('Error al actualizar el paciente');
          } else {
              res.render('../view/buscarPaciente', {
                alert: true,
                alertTitle: "Aactualizdo",
                alertMessage: "Usario actualizado con exitosamente",
                alertIcon: 'success',
                showCancelButton: false,
                time: 1500,
                ruta: ''
              })
              res.redirect('/buscarPaciente');
          }
      }
  );
});

// Eliminar paciente
app.get('/eliminarPaciente/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM paciente WHERE id = ?', [id], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error al eliminar el paciente');
      } else {
          res.redirect('/buscarPaciente');
      }
  });
});


// Paciente creado
app.post('/pacientes', (req, res) => {
  res.render("pacientes", {
    login: true,
    nombre: req.session.nombre
  });
});

// Controladores
app.use(require('./controller/listarBusqueda'));
app.use(require('./controller/register'));
app.use(require('./controller/authenticacion'));

// Página no encontrada
app.use((req, res) => {
  res.render("paginaNoEncontrada");
});

// Servidor
app.listen(7000, () => {
  console.log(`[fastsalud] server en el puerto || ${7000}`);
});
