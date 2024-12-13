<?php
require_once '../utils/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

// 清除 session
session_destroy();

Response::json([
    'success' => true,
    'data' => [
        'message' => 'Logout successful'
    ]
]);
?>