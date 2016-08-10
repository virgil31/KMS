<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);

// GET BY COLLECTION ID
if(isset($_GET["collection_id"])){
    $collection_id = $_GET["collection_id"];

    $statement = $pdo->prepare("
        SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at,
          license_id, C.name as license_name, C.description as license_description
        FROM kms_collection A
          LEFT JOIN sf_guard_user B ON B.id = A.created_by
          LEFT JOIN kms_license C ON C.id = A.license_id
        WHERE A.id = $collection_id
        ORDER BY title,description
    ");
}

// GET BY USER ID e SOLO QUELLE APERTE (per la fase di taggatura inversa)
else if(isset($_GET["user_id"]) && isset($_GET["flag_solo_aperte"])){
    $user_id = $_GET["user_id"];

    $statement = $pdo->prepare("
        SELECT *
        FROM(
            (
                SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at
        
                FROM kms_collection A
                  LEFT JOIN sf_guard_user B ON B.id = A.created_by	  
                  
                WHERE A.created_by = 122
                    AND DATE_PART('day',now() - A.created_at) < 2
            )
            UNION
            (
                SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at
        
                FROM kms_collection_user C
                    LEFT JOIN kms_collection A ON C.collection_id = A.id
                    LEFT JOIN sf_guard_user B ON B.id = A.created_by	
                WHERE C.user_id = 122
                    AND DATE_PART('day',now() - A.created_at) < 2
        
            )
        ) tmp
        ORDER BY created_at,title,description

    ");
}

// GET BY USER ID
else if(isset($_GET["user_id"])){
    $user_id = $_GET["user_id"];


    // con questa query vedo solo LE MIE collezioni (quelle che ho creato io)
    $statement = $pdo->prepare("
        SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at
        FROM kms_collection A
          LEFT JOIN sf_guard_user B ON B.id = A.created_by
        WHERE A.created_by = $user_id
        ORDER BY created_at,title,description
    ");


    /*
    // con questa query vedo le collezioni che ho creato io e anche quelle di cui sono collaboratore
    $statement = $pdo->prepare("
        SELECT *
        FROM(
            (
                SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at
        
                FROM kms_collection A
                  LEFT JOIN sf_guard_user B ON B.id = A.created_by	  
                  
                WHERE A.created_by = $user_id
            )
            UNION
            (
                SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at
                FROM kms_collection_user C
                    LEFT JOIN kms_collection A ON C.collection_id = A.id
                    LEFT JOIN sf_guard_user B ON B.id = A.created_by	
                WHERE C.user_id = $user_id
        
            )
        ) tmp
        ORDER BY created_at DESC,title,description
    ");*/


}

//NORMAL LIST
else{
    $statement = $pdo->prepare("
        SELECT A.id,A.title,A.description,A.created_by, CONCAT(B.last_name,' ',B.first_name) AS created_by_name,A.created_at
        FROM kms_collection A
          LEFT JOIN sf_guard_user B ON B.id = A.created_by
        ORDER BY title,description
    ");
}


$success = $statement->execute();

sleep(1.5);

if ($success) {
    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    $arrayResult = array();

    foreach ($result as $row) {
        $row->description  = wordwrap(str_replace('"',"'",$row->description), 100, "<br>");
        array_push($arrayResult, $row);
    }

    echo json_encode(array(
        "success" => true,
        "result" => $arrayResult
    ));
}
else{
    echo json_encode(array(
        "success" => false,
        "error_message" =>  $pdo->errorInfo()
    ));
}





