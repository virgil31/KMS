<?php
/*
 * L'EDIT di un event_user (COLLABORATORE) viene effettuato solamente nel caso di
 * promozione a utente GESTORE della lista dei collaboratori.
 * 
 * Per tanto devo prima assicurarmi di rimuovere il precedente gestore prima di selezionare quello nuovo.
 *  
 * */


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);


// rimuovo prima l'attuale gestore dei collaboratori
$statement = $pdo->prepare("
    UPDATE kms_event_user
    SET is_coworker_manager = FALSE
    WHERE event_id = :event_id      
");
$params = array(
    "event_id" => $data["event_id"]
);
$statement->execute($params);



// dichiaro il nuovo gestore dei collaboratori
$statement = $pdo->prepare("
    UPDATE kms_event_user
    SET is_coworker_manager = TRUE
    WHERE event_id = :event_id      
      AND user_id = :user_id
");
$params = array(
    "event_id" => $data["event_id"],
    "user_id" => $data["user_id"]
);
$statement->execute($params);

require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'promosso <b>'.getUserFullName($pdo,$data["user_id"]).'</b> a Gestore dei collaboratori dell\'evento <b>"'.getEventTitle($pdo,$data["event_id"]).'"</b>',"event/".$data["event_id"]."/coworkers","icon_collaboratori.png",$data["event_id"],null);


echo json_encode(array(
    "success" => true
));

