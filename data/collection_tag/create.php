<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$data = json_decode($_POST['data'],true);

foreach ($data["tags"] as $tag){
    $tag = explode(".",$tag);

    $s = $pdo->prepare("
        INSERT INTO kms_collection_tag(collection_id, type, target_id) 
        VALUES(:collection_id, :type, :target_id)	
    ");

    $params = array(
        'collection_id' => $data['collection_id'],
        'type' => $tag[0],
        'target_id' => $tag[1]
    );

    $success = $s->execute($params);
}


require_once('../user_activity/create.php');
createUserActivity($pdo,$_COOKIE["user_id"],'aggiunto dei TAG alla Collezione <b>'.getCollectionTitle($pdo,$data["collection_id"]).'</b>','collection/'.$data["collection_id"].'/tags',"icon_tag.png",$data["collection_id"],null);

sleep(1.5);

echo json_encode(array(
    "success" => true,
    "tmp" => $pdo->errorInfo()
));
