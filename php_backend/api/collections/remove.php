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
if (!isset($data['collection_id'])) {
    Response::error('Missing collection_id', 400);
}

// 連接資料庫
$database = new Database();
$db = $database->getConnection();

try {
    // 確認收藏是否屬於當前用戶
    $check_stmt = $db->prepare('SELECT * FROM collections WHERE id = ? AND user_id = ?');
    $check_stmt->execute([$data['collection_id'], $_SESSION['user_id']]);
    $collection = $check_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$collection) {
        Response::error('Collection not found or not owned by user', 404);
    }

    // 刪除收藏
    $stmt = $db->prepare('DELETE FROM collections WHERE id = ?');
    $stmt->execute([$data['collection_id']]);

    Response::json([
        'message' => 'Removed from collection successfully',
        'collection_id' => $data['collection_id']
    ]);

} catch (PDOException $e) {
    Response::error('Database error: ' . $e->getMessage(), 500);
}
?>