var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var usuarioRouter = require("./routes/usuario");
var animalesRouter = require("./routes/animales");

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
  const connectionString = 'postgres://nevamjaxyoehqj:35429072796790780dcb3b03a4076b9f9ffe565d15453ec8084bf32aa9e3df0c@ec2-184-73-216-48.compute-1.amazonaws.com:5432/dejijge07n9p6s';
  
  const pool = new Pool({
    connectionString: connectionString,
  });
  
  app.get('/usuario', (req, res) => {
    pool.query('SELECT * FROM usuarios', (err, rows) => {
      if(!err) {
        res.json(rows.rows);
        //pool.end();
      } else {
        console.log(err);
      } 
    });
    });

    app.post('/usuario', (req, res) => {
        pool.query('INSERT INTO usuarios (nombre, apellido, fnacimiento, email, telefono, contrasenia) VALUES ($1, $2, $3, $4, $5, $6)', (err, rows) => {
            console.log(err, rows);
            pool.end();
        });
        });

    