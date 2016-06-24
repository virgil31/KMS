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



    $file = $ini_array['path_root_upload_kms'].$url;
    $filename = 'pdf.pdf';
    header('Content-type: application/pdf');
    header('Content-Disposition: inline; filename="' . $filename . '"');
    header('Content-Transfer-Encoding: binary');
    header('Accept-Ranges: bytes');
    @readfile($file);


/*
  $file = '/home/DocumentiSitar/KMS/33/33194.pdf';
  $filename = 'filename.pdf';
  header('Content-type: application/pdf');
  header('Content-Disposition: inline; filename="' . $filename . '"');
  header('Content-Transfer-Encoding: binary');
  header('Accept-Ranges: bytes');
  @readfile($file);
*/

?>


