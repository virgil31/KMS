<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$statement = $pdo->prepare("
	SELECT *
	FROM kms_external_resource_type 
	ORDER BY name
");

$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

//var_dump($result);

echo json_encode(array(
	"result" => $result
));
