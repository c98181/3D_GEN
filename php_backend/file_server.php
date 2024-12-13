<?php
header('Access-Control-Allow-Origin: *');

$filePath = $_GET['path'];
$fullPath = "C:/Users/ASUS/Desktop/shared/" . $filePath;

if (file_exists($fullPath)) {
    $mimeType = mime_content_type($fullPath);
    header("Content-Type: $mimeType");
    readfile($fullPath);
} else {
    http_response_code(404);
    echo "File not found";
}
?>