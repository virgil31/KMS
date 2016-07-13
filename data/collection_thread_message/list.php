<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$thread_id = $_GET["thread_id"];

$statement = $pdo->prepare("
    SELECT A.id, A.thread_id, A.sent_by,A.message,A.sent_at,
        CONCAT(B.first_name,' ',B.last_name) as sent_by_name,
        C.title as thread_title, C.prefix as thread_prefix,
        C.collection_id, D.title as collection_title
        
    FROM kms_collection_thread_message A
        LEFT JOIN sf_guard_user B ON B.id = A.sent_by
        LEFT JOIN kms_collection_thread C ON C.id = A.thread_id
        LEFT JOIN kms_collection D ON D.id = C.collection_id
        
    WHERE A.id =  :thread_id
    ORDER BY sent_at DESC
");

$params = array(
    "threa_id" => $thread_id
);
$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);

/*
$arrayResult = array();

foreach ($result as $discussione){
	$discussione->is_coworker_or_admin = (isAdministrator($pdo,$discussione->created_by) || isCollectionCoworker($pdo,$discussione->created_by,$discussione->collection_id)) ? true : false;
	array_push($arrayResult,$discussione);
}
*/

echo json_encode(array(
	"result" => $result
));