<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$event_id =  $_POST["event_id"];
$pool_id =  $_POST["pool_id"];

$user_ids = getUsersByPool($pdo, $pool_id);

foreach($user_ids as $user_id){
    if(!isEventCreator($pdo,$user_id,$event_id)){
        $statement = $pdo->prepare("
            INSERT INTO kms_event_user(event_id, user_id) 
            VALUES(:event_id, :user_id)
        ");
        $params = array(
            "event_id" => $event_id,
            "user_id" => $user_id
        );
        $statement->execute($params);
    }
}

require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'aggiunto il gruppo <b>'.getPoolName($pdo,$pool_id).'</b> ai collaboratori dell\'evento <b>"'.getEventTitle($pdo,$event_id).'"</b>',"event/".$event_id."/coworkers","icon_collaboratori.png",$event_id,null);



echo json_encode(array(
    "success" => true
));


////////////////////////////////////////////////////////////////////////

function getUsersByPool($pdo, $pool_id){
    $statement = $pdo->prepare("
        SELECT user_id
        FROM kms_user_pool
        WHERE pool_id = :pool_id
    ");
    $params = array(
        "pool_id" => $pool_id
    );

    $statement->execute($params);

    $result = array();
    foreach ($statement->fetchAll(PDO::FETCH_OBJ) as $row)
        array_push($result,$row->user_id);


    return $result;
}


////////////////////////////////////////////////////////////////////

function isEventCreator($pdo,$user_id,$event_id){
    $statement = $pdo->prepare("
        SELECT *
        FROM kms_event
        WHERE created_by = :user_id
          AND id = :event_id
    ");
    $params = array(
        "event_id" => $event_id,
        "user_id" => $user_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return (count($result)==0) ? false : true;
}

