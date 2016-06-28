<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

if(isCollectionCreator($pdo,$data["user_id"],$data["collection_id"])){
    echo json_encode(array(
        "success" => false,
        "metaData" => array(
            "msg" => "L'utente selezionato è il <b>creatore</b> della Collezione! <br>Può quindi già gestire la lista dei collaboratori."
        )
    ));
    exit;
}

$statement = $pdo->prepare("
    INSERT INTO kms_collection_user(collection_id, user_id)
	VALUES(:collection_id, :user_id)
");
$params = array(
    "collection_id" => $data["collection_id"],
    "user_id" => $data["user_id"]
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);


$error_info = $pdo->errorInfo();

if($error_info[1] == 7){
    echo json_encode(array(
        "success" => false,
        "metaData" => array(
            "msg" => "Collaboratore già presente in lista!"
        )
    ));
}

else{
    echo json_encode(array(
        "success" => true
    ));
}

////////////////////////////////////////////////////////////////////

function isCollectionCreator($pdo,$user_id,$collection_id){
    $statement = $pdo->prepare("
        SELECT *
        FROM kms_collection
        WHERE created_by = :user_id
          AND id = :collection_id
    ");
    $params = array(
        "collection_id" => $collection_id,
        "user_id" => $user_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return (count($result)==0) ? false : true;
}

