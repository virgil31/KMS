<?php

$ini_array = parse_ini_file("../config.ini");

$conn = pg_connect($ini_array['stringconnect']) or die("Can't connect");

$file_id = $_POST["file_id"];

$result = pg_query($conn,"
    SELECT url
    FROM st_file
    WHERE id = $file_id
");
$row = pg_fetch_object($result);
$url = $row->url;
$file_info = pathinfo("$url");

echo json_encode(array(
    "extension" => $file_info["extension"]
));
