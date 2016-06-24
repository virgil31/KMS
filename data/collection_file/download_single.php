<?php

$ini_array = parse_ini_file("../config.ini");
$default_upload_dir = $ini_array["path_root_upload_kms"];

$collection_id = $_GET["collection_id"];
$file_id = $_GET["file_id"];




$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$statement = $pdo->prepare("
	SELECT A.title,B.url
	FROM kms_collection_file A
	  LEFT JOIN st_file B ON B.id = A.file_id
    WHERE A.file_id = $file_id
");

$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);


$title = $result[0]->title;
$url = $result[0]->url;
$tmp_info = pathinfo($url);
$file_title = $title.".".$tmp_info["extension"];


$file_url = $default_upload_dir.$url;
header('Content-Type: application/octet-stream');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"$file_title\"");
readfile($file_url);


