<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$statement = $pdo->prepare("
	SELECT A.id as pool_id, A.name as pool_name,CONCAT(A.name,' ',A.id) as pool_full_name, A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name
	FROM kms_pool A
		LEFT JOIN sf_guard_user B ON B.id = A.created_by
");

$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

//var_dump($result);

echo json_encode(array(
	"result" => $result
));
