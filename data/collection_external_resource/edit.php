<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    UPDATE kms_collection_external_resource
    SET url = :url,
      title = :title,
      type_id = :type_id
    WHERE id = :id
      
");
$params = array(
    "id" => $data["id"],
    "url" => $data["url"],
    "title" => $data["title"],
    "type_id" => $data["type_id"]
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);

echo json_encode(array(
    "success" => true
));

