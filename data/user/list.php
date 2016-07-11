<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


// LIST BY POOL
if(isset($_GET["pool_id"])){
    $pool_id = $_GET["pool_id"];
    
    $statement = $pdo->prepare("
        SELECT A.id, A.first_name, A.last_name, A.email_address, C.name as group_name, CONCAT(A.first_name,' ',A.last_name, ' ', A.id) as full_name
        FROM sf_guard_user A
            LEFT JOIN sf_guard_user_group B ON A.id = B.user_id
            LEFT JOIN sf_guard_group C ON C.id = B.group_id
            LEFT JOIN kms_user_pool D ON D.user_id = A.id
        WHERE D.pool_id = $pool_id
        ORDER BY first_name,last_name
    ");
}

//LISTING NORMALE/FULL
else{
	$statement = $pdo->prepare("
        SELECT A.id, A.first_name, A.last_name, A.email_address, C.name as group_name, CONCAT(A.first_name,' ',A.last_name, ' ', A.id) as full_name
        FROM sf_guard_user A
            LEFT JOIN sf_guard_user_group B ON A.id = B.user_id
            LEFT JOIN sf_guard_group C ON C.id = B.group_id
        ORDER BY first_name,last_name
    ");
}


$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

//var_dump($result);

echo json_encode(array(
	"result" => $result
));
