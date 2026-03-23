<?php
header('Content-Type: application/json');
header('Cache-Control: public, max-age=3600');

$url = 'https://api-products-outlet.fensterpreiswert.de/drutex-outlet-product.json';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
$data = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($data === false || $httpCode !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'Failed to fetch products']);
    exit;
}

echo $data;
