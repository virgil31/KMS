<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$user_id = $_POST["user_id"];
$user_salt = $_POST["user_salt"];

if(!isActive($pdo,$user_id)){
    $statement = $pdo->prepare("
        UPDATE sf_guard_user
        SET is_active = TRUE
        WHERE id = :user_id
          AND salt = :user_salt;
    ");

    $params = array(
        "user_id" => $user_id,
        "user_salt" => $user_salt
    );

    $statement->execute($params);


    require_once('../user_activity/create.php');
    createUserActivity($pdo,$user_id,'effettuato la registrazione a <b>KMS</b>','user/'.$user_id,"icon_welcome.png",null,null);
}


echo json_encode(array(
    "success" => true
));



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function isActive($pdo, $user_id){

    $statement = $pdo->prepare("
        SELECT is_active
        FROM sf_guard_user
        WHERE id = :user_id
    ");

    $params = array(
        "user_id" => $user_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    return $result[0]->is_active;

}