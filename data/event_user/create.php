<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

if(isEventCreator($pdo,$data["user_id"],$data["event_id"])){
    echo json_encode(array(
        "success" => false,
        "metaData" => array(
            "msg" => "L'utente selezionato è il <b>creatore</b> dell'Evento! <br>Ha quindi già pieno potere su quest'ultima."
        )
    ));
    exit;
}

$statement = $pdo->prepare("
    INSERT INTO kms_event_user(event_id, user_id)
	VALUES(:event_id, :user_id)
");
$params = array(
    "event_id" => $data["event_id"],
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

    require_once('../user_activity/create.php');
    createUserActivity($pdo,$_COOKIE["user_id"],'aggiunto <b>'.getUserFullName($pdo,$data["user_id"]).'</b> ai collaboratori dell\'evento <b>"'.getEventTitle($pdo,$data["event_id"]).'"</b>',"event/".$data["event_id"]."/coworkers","icon_collaboratori.png",$data["event_id"],null);

    echo json_encode(array(
        "success" => true
    ));
}

////////////////////////////////////////////////////////////////////

function isEventCreator($pdo,$user_id,$event_id){
    $statement = $pdo->prepare("
        SELECT *
        FROM kms_event
        WHERE created_by = :user_id
          AND id = :event_id
    ");
    $params = array(
        "event_id" => $event_id,
        "user_id" => $user_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return (count($result)==0) ? false : true;
}

