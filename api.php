{"cdi":1.14,"usd":5.17,"selic":1.15}
<?php
die;
require(__DIR__ . '/vendor/autoload.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

if (empty($_ENV['HGBRASIL_KEY'])) {
    http_response_code(500);
    die;
}

$json = file_get_contents('https://api.hgbrasil.com/finance?key=' . $_ENV['HGBRASIL_KEY'] . '&fields=only_results');
$data = json_decode($json, true);

if (empty($data['taxes'][0]['selic']) || empty($data['currencies']['USD']['sell'])) {
    http_response_code(500);
    die;
}

$taxes = $data['taxes'][0];
$dollar = round($data['currencies']['USD']['sell'], 2);

// Percentual mensal aproximado
$selic = round($taxes['selic'] / 12, 2);
$cdi = round(($taxes['selic'] - 0.10) / 12, 2);

echo json_encode([
    'cdi' => $cdi,
    'usd' => $dollar,
    'selic' => $selic
]);