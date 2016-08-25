<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$event_id = $_GET["event_id"];

//GET BY ID (info che servono quando ENTRO dentro un discussione)
if(isset($_GET["thread_id"])){
    $thread_id = $_GET["thread_id"];
    $statement = $pdo->prepare("
        SELECT A.id,A.prefix, A.title,A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name,A.created_at,
                A.closed_at,A.event_id,D.title as event_name,A.closed_by, CONCAT(C.first_name,' ',C.last_name) as closed_by_name,
                floor(random() * 10) as count_responses
        FROM kms_event_thread A
            LEFT JOIN sf_guard_user B ON B.id = A.created_by
            LEFT JOIN sf_guard_user C ON C.id  = A.closed_by
            LEFT JOIN kms_event D ON D.id = A.event_id
        WHERE A.id = :thread_id
        ORDER BY A.created_at DESC
    ");
    $params = array(
        "thread_id" => $thread_id
    );
    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    echo json_encode(array(
        "result" => $result
    ));
    exit(0);
}

// ALTRIMENTI LIST NORMALE DELLE DISCUSSIONI PRESENTI IN UNA EVENT
else{
    $statement = $pdo->prepare("
        SELECT A.id,A.prefix, A.title,A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name,A.created_at,
			A.closed_at,A.event_id,D.title as event_name,A.closed_by, CONCAT(C.first_name,' ',C.last_name) as closed_by_name,
			COUNT(E.id)-1 as count_responses, MAX(E.sent_at) as last_message_at
			
		FROM kms_event_thread A
			LEFT JOIN sf_guard_user B ON B.id = A.created_by
			LEFT JOIN sf_guard_user C ON C.id = A.closed_by
			LEFT JOIN kms_event D ON D.id = A.event_id
			LEFT JOIN kms_event_thread_message E ON E.thread_id = A.id
			
		WHERE A.event_id = :event_id
		
		GROUP BY A.id,B.first_name,B.last_name,D.title,C.first_name, C.last_name
		
		ORDER BY A.created_at DESC
    ");

    $params = array(
        "event_id" => $event_id
    );
}

$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();

foreach ($result as $discussione){
	$discussione->is_coworker_or_admin = (isAdministrator($pdo,$discussione->created_by) || isEventCoworker($pdo,$discussione->created_by,$discussione->event_id)) ? true : false;
	array_push($arrayResult,$discussione);
}

sleep(1);

echo json_encode(array(
	"result" => $arrayResult
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