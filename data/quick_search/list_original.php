<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);



$keywords = $_GET["query"];

$query_user = "
    SELECT id, 'user' as type, CONCAT(last_name,' ',first_name) as description
	FROM sf_guard_user

	WHERE first_name ilike '%$keywords%'
	OR last_name ilike '%$keywords%'
	OR CONCAT(first_name,' ',last_name) ilike '%$keywords%'
	OR CONCAT(last_name,' ',first_name) ilike '%$keywords%'";


$query_oi = "
    SELECT id, 'information_source' as type,CONCAT(sitar_code,' - ',description) as description
	FROM st_information_source
	WHERE CAST(sitar_code AS TEXT) ilike '%$keywords%'
	OR description ilike '%$keywords%'
";

$query_pa = "
    SELECT id, 'archaeo_part' as type,CONCAT(id,' - ',description) as description
	FROM st_archaeo_part
	WHERE CAST(id AS TEXT) ilike '%$keywords%'
	OR description ilike '%$keywords%'
";


$statement = $pdo->prepare("
    ($query_user)
    UNION
    ($query_oi)
    UNION
    ($query_pa)

	ORDER BY description
    LIMIT 20

");



$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();

foreach($result as $row){
    if(strlen($row->description) > 125)
        $row->description = substr(strip_tags($row->description),0,125)."(...)";

    array_push($arrayResult,$row);
}

//var_dump($result);

echo json_encode(array(
	"result" => $arrayResult
));
