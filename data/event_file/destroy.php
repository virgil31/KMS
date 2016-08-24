<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	DELETE FROM kms_event_file
	WHERE event_id = :event_id
	AND file_id = :file_id
");

$params = array(
    'event_id' => $data['event_id'],
    'file_id' => $data['file_id']
);

$success = $s->execute($params);


sleep(1.5);

if ($success) {

    require_once('../user_activity/create.php');
    createUserActivity($pdo,$_COOKIE["user_id"],'eliminato il documento <b>'.$data["title"].'</b> nell\'Evento <b>'.getEventTitle($pdo,$data['event_id']).'</b>','event/'.$data['event_id'],"icon_file.png",$data["event_id"],null);

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





