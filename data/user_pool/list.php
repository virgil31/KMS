<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$sort = (isset($_GET['sort']) ? $_GET['sort'] : $_GET['sort']);
$tmp = json_decode($sort,true);
$pro = $tmp[0]['property'];
$dir = $tmp[0]['direction'];

$limit = $_GET['limit'];
$start = $_GET['start'];

$total = 0;

//LIST PAGINATO con QUERY
if(isset($_GET["query"])){
    $query = $_GET["query"];

    $statement = $pdo->prepare("
        SELECT A.id as pool_id, A.name as pool_name,CONCAT(A.name,' ',A.id) as pool_full_name, A.created_by, CONCAT(B.last_name,' ',B.first_name) as created_by_name,COUNT(*) OVER() as total
        FROM kms_pool A
            LEFT JOIN sf_guard_user B ON B.id = A.created_by
        WHERE CONCAT(A.name,' ',A.id) ilike '%$query%'
        ORDER BY $pro $dir LIMIT $limit OFFSET $start
    ");


}

//LIST PAGINATO
else{
    $statement = $pdo->prepare("
	SELECT A.id as pool_id, A.name as pool_name,CONCAT(A.name,' ',A.id) as pool_full_name, A.created_by, CONCAT(B.first_name,' ',B.last_name) as created_by_name,COUNT(*) OVER() as total
        FROM kms_pool A
            LEFT JOIN sf_guard_user B ON B.id = A.created_by
        ORDER BY $pro $dir LIMIT $limit OFFSET $start
    ");
}


$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);



if(count($result) != 0)
    $total = $result[0]->total;

echo json_encode(array(
	"result" => $result,
    "total" => $total
));
