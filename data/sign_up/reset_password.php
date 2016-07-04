<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$user_id = $_POST["user_id"];
$user_salt = $_POST["user_salt"];
$password = base64_decode(base64_decode(base64_decode($_POST["password"])));
$password = sha1($user_salt.$password);


$statement = $pdo->prepare("
    UPDATE sf_guard_user
    SET password = :password
    WHERE id = :id
        AND salt = :salt
");

$params = array(
    "password" => $password,
    "id" => $user_id,
    "salt" => $user_salt
);

$statement->execute($params);

sleep(1.5);

if($user_id != null){
    echo json_encode(array(
        "success" => true
    ));
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
