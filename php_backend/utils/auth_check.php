<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn() {
    error_log("Session check - user_id: " . ($_SESSION['user_id'] ?? 'not set'));
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        Response::error('Unauthorized. Please login first.', 401);
    }
}
?>