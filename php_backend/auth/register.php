<?php
require_once '../config/database.php';
require_once '../utils/response.php';

header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

// 获取 POST 数据
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    Response::error('Username and password are required');
}

$username = $data['username'];
$password = $data['password'];

// 基本验证
if (strlen($username) < 3) {
    Response::error('Username must be at least 3 characters long');
}
if (strlen($password) < 6) {
    Response::error('Password must be at least 6 characters long');
}

// 连接数据库
$database = new Database();
$db = $database->getConnection();

try {
    // 检查用户名是否已存在
    $check_stmt = $db->prepare('SELECT id FROM users WHERE username = ?');
    $check_stmt->execute([$username]);
    if ($check_stmt->fetch()) {
        Response::error('Username already exists', 409);
    }

    // 创建新用户
    $stmt = $db->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt->execute([$username, $password_hash]);

    // 获取最后插入的用户ID
    $user_id = $db->lastInsertId();

    Response::json([
        'message' => 'User registered successfully',
        'user' => [
            'id' => $user_id,  // 使用 lastInsertId()
            'username' => $username
        ]
    ], 201);
} catch (PDOException $e) {
    Response::error('Registration failed: ' . $e->getMessage(), 500);
}
?>