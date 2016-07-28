<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$statement = $pdo->prepare("
        SELECT  A.id, A.name, A.description
        FROM kms_license A
        ORDER BY A.name
");

$statement->execute();

$result = $statement->fetchAll(PDO::FETCH_OBJ);

echo json_encode(array(
    "success" => true,
	"result" => $result
));