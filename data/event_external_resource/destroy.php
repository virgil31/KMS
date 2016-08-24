<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	DELETE FROM kms_event_external_resource
	WHERE id = :external_resource_id
");

$params = array(
    'external_resource_id' => $data['id'],
);

$success = $s->execute($params);


require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'rimosso la risorsa esterna <b>'.$data["title"].'</b> nell\'evento <b>'.getEventTitle($pdo,$data["event_id"]).'</b>','event/'.$data["event_id"].'/external_resources',"icon_other_external_resource.png",$data["event_id"],null);


echo json_encode(array(
    "success" => true
));





