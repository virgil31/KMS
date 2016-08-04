<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$collection_id = $_GET["collection_id"];
$statement = $pdo->prepare("
        SELECT  A.id, A.title, A.url, A.collection_id, A.type_id, B.name as type_name
        FROM kms_collection_external_resource A
            LEFT JOIN kms_external_resource_type B ON B.id = A.type_id
        WHERE A.collection_id = :collection_id
        ORDER BY A.title
");


$params = array(
    "collection_id" => $collection_id
);

$statement->execute($params);


$result = $statement->fetchAll(PDO::FETCH_OBJ);

sleep(1);
echo json_encode(array(
    "success" => true,
	"result" => $result
));