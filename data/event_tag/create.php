<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);

foreach ($data["tags"] as $tag){
    $tag = explode(".",$tag);

    $s = $pdo->prepare("
        INSERT INTO kms_event_tag(event_id, type, target_id) 
        VALUES(:event_id, :type, :target_id)	
    ");

    $params = array(
        'event_id' => $data['event_id'],
        'type' => $tag[0],
        'target_id' => $tag[1]
    );

    $success = $s->execute($params);
}


require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'aggiunto dei TAG all\'evento <b>'.getEventTitle($pdo,$data["event_id"]).'</b>','event/'.$data["event_id"].'/tags',"icon_tag.png",$data["event_id"],null);

sleep(1.5);

echo json_encode(array(
    "success" => true,
    "tmp" => $pdo->errorInfo()
));
