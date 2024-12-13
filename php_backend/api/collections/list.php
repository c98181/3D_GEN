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

error_log("Collections list request - User ID: " . ($_SESSION['user_id'] ?? 'NOT SET'));

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

requireLogin();

// 連接資料庫
$database = new Database();
$db = $database->getConnection();

try {
    // 查詢用戶的收藏，並包含生成的詳細資訊
    $stmt = $db->prepare('
        SELECT 
            c.id as id, 
            g.id as generation_id, 
            g.input_text, 
            g.image_path, 
            g.video_path, 
            g.model_path as glb_path,
            g.status
        FROM 
            collections c
        JOIN 
            generations g ON c.generation_id = g.id
        WHERE 
            c.user_id = ?
        ORDER BY 
            c.id DESC
    ');
    
    // 執行查詢
    $stmt->execute([$_SESSION['user_id']]);
    $collections = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 記錄查詢結果
    error_log("Collections found: " . count($collections));

    // 輸出結果
    Response::json([
        'success' => true,
        'data' => [
            'collections' => $collections,
            'total_count' => count($collections)
        ]
    ]);

} catch (PDOException $e) {
    // 詳細的錯誤日誌
    error_log('Collections list error: ' . $e->getMessage());
    error_log('SQL Error Code: ' . $e->getCode());
    error_log('SQL Error State: ' . $e->getSQLState());

    Response::error('Database error: ' . $e->getMessage(), 500);
}
?>