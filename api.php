<?php
require(__DIR__ . '/vendor/autoload.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

if (empty($_ENV['HGBRASIL_KEY'])) {
    http_response_code(500);
    die;
}

$json = file_get_contents('https://api.hgbrasil.com/finance/taxes?key=' . $_ENV['HGBRASIL_KEY'] . '&fields=only_results');
$data = json_decode($json, true)[0];

if (empty($data['selic'])) {
    http_response_code(500);
    die;
}

// Percentual mensal aproximado
$selic = $data['selic'] / 12;
$cdi = ($data['selic'] - 0.10) / 12;

echo $cdi;