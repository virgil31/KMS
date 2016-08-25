<?php

header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$thread_id = $_GET["thread_id"];

$limit = $_GET['limit'];
$start = $_GET['start'];

$total = 0;

$statement = $pdo->prepare("
    SELECT A.id, A.thread_id, A.sent_by,CONCAT(B.first_name,' ',B.last_name) as sent_by_name,A.message,A.sent_at, C.event_id ,COUNT(*) OVER() as total
    FROM kms_event_thread_message A
        LEFT JOIN sf_guard_user B ON B.id = A.sent_by
        LEFT JOIN kms_event_thread C ON C.id = A.thread_id
    
    WHERE A.thread_id =  :thread_id
    ORDER BY sent_at ASC LIMIT :limit OFFSET :offset
");

$params = array(
    "thread_id" => $thread_id,
    "limit" => $limit,
    "offset" => $start
);
$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);

if(count($result) != 0)
    $total = $result[0]->total;


$arrayResult = array();

foreach ($result as $messaggio){
    $messaggio->is_coworker_or_admin = (isAdministrator($pdo,$messaggio->sent_by) || isEventCoworker($pdo,$messaggio->sent_by,$messaggio->event_id)) ? true : false;
    array_push($arrayResult,$messaggio);
}

sleep(1);
echo json_encode(array(
	"result" => $arrayResult,
    "total" => $total
));


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


function isAdministrator($pdo,$user_id){
    $statement = $pdo->prepare("
        SELECT *
        FROM sf_guard_user_group
        WHERE user_id = :user_id
          AND group_id = 1
    ");
    $params = array(
        "user_id" => $user_id
    );
    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    return (count($result)==0) ? false : true;
}



function isEventCoworker($pdo,$user_id,$event_id){

    //in primis controllo se è il creatore della event
    if(isEventCreator($pdo,$user_id,$event_id))
        return true;

    //else controllo se è nella lista dei collaboratori della event
    $statement = $pdo->prepare("
        SELECT *
        FROM kms_event_user
        WHERE user_id = :user_id
          AND event_id = :event_id
    ");
    $params = array(
        "event_id" => $event_id,
        "user_id" => $user_id
    );
    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    return (count($result)==0) ? false : true;
}


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

