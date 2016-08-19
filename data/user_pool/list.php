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

//LIST da user_id PAGINATO
else if(isset($_GET["user_id"])){
    $user_id = $_GET["user_id"];

    $statement = $pdo->prepare("
        SELECT A.id as pool_id, A.name as pool_name,CONCAT(A.name,' ',A.id) as pool_full_name, A.created_by, CONCAT(B.last_name,' ',B.first_name) as created_by_name,
          ARRAY_AGG(C.user_id) as user_ids,COUNT(*) OVER() as total
        FROM kms_pool A
            LEFT JOIN sf_guard_user B ON B.id = A.created_by
            LEFT JOIN kms_user_pool C ON C.pool_id = A.id
        WHERE A.created_by = $user_id
        GROUP BY A.id, pool_name, pool_full_name, created_by, created_by_name
        ORDER BY $pro $dir LIMIT $limit OFFSET $start
    ");
}

//LIST PAGINATO
else{
    $statement = $pdo->prepare("
	SELECT A.id as pool_id, A.name as pool_name,CONCAT(A.name,' ',A.id) as pool_full_name, A.created_by, CONCAT(B.last_name,' ',B.first_name) as created_by_name,COUNT(*) OVER() as total
        FROM kms_pool A
            LEFT JOIN sf_guard_user B ON B.id = A.created_by
        ORDER BY $pro $dir LIMIT $limit OFFSET $start
    ");
}


$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();

foreach ($result as $row){
    $row->user_ids = array_map('intval',(explode(",",substr($row->user_ids,1,-1)))); // array_agg => (int) array

    array_push($arrayResult,$row);
}



if(count($arrayResult) != 0)
    $total = $arrayResult[0]->total;

echo json_encode(array(
	"result" => $arrayResult,
    "total" => $total
));
