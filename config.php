
<?php

//Configuracion BD 
$host = 'localhost';
$port = '3306';
$dbname = 'sistemaproducto';  
$user = 'root';
$password = '';

$conn = mysqli_connect($host, $user, $password, $dbname, $port);

if (!$conn) {
    die("Error de conexión: " . mysqli_connect_error());
}

mysqli_set_charset($conn, 'utf8mb4');
?>