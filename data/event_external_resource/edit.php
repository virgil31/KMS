<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    UPDATE kms_event_external_resource
    SET url = :url,
      title = :title,
      type_id = :type_id
    WHERE id = :id
      
");
$params = array(
    "id" => $data["id"],
    "url" => $data["url"],
    "title" => $data["title"],
    "type_id" => $data["type_id"]
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);



require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'modificato la risorsa esterna <b>'.$data["title"].'</b> nell\'evento <b>'.getEventTitle($pdo,$data["event_id"]).'</b>','event/'.$data["event_id"].'/external_resources',"icon_other_external_resource.png",$data["event_id"],null);


echo json_encode(array(
    "success" => true
));

