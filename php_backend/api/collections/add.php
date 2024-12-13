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
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

requireLogin();

// 解析輸入
$data = json_decode(file_get_contents('php://input'), true);

// 驗證必要參數
if (!isset($data['generation_id'])) {
    Response::error('Missing generation_id', 400);
}

// 連接資料庫
$database = new Database();
$db = $database->getConnection();

try {
    // 確認 generation_id 是否存在且屬於當前用戶
    $check_stmt = $db->prepare('SELECT * FROM generations WHERE id = ? AND user_id = ?');
    $check_stmt->execute([$data['generation_id'], $_SESSION['user_id']]);
    $generation = $check_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$generation) {
        Response::error('Generation not found or not owned by user', 404);
    }

    // 新增到收藏
    $stmt = $db->prepare('INSERT INTO collections (user_id, generation_id) VALUES (?, ?)');
    $stmt->execute([$_SESSION['user_id'], $data['generation_id']]);

    $collection_id = $db->lastInsertId();

    Response::json([
        'success' => true,
        'data' => [
            'message' => 'Added to collection successfully',
            'collection_id' => $collection_id,
            'generation_id' => $data['generation_id']
        ]
    ], 201);

} catch (PDOException $e) {
    // 處理可能的重複收藏
    if ($e->getCode() == '23000') {
        Response::error('This generation is already in your collection', 409);
    }
    
    Response::error('Database error: ' . $e->getMessage(), 500);
}
?>