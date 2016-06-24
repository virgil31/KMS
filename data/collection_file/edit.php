<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	UPDATE kms_collection_file
	SET title = :title
	WHERE collection_id = :collection_id
	AND file_id = :file_id
");

$params = array(
    'title' => $data['title'],
    'collection_id' => $data['collection_id'],
    'file_id' => $data['file_id']
);

$success = $s->execute($params);


$last_id = $pdo->lastInsertId("kms_collection_id_seq");

if ($success) {
    echo json_encode(array(
        "success" => true
    ));
}
else{
    echo json_encode(array(
        "success" => false,
        "error_message" =>  $pdo->errorInfo()
    ));
}
