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

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['input_text'])) {
    Response::error('Missing input text');
}

// 增加最大執行時間
ini_set('max_execution_time', 1200); // 20分鐘

try {
    // 1. 呼叫 prompt API
    $prompt_curl = curl_init('http://localhost:8000/ai/prompt');
    curl_setopt($prompt_curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($prompt_curl, CURLOPT_POST, true);
    curl_setopt($prompt_curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($prompt_curl, CURLOPT_POSTFIELDS, json_encode(['text' => $data['input_text']]));
    curl_setopt($prompt_curl, CURLOPT_TIMEOUT, 300); // 5 minutes timeout
    
    $prompt_response = curl_exec($prompt_curl);
    
    if (curl_errno($prompt_curl)) {
        throw new Exception('cURL error for prompt: ' . curl_error($prompt_curl));
    }
    
    $prompt_result = json_decode($prompt_response, true);
    $optimized_prompt = $prompt_result['optimized_prompt'];
    curl_close($prompt_curl);
    
    // 2. 呼叫 image API
    $image_curl = curl_init('http://localhost:8000/ai/image');
    curl_setopt($image_curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($image_curl, CURLOPT_POST, true);
    curl_setopt($image_curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($image_curl, CURLOPT_POSTFIELDS, json_encode(['prompt' => $optimized_prompt]));
    curl_setopt($image_curl, CURLOPT_TIMEOUT, 900); // 15 minutes timeout
    
    $image_response = curl_exec($image_curl);
    
    if (curl_errno($image_curl)) {
        throw new Exception('cURL error for image: ' . curl_error($image_curl));
    }
    
    $image_result = json_decode($image_response, true);
    $image_path = $image_result['image_path'];
    curl_close($image_curl);
    
    // 3. 創建資料庫記錄
    $database = new Database();
    $db = $database->getConnection();
    
    $stmt = $db->prepare('INSERT INTO generations (user_id, input_text, optimized_prompt, image_path, status) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $_SESSION['user_id'],
        $data['input_text'],
        $optimized_prompt,
        $image_path,
        'image_generated'
    ]);
    
    $generation_id = $db->lastInsertId();
    
    // 4. 呼叫 3D API
    $model_curl = curl_init('http://localhost:8000/ai/3d');
    curl_setopt($model_curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($model_curl, CURLOPT_POST, true);
    curl_setopt($model_curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($model_curl, CURLOPT_POSTFIELDS, json_encode(['image_filename' => basename($image_path)]));
    curl_setopt($model_curl, CURLOPT_TIMEOUT, 1200); // 20 minutes timeout
    
    $model_response = curl_exec($model_curl);
    
    if (curl_errno($model_curl)) {
        throw new Exception('cURL error for 3D model: ' . curl_error($model_curl));
    }
    
    $model_result = json_decode($model_response, true);
    curl_close($model_curl);
    
    // 5. 更新記錄
    $update_stmt = $db->prepare('UPDATE generations SET video_path = ?, model_path = ?, status = ? WHERE id = ?');
    $update_stmt->execute([
        $model_result['video_path'],
        $model_result['glb_path'],
        'model_generated',
        $generation_id
    ]);
    
    Response::json([
        'message' => 'Generation completed',
        'generation_id' => $generation_id,
        'video_path' => $model_result['video_path'],
        'glb_path' => $model_result['glb_path'],
        'image_path' => $image_path,
        // 'explain' => $optimized_prompt,
        // add original input text
        'explain' => $data['input_text']
    ], 201);
    
} catch (Exception $e) {
    // 記錄更多錯誤細節
    error_log('Generation error: ' . $e->getMessage());
    error_log('Error trace: ' . $e->getTraceAsString());
    
    Response::error('Generation failed: ' . $e->getMessage(), 500);
}
?>