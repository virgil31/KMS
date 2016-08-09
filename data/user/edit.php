<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);


$s = $pdo->prepare("
	UPDATE sf_guard_user
	SET first_name = :first_name,
	  last_name = :last_name,
	  affiliation_id = :affiliation_id
	WHERE id = :user_id	
");

$params = array(
    'first_name' => $data['first_name'],
    'last_name' => $data['last_name'],
    'affiliation_id' => $data['affiliation_id'],
    'user_id' => $data['id']
);

$success = $s->execute($params);


if ($success) {
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
