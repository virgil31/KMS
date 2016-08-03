<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	DELETE FROM kms_collection_thread
	WHERE id = :thread_id
");

$params = array(
    'thread_id' => $data['id']
);

$success = $s->execute($params);

require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'eliminato la discussione <b>"'.$data["prefix"].' '.$data["title"].'"</b>','collection_thread/'.$data['id'],"icon_thread.png");

echo json_encode(array(
    "success" => true
));





