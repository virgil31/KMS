<?php

header('Content-Type: application/json');

/*
 *
 * 1 - Se sono un administrator (sf_guard_group) potrò SEMPRE modificare
 * 2 - Se sono il creatore  potrò modificare
 * 3 - Se sono un collaboratore potrò modificare
 * {4 - Se sono un funzionario di una delle entità taggate potrà SEMPRE modificare}
 *
 * */

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$can_write = false;
$caso = "";
$user_id = $_POST["user_id"];
$collection_id = $_POST["collection_id"];


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
        $caso = "administrator";
    }

}



///////////////////////////////////////////////////////////////////////////////////////////
// 2 - Se sono il creatore e non è ancora stata chiusa potrò modificare
///////////////////////////////////////////////////////////////////////////////////////////

$s = $pdo->prepare("
    SELECT created_by,created_at
    FROM kms_collection
    WHERE id = :collection_id
");
$params = array(
    'collection_id' => $collection_id
);
$success = $s->execute($params);
$result = $s->fetchAll(PDO::FETCH_OBJ);
foreach($result as $row){
    if($row->created_by == $user_id){
        $can_write = true;
        $caso = "creatore";
    }
}




///////////////////////////////////////////////////////////////////////////////////////////
// 3 - Se sono un collaboratore e non è ancora stata chiusa potrò modificare
///////////////////////////////////////////////////////////////////////////////////////////

$s = $pdo->prepare("
    SELECT B.user_id,created_at
    FROM kms_collection A
      LEFT JOIN kms_collection_user B ON B.collection_id = A.id

    WHERE id = :collection_id
");
$params = array(
    'collection_id' => $collection_id
);
$success = $s->execute($params);
$result = $s->fetchAll(PDO::FETCH_OBJ);
foreach($result as $row){
    if($row->user_id == $user_id){
        $can_write = true;
        $caso = "collaboratore";
    }
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

echo json_encode(array(
    "can_write" => $can_write,
    "caso" => $caso
));







