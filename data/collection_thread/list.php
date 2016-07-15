<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$collection_id = $_GET["collection_id"];

//GET BY ID (info che servono quando ENTRO dentro un discussione)
if(isset($_GET["thread_id"])){
    $thread_id = $_GET["thread_id"];
    $statement = $pdo->prepare("
        SELECT A.id,A.prefix, A.title,A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name,A.created_at,
                A.closed_at,A.collection_id,D.title as collection_name,A.closed_by, CONCAT(C.first_name,' ',C.last_name) as closed_by_name,
                floor(random() * 10) as count_responses
        FROM kms_collection_thread A
            LEFT JOIN sf_guard_user B ON B.id = A.created_by
            LEFT JOIN sf_guard_user C ON C.id  = A.closed_by
            LEFT JOIN kms_collection D ON D.id = A.collection_id
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

// ALTRIMENTI LIST NORMALE DELLE DISCUSSIONI PRESENTI IN UNA COLLECTION
else{
    $statement = $pdo->prepare("
        SELECT A.id,A.prefix, A.title,A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name,A.created_at,
			A.closed_at,A.collection_id,D.title as collection_name,A.closed_by, CONCAT(C.first_name,' ',C.last_name) as closed_by_name,
			COUNT(E.id)-1 as count_responses, MAX(E.sent_at) as last_message_at
			
		FROM kms_collection_thread A
			LEFT JOIN sf_guard_user B ON B.id = A.created_by
			LEFT JOIN sf_guard_user C ON C.id = A.closed_by
			LEFT JOIN kms_collection D ON D.id = A.collection_id
			LEFT JOIN kms_collection_thread_message E ON E.thread_id = A.id
			
		WHERE A.collection_id = :collection_id
		
		GROUP BY A.id,B.first_name,B.last_name,D.title,C.first_name, C.last_name
		
		ORDER BY A.created_at DESC
    ");

    $params = array(
        "collection_id" => $collection_id
    );
}

$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();

foreach ($result as $discussione){
	$discussione->is_coworker_or_admin = (isAdministrator($pdo,$discussione->created_by) || isCollectionCoworker($pdo,$discussione->created_by,$discussione->collection_id)) ? true : false;
	array_push($arrayResult,$discussione);
}

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



function isCollectionCoworker($pdo,$user_id,$collection_id){

	//in primis controllo se è il creatore della collection
	if(isCollectionCreator($pdo,$user_id,$collection_id))
		return true;

	//else controllo se è nella lista dei collaboratori della collection
	$statement = $pdo->prepare("
        SELECT *
        FROM kms_collection_user
        WHERE user_id = :user_id
          AND collection_id = :collection_id
    ");
	$params = array(
		"collection_id" => $collection_id,
		"user_id" => $user_id
	);
	$statement->execute($params);
	$result = $statement->fetchAll(PDO::FETCH_OBJ);

	return (count($result)==0) ? false : true;
}


function isCollectionCreator($pdo,$user_id,$collection_id){
	$statement = $pdo->prepare("
        SELECT *
        FROM kms_collection
        WHERE created_by = :user_id
          AND id = :collection_id
    ");
	$params = array(
		"collection_id" => $collection_id,
		"user_id" => $user_id
	);

	$statement->execute($params);
	$result = $statement->fetchAll(PDO::FETCH_OBJ);
	return (count($result)==0) ? false : true;
}