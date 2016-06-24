<?php

$ini_array = parse_ini_file("../config.ini");

$conn = pg_connect($ini_array['stringconnect']) or die("Can't connect");

$file_id = $_GET["file_id"];

$result = pg_query($conn,"
    SELECT url
    FROM st_file
    WHERE id = $file_id
");
$row = pg_fetch_object($result);
$url = $row->url;

$file_contents = file_get_contents($ini_array['path_root_upload_kms'].$url);
//echo $file_contents;

$file_contents = str_replace("\r","<br>",$file_contents );  //sostituisco gli "a capo" con i BR

echo $file_contents;
