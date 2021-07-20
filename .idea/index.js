const sha256 = require('js-sha256');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
const io = socketIO(server);
const mysql = require('mysql2');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "exfinal_g3",

});
//con db
conn.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("conexion exitosa a la base de datos ");
    }

})
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

server.listen(3000, function () {
    console.log("Servidor corriendo en el puerto 3000");

});
