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

var crypto;
try {
    crypto = require('crypto');
} catch (err) {
    console.log('¡la criptografía no es compatible!');
}

//con db
conn.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("conexion exitosa a la base de datos ");
    }

})
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/form', function (request, response) {
    usuario = request.body.user;
    console.log(usuario);
    var contra = request.body.pass;

    console.log(contra);
    var hash_sha256 = crypto.createHash("sha256");
    hash_sha256.update(contra);
    var sha256c = hash_sha256.digest("hex"); // mostrado como hexadecimal
    console.log(sha256c);
    var params = [usuario, sha256c]
    if (usuario && contra) {
        var sql = "select * from usuario where user =? and pass =?";
        conn.query(sql, params, function (error, results) {
            if (error || results == "") {
                response.sendFile(__dirname + '/public/login.html');
            } else {
                booleano=true;
                response.sendFile(__dirname + '/public/');
            }
        });
    } else {
        response.sendFile(__dirname + '/public/login.html');
        response.end();
    }
});

server.listen(3000, function () {
    console.log("Servidor corriendo en el puerto 3000");
});
if (booleano){
    io.on('connection', function (socket) {
        console.log("usuario conectado");
        io.emit("usuarioIngresado", usuario);
        socket.on("mensaje de chat", function (mensaje) {
            console.log("mensaje del cliente " + usuario + ": " + mensaje);
            io.emit("mensaje broadcast", usuario + ": " + mensaje);
        });
    });
    booleano=false;
}
