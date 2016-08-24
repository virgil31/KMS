<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    UPDATE kms_event
    SET title = :title,
      description = :description,
      license_id = :license_id,
      closed_at = :closed_at
    WHERE id = :id
      
");
$params = array(
	"id" => $data["id"],
	"title" => $data["title"],
	"description" => $data["description"],
	"license_id" => $data["license_id"],
	"closed_at" => ($data["closed_at"] != "") ? "now()" : ""
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);


require_once('../user_activity/create.php');
if($data["closed_at"] != "")
	createUserActivity($pdo,$data["created_by"],'chiuso l\'evento <b>"'.$data["title"].'"</b>','event/'.$data["id"],"icon_calendar.png",$data["id"], null);
else
	createUserActivity($pdo,$data["created_by"],'modificato le info di base dell\'evento <b>"'.$data["title"].'"</b>','event/'.$data["id"],"icon_calendar.png",$data["id"], null);

echo json_encode(array(
	"success" => true
));

