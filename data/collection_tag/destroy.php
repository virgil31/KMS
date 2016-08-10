<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	DELETE FROM kms_collection_tag
	WHERE collection_id = :collection_id
	  AND target_id = :target_id
	  AND type like :type
");

$params = array(
    'collection_id' => $data['collection_id'],
    'target_id' => $data['id'],
    'type' => $data['type'],
);

$success = $s->execute($params);


require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'rimosso un tag nella Collezione <b>'.getCollectionTitle($pdo,$data["collection_id"]).'</b>','collection/'.$data["collection_id"].'/tags',"icon_tag.png",$data["collection_id"],null);


echo json_encode(array(
    "success" => true
));










