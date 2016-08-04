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

// Invio l'ultimo messaggio con la giustificazione della chiusura
inviaMessaggioChiusura($pdo,$data["id"],$data["closed_by"],$data["close_message"]);

require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'chiuso la discussione <b>'.$data["prefix"].' '.$data["title"].'</b> nella collezione <b>'.getCollectionTitle($pdo,$data["collection_id"]).'</b>','collection_thread/'.$data['id'],"icon_thread.png",$data["collection_id"],null);

echo json_encode(array(
    "success" => true
));


/////////////////////////////////////////////////////////////////////////////////////////

function inviaMessaggioChiusura($pdo,$thread_id,$closed_by,$close_message){

    $statement = $pdo->prepare("
        INSERT INTO kms_collection_thread_message (thread_id, sent_by, message, sent_at) 
        VALUES (:thread_id,:sent_by,:message, now())
    ");

    $params = array(
        "thread_id" => $thread_id,
        "sent_by" => $closed_by,
        "message" => '<div style="font-weight: bold !important; color: green !important;">[DISCUSSIONE CHIUSA] Motivo:</div><br>'.$close_message
    );
    $statement->execute($params);

}
