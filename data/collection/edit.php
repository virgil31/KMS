<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    UPDATE kms_collection
    SET title = :title,
      description = :description,
      license_id = :license_id
    WHERE id = :id
      
");
$params = array(
	"id" => $data["id"],
	"title" => $data["title"],
	"description" => $data["description"],
	"license_id" => $data["license_id"]
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);


require_once('../user_activity/create.php');
createUserActivity($pdo,$data["created_by"],'modificato le info di base della collezione <b>"'.$data["title"].'"</b>','collection/'.$data["id"],"icon_collection.png",$data["id"], null);

echo json_encode(array(
	"success" => true
));

