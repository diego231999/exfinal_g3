//const sha256 = require('js-sha256');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
const io = socketIO(server);

const mysql = require('mysql2');

/* USUARIOS - PASSWORDS
Joham - joham123
Diego - diego123
User1 - user1123
User2 - user2123
User3 - user3123
*/

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
// var booleano = new Boolean(false);
var usuario="";
var sockets = [];
var usuarios_conectados = [];
var usuarios = [];

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

let sql = "select * from users ";
conn.query(sql, function (err, res){
    if (err) throw  err;
    for (var j = 0; j < res.length; j++) {
        u = [
            res[j]["names"]
        ];
        usuarios.push(u);
    }
});

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
        var sql = "select * from users where names =? and password =?";
        conn.query(sql, params, function (error, results) {
            if (error || results == "") {
                response.sendFile(__dirname + '/login.html');
            } else {
                usuarios_conectados.push(params[0]);
                response.sendFile(__dirname + '/main.html');
            }
        });
    } else {
        response.sendFile(__dirname + '/login.html');
        response.end();
    }
});

server.listen(3000, function () {
    console.log("Servidor corriendo en el puerto 3000");
});

io.on('connection', function (socket) {

    socket.on("usuario conectado", function (bool){
        console.log(bool)
        console.log("usuario conectado");
        console.log("Se conectó: " + usuarios_conectados[usuarios_conectados.length - 1]);

        console.log(usuarios);
        console.log(usuarios_conectados);
    });

    // enviando la lista de usuarios conectados
    socket.emit("usuarioIngresado", usuarios_conectados);
    socket.emit("usuarios", usuarios);

    socket.on("mensaje de chat", function (mensaje) {
        console.log("mensaje del cliente " + usuario + ": " + mensaje);
        io.emit("mensaje broadcast", usuario + ": " + mensaje);
    });
    //socket.close();
});
