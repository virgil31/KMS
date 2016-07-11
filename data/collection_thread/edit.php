<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);


$statement = $pdo->prepare("
    UPDATE kms_collection_thread A
    SET closed_at = NOW(),
      closed_by = :closed_by
    WHERE A.id = :thread_id
");

$params = array(
    "thread_id" => $data["id"],
    "closed_by" => $data["closed_by"]
);
$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);

echo json_encode(array(
    "success" => true
));