<?php
/*
 * L'EDIT di un collection_user (COLLABORATORE) viene effettuato solamente nel caso di
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
    UPDATE kms_collection_user
    SET is_coworker_manager = FALSE
    WHERE collection_id = :collection_id      
");
$params = array(
    "collection_id" => $data["collection_id"]
);
$statement->execute($params);



// dichiaro il nuovo gestore dei collaboratori
$statement = $pdo->prepare("
    UPDATE kms_collection_user
    SET is_coworker_manager = TRUE
    WHERE collection_id = :collection_id      
      AND user_id = :user_id
");
$params = array(
    "collection_id" => $data["collection_id"],
    "user_id" => $data["user_id"]
);
$statement->execute($params);

require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'promosso <b>'.getUserFullName($pdo,$data["user_id"]).'</b> a Gestore dei collaboratori della collezione <b>"'.getCollectionTitle($pdo,$data["collection_id"]).'"</b>',"collection/".$data["collection_id"]."/coworkers","icon_collaboratori.png");


echo json_encode(array(
    "success" => true
));

