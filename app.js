var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
//var usuarioRouter = require("./routes/usuario");
//var animalesRouter = require("./routes/animales");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, OPTIONS");
    next();
});

//app.use('/api/usuario', usuarioRouter);
//app.use('/api/animales', animalesRouter);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
  });
  
  const { Pool, Client } = require('pg');
  const connectionString = 'postgres://rxtonxhonkuoch:0dcb72e4bbd6ca6319a95c26361bc84ef2f1b41e0b1ba57df7d1097c8f723b62@ec2-23-23-182-18.compute-1.amazonaws.com:5432/dau2foplodoso5';
  
  const pool = new Pool({
    connectionString: connectionString,
  });
  
  app.get('/usuario',(req, res) => {
    pool.query('SELECT * FROM usuarios', (err, rows) => {
      if(!err) {
        res.json(rows.rows);
      } else {
        console.log(err);
      } 
    });
    });

    app.get('/animales',(req, res) => {
      pool.query('SELECT * FROM animales', (err, rows) => {
        if(!err) {
          res.json(rows.rows);
        } else {
          console.log(err);
        } 
      });
      });

      app.get('/encontrado',(req, res) => {
        pool.query('SELECT * FROM animales where estado = $1',["Encontrado"], (err, rows) => {
          if(!err) {
            res.json(rows.rows);
          } else {
            console.log(err);
          } 
        });
        });

        app.get('/perdido',(req, res) => {
          pool.query('SELECT * FROM animales where estado = $1',["Perdido"], (err, rows) => {
            if(!err) {
              res.json(rows.rows);
            } else {
              console.log(err);
            } 
          });
          });

    app.get('/usuario/:id', (req,res) => {
      const id = req.params.id;
      pool.query('SELECT nombre, apellido, fnacimiento, email, telefono, PGP_SYM_DECRYPT(CAST(contrasenia AS BYTEA), ["AES_KEY"]) as contrasenia, imagen FROM usuarios WHERE idusuario=$1',[id], (err, rows) => {
        if(!err) {
          res.json(rows.rows);
        } else {
          console.log(err);
        } 
      });
    });

    app.get('/animales/:id', (req,res) => {
      const id = req.params.id;
      pool.query('SELECT * FROM animales WHERE idanimal=$1',[id], (err, rows) => {
        if(!err) {
          res.json(rows.rows);
        } else {
          console.log(err);
        } 
      });
    });

    app.get('/anuncio/:id', (req,res) => {
      const id = req.params.id;
      pool.query('SELECT * FROM animales WHERE idusuario=$1',[id], (err, rows) => {
        if(!err) {
          res.json(rows.rows);
        } else {
          console.log(err);
        } 
      });
    });

    app.post('/animales', (req, res) => {
      const data = {
        tipo : req.body.tipo ,
        raza : req.body.raza,
        genero : req.body.genero,
        descripcion : req.body.descripcion,
        latitud : req.body.latitud,
        longitud : req.body.longitud,
        estado : req.body.estado,
        imagen : req.body.imagen,
        idusuario : req.body.idusuario,
        fchalta : req.body.fchalta,
        fchmodif : req.body.fchmodif,
      }
      
      pool.connect((err, client, done) => {
        const query = 'INSERT INTO animales (tipo, raza, genero, descripcion, latitud, longitud, estado, imagen, idusuario, fchalta, fchmodif) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';
        const values = [data.tipo, data.raza, data.genero, data.descripcion, data.latitud, data.longitud, data.estado, data.imagen, data.idusuario, data.fchalta, data.fchmodif];
    
        client.query(query, values, (error, result) => {
          done();
          if (error) {
            res.status(400).json({error});
          }
          res.status(200).send({
            status: 'Successful',
            result: result.rows[0],
          });
        });
      });
    });

            app.post('/usuario', (req, res) => {
              const data = {
                nombre : req.body.nombre ,
                apellido : req.body.apellido,
                fnacimiento : req.body.fnacimiento,
                email : req.body.email,
                telefono : req.body.telefono,
                contrasenia : req.body.contrasenia,
                imagen : req.body.imagen,
              }
              
              pool.connect((err, client, done) => {
                const query = 'INSERT INTO usuarios (nombre, apellido, fnacimiento, email, telefono, contrasenia, imagen) VALUES ($1, $2, $3, $4, $5, MD5($6), $7) RETURNING *';
                const values = [data.nombre, data.apellido, data.fnacimiento, data.email, data.telefono, data.contrasenia, data.imagen];
            
                client.query(query, values, (error, result) => {
                  done();
                  if (error) {
                    res.status(400).send({
                      status: 'Failed',
                      message: 'Email already exists',
                      });
                  }
                  res.status(200).send({
                    status: 'Successful',
                    result: result.rows[0],
                  });
                });
              });
            });

    app.post('/login',(req,res)=>{
      const response = {email, contrasenia} = req.body;
      pool.query('SELECT * FROM usuarios WHERE email=$1 AND contrasenia=MD5($2)',[email, contrasenia], (err, rows) => {
        if(rows.rows < '1') {
          res.status(400).send({
          status: 'Failed',
          message: 'Usuario y/o Contraseña incorrecto',
          });
        } else {
          res.status(200).send({
          status: 'Successful',
          //message: 'Login Information retrieved',
          //usuarios: rows.rows,
          result: rows.rows[0],
          });
        } 
      });
    });

    app.put('/usuario/:id',(req,res)=>{
      const id = req.params.id;
      const response = {nombre,apellido,fnacimiento,email,telefono,contrasenia,imagen} = req.body;
      pool.query('UPDATE usuarios SET nombre=$1, apellido=$2, fnacimiento=$3, email=$4, telefono=$5, contrasenia=MD5($6), imagen=$7 WHERE idusuario=$8',
      [nombre,apellido,fnacimiento,email,telefono,contrasenia,imagen, id]);
      console.log(response);
      res.json('User Updated successfully');
    });

    app.put('/animales/:id',(req,res)=>{
      const id = req.params.id;
      const response = {tipo, raza, genero, descripcion, latitud, longitud, estado, imagen, idusuario, fchalta, fchmodif} = req.body;
      pool.query('UPDATE animales SET tipo=$1, raza=$2, genero=$3, descripcion=$4, latitud=$5, longitud=$6, estado=$7, imagen=$8, idusuario=$9, fchalta=$10, fchmodif=$11 WHERE idanimal=$12',
      [tipo, raza, genero, descripcion, latitud, longitud, estado, imagen, idusuario, fchalta, fchmodif, id]);
      console.log(response);
      res.json('Animal Updated successfully');
    });

module.exports = router;