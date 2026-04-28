<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Bramus\Router\Router;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Inicializar Router
$router = new Router();

// Configurar encabezados CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Cargar rutas de la API
require __DIR__ . '/../src/Routes/api.php';

// Manejar ruta no encontrada (404)
$router->set404(function () {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => 'Route not found']);
});

// Ejecutar router
$router->run();
