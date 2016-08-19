<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$statement = $pdo->prepare("
    INSERT INTO kms_pool(name, created_by)
    VALUES(:name, :created_by) 
");

$params = array(
    "name" => $data["name"],
    "created_by" => $_COOKIE["user_id"]
);

$statement->execute($params);

$last_id = $pdo->lastInsertId("kms_pool_id_seq");

$result = $statement->fetchAll(PDO::FETCH_OBJ);


// vv NaN per aggiungere i vari utenti al pool
foreach ($data["user_ids"] as $user_id){
    $statement = $pdo->prepare("
        INSERT INTO kms_user_pool(pool_id, user_id)
        VALUES(:pool_id, :user_id) 
    ");

    $params = array(
        "pool_id" => $last_id,
        "user_id" => $user_id
    );

    $statement->execute($params);
}
// ^^




sleep(1.5);

echo json_encode(array(
    "success" => true
));

