<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$to = 'anfragen@bauelemente-kavy.de';
$subject = 'Neue Produktanfrage: ' . ($input['product_name'] ?? 'Unbekanntes Produkt');

$message = "Neue Anfrage erhalten:\n\n";
$message .= "Produkt: " . ($input['product_name'] ?? '-') . " (ID: " . ($input['product_id'] ?? '-') . ")\n";
$message .= "Kunde: " . ($input['customer_name'] ?? '-') . "\n";
$message .= "Email: " . ($input['customer_email'] ?? '-') . "\n";
$message .= "Telefon: " . ($input['customer_phone'] ?? '-') . "\n";
$message .= "Lieferoption: " . ($input['delivery_option'] ?? '-') . "\n";

$headers = 'From: noreply@fensterpreiswert.de' . "\r\n" .
    'Reply-To: ' . ($input['customer_email'] ?? 'anfragen@bauelemente-kavy.de') . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
?>
