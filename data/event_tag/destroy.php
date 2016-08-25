<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	DELETE FROM kms_event_tag
	WHERE event_id = :event_id
	  AND target_id = :target_id
	  AND type like :type
");

$params = array(
    'event_id' => $data['event_id'],
    'target_id' => $data['id'],
    'type' => $data['type'],
);

$success = $s->execute($params);


require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'rimosso un tag nell\'evento <b>'.getEventTitle($pdo,$data["event_id"]).'</b>','event/'.$data["event_id"].'/tags',"icon_tag.png",$data["event_id"],null);


echo json_encode(array(
    "success" => true
));










