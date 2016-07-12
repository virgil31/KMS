<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);


$statement = $pdo->prepare("
    INSERT INTO kms_collection_thread (title, created_by, created_at, collection_id, prefix) 
    VALUES (:title,:created_by,now(),:collection_id, :prefix)
");

$params = array(
    "title" => $data["title"],
    "created_by" => $data["created_by"],
    "collection_id" => $data["collection_id"],
    "prefix" => $data["prefix"]
);

$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);


sleep(1.5);

echo json_encode(array(
    "success" => true
));