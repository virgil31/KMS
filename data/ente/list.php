<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$statement = $pdo->prepare("
	SELECT id, legal_name, short_name	
    FROM st_person 
    WHERE type ilike 'StLegalPerson'
    ORDER BY legal_name
");

$statement->execute();

$result = array();

while($row = $statement->fetchObject()){
    if(trim($row->short_name) != "")
        $row->full_name =  $row->short_name.' - '.$row->legal_name;
    else
        $row->full_name =  $row->legal_name;

    array_push($result,$row);
}



echo json_encode(array(
    "success" => true,
    "result" => $result
));
