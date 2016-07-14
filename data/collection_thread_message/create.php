<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    INSERT INTO kms_collection_thread_message(thread_id, sent_by, message, sent_at)
    VALUES(:thread_id,:sent_by,:message,now()) 
");
$params = array(
    "thread_id" => $data["thread_id"],
    "sent_by" => $data["sent_by"],
    "message" => $data["message"]
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);

sleep(1.5);

echo json_encode(array(
    "success" => true
));

