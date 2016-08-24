<?php

header('Content-Type: application/json');

/*
 *
 * 1 - Se sono un administrator (sf_guard_group) potrò SEMPRE modificare
 * 2 - Se sono il creatore e non è ancora stata chiusa potrò modificare
 * 3 - il collaboratore designato come "gestore della lista collaboratori" e non è ancora stata chiusa potrò modificare
 * {4 - Se sono un funzionario di una delle entità taggate potrò SEMPRE modificare}
 *
 * */

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$can_write = false;
$caso = "";
$user_id = $_POST["user_id"];
$event_id = $_POST["event_id"];


///////////////////////////////////////////////////////////////////////////////////////////
//1 - Se sono un administrator (sf_guard_group) potrò SEMPRE modificare
///////////////////////////////////////////////////////////////////////////////////////////

$s = $pdo->prepare("
    SELECT *
    FROM sf_guard_user_group
    WHERE user_id = :user_id
");
$params = array(
    'user_id' => $user_id
);
$success = $s->execute($params);
$result = $s->fetchAll(PDO::FETCH_OBJ);
foreach($result as $row) {
    if ($row->group_id == 1){
        $can_write = true;
        $caso .= "administrator ";
    }

}



///////////////////////////////////////////////////////////////////////////////////////////
// 2 - Se sono il creatore e non è ancora stata chiusa potrò modificare
///////////////////////////////////////////////////////////////////////////////////////////

$s = $pdo->prepare("
    SELECT created_by
    FROM kms_event
    WHERE id = :event_id
      AND closed_at IS NULL
");
$params = array(
    'event_id' => $event_id
);
$success = $s->execute($params);
$result = $s->fetchAll(PDO::FETCH_OBJ);
foreach($result as $row){
    if($row->created_by == $user_id){
        $can_write = true;
        $caso .= "creatore ";
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
// 3 - il collaboratore designato come "gestore della lista collaboratori" e non è ancora stata chiusa potrò modificare
///////////////////////////////////////////////////////////////////////////////////////////

$s = $pdo->prepare("
    SELECT B.user_id
    FROM kms_event A
      LEFT JOIN kms_event_user B ON B.event_id = A.id

    WHERE id = :event_id
      AND B.is_coworker_manager = TRUE
      AND closed_at IS NULL
");
$params = array(
    'event_id' => $event_id
);
$success = $s->execute($params);
$result = $s->fetchAll(PDO::FETCH_OBJ);
foreach($result as $row){
    if($row->user_id == $user_id){
        $can_write = true;
        $caso .= "gestore collaboratori ";

    }
}



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

echo json_encode(array(
    "can_write" => $can_write,
    "caso" => $caso
));






