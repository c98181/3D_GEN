<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once '../../config/database.php';
require_once '../../utils/response.php';
require_once '../../utils/auth_check.php';

header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

requireLogin();

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare('SELECT * FROM generations WHERE user_id = ? ORDER BY id DESC');
    $stmt->execute([$_SESSION['user_id']]);
    
    $generations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Response::json([
        'generations' => $generations
    ]);

} catch (PDOException $e) {
    Response::error('Failed to fetch generations: ' . $e->getMessage(), 500);
}
?>