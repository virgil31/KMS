<?php

//echo "Collection_id alla quale associare i file: ".$_GET["collection_id"];

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$conn = pg_connect($ini_array['stringconnect']) or die("Can't connect");

$collection_id = $_GET["collection_id"];

$file_to_upload = $_FILES["qqfile"]["tmp_name"];
$upload_dir = $ini_array["path_root_upload_kms"];
$nome_finale_file = $_POST["qqfilename"];


//ottengo l'id avrà in st_file
$result = pg_query($conn,"
    select (last_value) as last_file_id
    FROM st_file_id_seq
");
$row = pg_fetch_array($result);
$last_file_id = $row["last_file_id"];

$id_to_assign = $last_file_id+1;
$estensione_file = pathinfo($_FILES["qqfile"]["name"], PATHINFO_EXTENSION);
$md5 = md5_file($file_to_upload);

$directory  = floor($id_to_assign/1000);


//aggiungo in st_file
$s = $pdo->prepare("
	INSERT INTO st_file(url,md5)
	VALUES(:url,:md5)
");


$params = array(
    'url' => $directory."/".$id_to_assign.".".$estensione_file,
    'md5' => $md5
);

$success = $s->execute($params);

if ($success) {
    //aggiungo in kms_collection_file
    //aggiungo in st_file
    $s = $pdo->prepare("
        INSERT INTO kms_collection_file(collection_id,file_id,title)
        VALUES(:collection_id,:file_id,:title)
    ");

    $tmp_info = pathinfo($nome_finale_file);
    $name_without_ext = $tmp_info["filename"];

    $params = array(
        'collection_id' => $collection_id,
        'file_id' => $id_to_assign,
        'title' => $name_without_ext
    );

    $success = $s->execute($params);

    if ($success) {
        //verifico se esiste la cartella $upload_dir.$directory (ad esempio /home/DocumentiSitar/34/)
        // e nel caso la creo
        if(!file_exists($upload_dir.$directory))
            mkdir($upload_dir.$directory, 0775);

        move_uploaded_file($file_to_upload,$upload_dir.$directory."/".$id_to_assign.".".$estensione_file);

        echo json_encode(array(
            "success" => true
        ));
    }
    else{
        echo json_encode(array(
            "success" => false,
            "error_message" =>  $pdo->errorInfo()
        ));
    }
}
else{
    echo json_encode(array(
        "success" => false,
        "error_message" =>  $pdo->errorInfo()
    ));
}




/*
 *
 * FLOW UPLOAD
 * (PREMESSA: /home/DocumentiSitar/KMS/ è suddivisa da cartelle da 1000 files l'una)
 *
 * -calcolo md5
 * -calcolo l'id che dovrò assegnargli e la sua estensione
 * -aggiungo a st_file e mi tiro fuori l'id appena inserito
 * -calcolo in quale cartella dovrà andare (ID/1000 ad esemptio, id=45000 => cartella "/home/DocumentiSitar/KMS/45")
 * -se non esiste la creo
 * -sposto il file nella cartella apposita
 *
 *
 * */