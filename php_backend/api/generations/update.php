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

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

requireLogin();

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['generation_id']) || !isset($data['status'])) {
    Response::error('Missing required fields');
}

$valid_statuses = ['pending', 'image_generated', 'video_generated', 'model_generated', 'failed'];
if (!in_array($data['status'], $valid_statuses)) {
    Response::error('Invalid status value');
}

$database = new Database();
$db = $database->getConnection();

try {
    $check_stmt = $db->prepare('SELECT id FROM generations WHERE id = ? AND user_id = ?');
    $check_stmt->execute([$data['generation_id'], $_SESSION['user_id']]);
    if (!$check_stmt->fetch()) {
        Response::error('Generation not found or access denied', 404);
    }

    $update_stmt = $db->prepare('UPDATE generations SET status = ?, video_path = ?, model_path = ?, error_message = ? WHERE id = ?');
    
    $update_stmt->execute([
        $data['status'],
        $data['video_path'] ?? null,
        $data['model_path'] ?? null,
        $data['error_message'] ?? null,
        $data['generation_id']
    ]);

    Response::json([
        'message' => 'Generation updated successfully'
    ]);

} catch (PDOException $e) {
    Response::error('Failed to update generation: ' . $e->getMessage(), 500);
}
?>