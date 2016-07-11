<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$collection_id = $_GET["collection_id"];

$statement = $pdo->prepare("
    SELECT A.id,A.prefix, A.title,A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name,A.created_at,A.closed_at,A.collection_id,D.title as collection_name,A.closed_by, CONCAT(C.first_name,' ',C.last_name) as closed_by_name
    FROM kms_collection_thread A
        LEFT JOIN sf_guard_user B ON B.id = A.created_by
        LEFT JOIN sf_guard_user C ON C.id = A.closed_by
        LEFT JOIN kms_collection D ON D.id = A.collection_id
    WHERE A.collection_id = :collection_id
    ORDER BY A.created_at
");

$params = array(
    "collection_id" => $collection_id
);
$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);



echo json_encode(array(
	"result" => $result
));