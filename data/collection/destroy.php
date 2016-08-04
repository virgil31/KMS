<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
    DELETE FROM kms_collection
    WHERE  id = :id
");

$params = array(
    'id' => $data['id']
);

$success = $s->execute($params);

sleep(1.5);

if ($success) {
    require_once('../user_activity/create.php');
    createUserActivity($pdo,$data["created_by"],'eliminato la collezione <b>"'.$data["title"].'"</b>','collection/'.$data["id"],"icon_collection.png", $data["id"],null);

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





