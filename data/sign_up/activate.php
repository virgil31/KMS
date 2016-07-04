<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$user_id = $_POST["user_id"];
$user_salt = $_POST["user_salt"];

$statement = $pdo->prepare("
    UPDATE sf_guard_user
    SET is_active = TRUE
    WHERE id = :user_id
      AND salt = :user_salt
");

$params = array(
    "user_id" => $user_id,
    "user_salt" => $user_salt
);

$statement->execute($params);


echo json_encode(array(
    "success" => true
));