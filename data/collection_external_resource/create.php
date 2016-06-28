<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    INSERT INTO kms_collection_external_resource(collection_id, url, title, type_id)
	VALUES(:collection_id, :url, :title, :type_id)
");
$params = array(
    "collection_id" => $data["collection_id"],
    "url" => $data["url"],
    "title" => $data["title"],
    "type_id" => $data["type_id"]
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);

echo json_encode(array(
    "success" => true
));

