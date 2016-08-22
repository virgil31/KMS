<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


// LIST BY POOL
if(isset($_GET["pool_id"])){
    $pool_id = $_GET["pool_id"];
    
    $statement = $pdo->prepare("
        SELECT A.id, INITCAP(A.first_name) as first_name, INITCAP(A.last_name) as last_name, A.email_address, C.name as group_name, INITCAP(CONCAT(A.first_name,' ',A.last_name, ' (#', A.id,')')) as full_name,affiliation_id
        FROM sf_guard_user A
            LEFT JOIN sf_guard_user_group B ON A.id = B.user_id
            LEFT JOIN sf_guard_group C ON C.id = B.group_id
            LEFT JOIN kms_user_pool D ON D.user_id = A.id
        WHERE D.pool_id = $pool_id
        ORDER BY last_name, first_name
    ");
}

//LISTING NORMALE/FULL
else{
	$statement = $pdo->prepare("
        SELECT A.id, INITCAP(A.first_name) as first_name, INITCAP(A.last_name) as last_name, A.email_address, C.name as group_name, INITCAP(CONCAT(A.first_name,' ',A.last_name, ' (#', A.id,')')) as full_name,affiliation_id, D.id as ente_id, CONCAT(D.short_name,' - ',D.legal_name) as ente_name
	 
        FROM sf_guard_user A
            LEFT JOIN sf_guard_user_group B ON A.id = B.user_id
            LEFT JOIN sf_guard_group C ON C.id = B.group_id
            LEFT JOIN st_person D ON D.id = A.affiliation_id
            
        ORDER BY last_name, first_name
    ");
}


$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

//var_dump($result);

echo json_encode(array(
	"result" => $result
));
