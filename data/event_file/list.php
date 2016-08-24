<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


// LIST files BY event_id
if(isset($_GET["event_id"]) && !isset($_GET["file_id"])){
    $event_id = $_GET["event_id"];
    $statement = $pdo->prepare("
        SELECT A.event_id,A.file_id,A.title,B.url as extension, A.uploaded_by, CONCAT(C.first_name,' ',C.last_name) as uploaded_by_name, uploaded_at 
        FROM kms_event_file A
          LEFT JOIN st_file B ON B.id = A.file_id
          LEFT JOIN sf_guard_user C ON C.id = A.uploaded_by
        WHERE A.event_id = $event_id
        ORDER BY A.title
    ");
}

// LIST files BY event_id AND file_id
else if(isset($_GET["event_id"]) && isset($_GET["file_id"])){
    $event_id = $_GET["event_id"];
    $file_id = $_GET["file_id"];

    $statement = $pdo->prepare("
        SELECT A.event_id,A.file_id,A.title,B.url as extension, A.uploaded_by, CONCAT(C.first_name,' ',C.last_name) as uploaded_by_name, uploaded_at, D.title as event_name, D.created_at as event_created_at,D.closed_at as event_closed_at
        FROM kms_event_file A
          LEFT JOIN st_file B ON B.id = A.file_id
          LEFT JOIN sf_guard_user C ON C.id = A.uploaded_by
          LEFT JOIN kms_event D ON D.id = A.event_id
        WHERE A.event_id = $event_id
          AND B.id = $file_id
        ORDER BY A.title
    ");
}


$statement->execute();
//$result = $statement->fetchAll(PDO::FETCH_OBJ);


$result = array();

while($row = $statement->fetchObject()){
    $pathinfo =  pathinfo($row->extension);
    $row->extension = $pathinfo["extension"];
    $row->type = getTypeFromExtension($row->extension );

    array_push($result,$row);
}

//var_dump($result);
//sleep(1.5);

echo json_encode(array(
	"result" => $result
));


//////////////////////////////////////////////


function getTypeFromExtension($extension){
    $type = "";

    switch($extension){
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'tif':
        case 'tiff':
            $type = "immagine";
            break;
        case 'pdf':
            $type = "pdf";
            break;
        case 'doc':
        case 'docx':
            $type = "word";
            break;
        case "txt":
        case "sql":
        case "jgw":
        case "tmp":
        case "tfw":
            $type = "testuale";
            break;
        case "zip":
        case "rar":
        case "7z":
            $type = "archivio";
            break;
    }

    return $type;
}