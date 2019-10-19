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
        //pool.end();
      } else {
        console.log(err);
      } 
    });
    });

            app.post('/registro', (req, res) => {
              const data = {
                nombre : req.body.nombre ,
                apellido : req.body.apellido,
                fnacimiento : req.body.fnacimiento,
                email : req.body.email,
                telefono : req.body.telefono,
                contrasenia : req.body.contrasenia,
              }
              
              pool.connect((err, client, done) => {
                const query = 'INSERT INTO usuarios (nombre, apellido, fnacimiento, email, telefono, contrasenia) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
                const values = [data.nombre, data.apellido, data.fnacimiento, data.email, data.telefono, data.contrasenia];
            
                client.query(query, values, (error, result) => {
                  done();
                  if (error) {
                    res.status(400).json({error});
                  }
                  res.status(202).send({
                    status: 'SUccessful',
                    result: result.rows[0],
                  });
                });
              });
            });
            
            app.get('/usuario/:id', (req,res) => {
              const id = req.params.id;
              pool.query('SELECT * FROM usuarios WHERE id=$1', [id], (err, rows) => {
                if(!err) {
                  res.json(rows.rows);
                  //pool.end();
                } else {
                  console.log(err);
                } 
              });
              //res.send(`Usuario ${id} perfil`);
            });



module.exports = router;