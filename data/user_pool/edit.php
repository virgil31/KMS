<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    UPDATE kms_pool
    SET name = :name
    WHERE id = :id
");

$params = array(
    "name" => $data["pool_name"],
    "id" => $data["pool_id"]
);

$statement->execute($params);


// vv NaN per modificare gli utenti del pool
$statement = $pdo->prepare("
    DELETE FROM kms_user_pool  
    WHERE pool_id = :pool_id
");

$params = array(
    "pool_id" => $data["pool_id"]
);

$statement->execute($params);
foreach ($data["user_ids"] as $user_id){
    $statement = $pdo->prepare("
        INSERT INTO kms_user_pool(pool_id, user_id)
        VALUES(:pool_id, :user_id) 
    ");

    $params = array(
        "pool_id" => $data["pool_id"],
        "user_id" => $user_id
    );

    $statement->execute($params);
}
// ^^




sleep(1.5);

echo json_encode(array(
    "success" => true
));

