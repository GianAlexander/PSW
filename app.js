const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const validator = require('validator');

const app = express();
const puerto = 3000;

const uri = "mongodb://127.0.0.1:27017";
const cliente = new MongoClient(uri);

app.use(bodyParser.json());

async function iniciarServidor() {
  try {
    await cliente.connect();
    const bd = cliente.db("testVulnerabilidades");
    console.log('Conectado a MongoDB');

    // Ruta vulnerable a inyección de MongoDB
    app.get('/buscar', async (req, res) => {
      const nombreUsuario = req.query.nombre;
      console.log('Solicitud de búsqueda recibida con nombre:', nombreUsuario);

      try {
        const usuario = await bd.collection('usuarios').findOne({ nombre: nombreUsuario });
        if (!usuario) {
          return res.status(404).send('Usuario no encontrado');
        }
        res.json(usuario);
      } catch (err) {
        console.error('Error durante la búsqueda:', err);
        res.status(500).send('Error Interno del Servidor');
      }
    });

    // Ruta vulnerable para insertar datos maliciosos
    app.get('/insercion-maliciosa', async (req, res) => {
      const consulta = req.query.consulta;
      console.log('Solicitud de inserción recibida con consulta:', consulta);

      try {
        const resultado = await bd.collection('usuarios').insertOne(JSON.parse(consulta));
        res.json(resultado);
      } catch (err) {
        console.error('Error durante la inserción:', err);
        res.status(500).send('Error Interno del Servidor');
      }
    });

    // Ruta vulnerable para actualizar el rol de un usuario
    app.get('/actualizacion-maliciosa', async (req, res) => {
      const nombre = req.query.nombre;
      const nuevoRol = req.query.rol;
      console.log('Solicitud de actualización recibida con nombre:', nombre, 'y rol:', nuevoRol);

      try {
        const resultado = await bd.collection('usuarios').updateOne(
          { nombre },
          { $set: { rol: nuevoRol } }
        );
        res.json(resultado);
      } catch (err) {
        console.error('Error durante la actualización:', err);
        res.status(500).send('Error Interno del Servidor');
      }
    });

    // Ruta segura para insertar datos
    app.post('/insercion-segura', async (req, res) => {
      const { nombre, edad, correo, rol } = req.body;
      if (!nombre || !edad || !correo || !rol || !validator.isEmail(correo) || !validator.isInt(edad.toString(), { min: 0 })) {
        return res.status(400).send('Todos los campos son obligatorios y deben ser válidos');
      }

      try {
        const resultado = await bd.collection('usuarios').insertOne({ nombre, edad, correo, rol });
        res.json(resultado);
      } catch (err) {
        console.error('Error durante la inserción segura:', err);
        res.status(500).send('Error Interno del Servidor');
      }
    });

    // Ruta segura para actualizar el rol de un usuario
    app.post('/actualizacion-segura', async (req, res) => {
      const { nombre, rol } = req.body;

      // Validar datos
      if (!nombre || !rol || !['cliente', 'visitante', 'admin'].includes(rol)) {
        return res.status(400).send('Nombre o rol inválido');
      }

      try {
        const resultado = await bd.collection('usuarios').updateOne(
          { nombre },
          { $set: { rol } }
        );
        res.json(resultado);
      } catch (err) {
        console.error('Error durante la actualización segura:', err);
        res.status(500).send('Error Interno del Servidor');
      }
    });

    app.listen(puerto, () => {
      console.log(`App ejecutándose en http://localhost:${puerto}`);
    });
  } catch (err) {
    console.error('No se pudo conectar a MongoDB:', err);
  }
}

iniciarServidor();
//npm install express mongodb body-parser validator
