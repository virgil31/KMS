<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);


$statement = $pdo->prepare("
    INSERT INTO kms_event_thread (title, created_by, created_at, event_id, prefix) 
    VALUES (:title,:created_by,now(),:event_id, :prefix)
");

$params = array(
    "title" => $data["title"],
    "created_by" => $data["created_by"],
    "event_id" => $data["event_id"],
    "prefix" => $data["prefix"]
);

$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);


$thread_id = $pdo->lastInsertId("kms_event_thread_id_seq");

inviaMessaggioIniziale($pdo,$thread_id,$data["created_by"],$data["message"]);

sleep(1.5);


require_once('../user_activity/create.php');
createUserActivity($pdo,$data["created_by"],'avviato la discussione <b>'.$data["prefix"].' '.$data["title"].'</b> nell\'evento <b>'.getEventTitle($pdo,$data["event_id"]).'</b>','event_thread/'.$thread_id,"icon_thread.png",$data["event_id"],null);

echo json_encode(array(
    "success" => true
));



/////////////////////////////////////////////////////////////////////////////////////////

function inviaMessaggioIniziale($pdo,$thread_id,$closed_by,$start_message){

    $statement = $pdo->prepare("
        INSERT INTO kms_event_thread_message (thread_id, sent_by, message, sent_at) 
        VALUES (:thread_id,:sent_by,:message, now())
    ");

    $params = array(
        "thread_id" => $thread_id,
        "sent_by" => $closed_by,
        "message" => $start_message
    );

    $statement->execute($params);

}
