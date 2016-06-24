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

$image = new Imagick($ini_array['path_root_upload_kms'].$url);
$image->setImageFormat("jpg");


$image->scaleImage(2000,0);


header( "Content-Type: image/jpg" );
echo $image;
