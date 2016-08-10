<?php

header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    INSERT INTO kms_collection_tag (collection_id, type, target_id)
    VALUES(:collection_id, :type, :target_id) 
");

$params = array(
    "collection_id" => $data["collection_id"],
    "type" => $data["tag_type"],
    "target_id" => $data["tag_target_id"]
);

$success = $statement->execute($params);


$result = $statement->fetchAll(PDO::FETCH_OBJ);

require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'aggiunto un tag nella Collezione <b>'.getCollectionTitle($pdo,$data["collection_id"]).'</b>','collection/'.$data["collection_id"].'/tags',"icon_tag.png",$data["collection_id"],null);

sleep(1.5);

if($success){
    echo json_encode(array(
        "success" => true
    ));
}
else{
    echo json_encode(array(
        "success" => false,
        "error?" => $pdo->errorInfo(),
    ));
}