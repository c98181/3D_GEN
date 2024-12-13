<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once '../config/database.php';
require_once '../utils/response.php';

error_log("Login attempt - Starting session with ID: " . session_id());
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    Response::error('Username and password are required');
}

$username = $data['username'];
$password = $data['password'];

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->prepare('SELECT id, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        Response::error('Invalid username or password', 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $username;
    
    error_log("Login - Session ID: " . session_id());
    error_log("Login - User ID set to: " . $user['id']);

    Response::json([
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'username' => $username
        ],
        'session_id' => session_id()
    ]);

} catch (PDOException $e) {
    Response::error('Login failed: ' . $e->getMessage(), 500);
}
?>