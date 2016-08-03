<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	DELETE FROM kms_collection_user
	WHERE collection_id = :collection_id
	AND user_id = :user_id
");

$params = array(
    'collection_id' => $data['collection_id'],
    'user_id' => $data['user_id']
);

$success = $s->execute($params);


sleep(1.5);

if ($success) {

    require_once('../user_activity/create.php');
    createUserActivity($pdo,$_COOKIE["user_id"],'rimosso <b>'.getUserFullName($pdo,$data["user_id"]).'</b> dai collaboratori della collezione <b>"'.getCollectionTitle($pdo,$data["collection_id"]).'"</b>',"collection/".$data["collection_id"]."/coworkers","icon_collaboratori.png");


    echo json_encode(array(
        "success" => true
    ));
}
else{
    echo json_encode(array(
        "success" => false,
        "error_message" =>  $pdo->errorInfo()
    ));
}





