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

// 使用桌面共享目錄
$SHARED_DIR = 'C:\\Users\\ASUS\\Desktop\\shared';
$IMAGE_DIR = $SHARED_DIR . '\\images';

// 確保目錄存在
if (!file_exists($IMAGE_DIR)) {
    mkdir($IMAGE_DIR, 0777, true);
}

try {
    // 檢查是否有上傳檔案
    if (!isset($_FILES['image'])) {
        Response::error('No image uploaded', 400);
    }

    $image = $_FILES['image'];
    
    // 檢查上傳是否成功
    if ($image['error'] !== UPLOAD_ERR_OK) {
        Response::error('Upload failed', 500);
    }

    // 取得目前images目錄中的檔案數量
    $existing_files = scandir($IMAGE_DIR);
    $file_count = count(array_filter($existing_files, function($file) {
        return $file !== '.' && $file !== '..';
    }));
    $next_id = $file_count + 1;

    // 生成檔名
    $filename = $next_id . '_sd_output.png';
    $destination = $IMAGE_DIR . '\\' . $filename;

    // 使用 copy 方法並設定檔案權限
    if (!copy($image['tmp_name'], $destination)) {
        Response::error('Failed to copy image', 500);
    }

    // 明確設定檔案權限
    chmod($destination, 0644);

    // 確認檔案大小和完整性
    $original_size = filesize($image['tmp_name']);
    $copied_size = filesize($destination);

    if ($original_size !== $copied_size) {
        unlink($destination);
        Response::error('Image copy failed - size mismatch', 500);
    }

    // 記錄檔案複製日誌
    error_log("Image copied: {$filename}, Original size: {$original_size}, Copied size: {$copied_size}");

    // 呼叫 3D API
    $model_curl = curl_init('http://localhost:8000/ai/3d');
    curl_setopt($model_curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($model_curl, CURLOPT_POST, true);
    curl_setopt($model_curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($model_curl, CURLOPT_POSTFIELDS, json_encode(['image_filename' => $filename]));
    curl_setopt($model_curl, CURLOPT_TIMEOUT, 1200); // 20 minutes timeout
    
    $model_response = curl_exec($model_curl);
    
    if (curl_errno($model_curl)) {
        throw new Exception('cURL error for 3D model: ' . curl_error($model_curl));
    }
    
    $model_result = json_decode($model_response, true);
    curl_close($model_curl);

    // 創建資料庫記錄
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->prepare('INSERT INTO generations (user_id, input_text, image_path, video_path, model_path, status) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $_SESSION['user_id'],
        'Image Upload',
        'images/' . $filename,
        $model_result['video_path'],
        $model_result['glb_path'],
        'model_generated'
    ]);
    
    $generation_id = $db->lastInsertId();

    Response::json([
        'message' => 'Generation completed',
        'generation_id' => $generation_id,
        'image_path' => 'images/' . $filename,
        'video_path' => $model_result['video_path'],
        'glb_path' => $model_result['glb_path'],
        'explain' => 'Image Upload',
    ], 201);
    
} catch (Exception $e) {
    // 記錄更多錯誤細節
    error_log('Upload and 3D Generation error: ' . $e->getMessage());
    error_log('Error trace: ' . $e->getTraceAsString());
    
    Response::error('Generation failed: ' . $e->getMessage(), 500);
}
?>