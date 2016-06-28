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

echo json_encode(array(
    "success" => true
));

