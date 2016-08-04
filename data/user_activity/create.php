<?php

// negli altri file includere questo file con -> require_once('../user_activity/create.php');


function createUserActivity($pdo,$user_id,$activity_description,$target_url,$icon,$collection_id,$event_id){

    // attività di registrazione utente
    if($collection_id == null && $event_id == null){
        $statement = $pdo->prepare("
            INSERT INTO kms_user_activity(user_id, activity_description, target_url, date, icon)
            VALUES(:user_id,:activity_description,:target_url,now(), :icon)
        ");

        $params = array(
            "user_id" => $user_id,
            "activity_description" => $activity_description,
            "target_url" => $target_url,
            "icon" => $icon
        );

        $statement->execute($params);
    }
    // attività di una COLLECTION
    else if($collection_id != null){
        $statement = $pdo->prepare("
            INSERT INTO kms_user_activity(user_id, activity_description, target_url, date, icon,collection_id)
            VALUES(:user_id,:activity_description,:target_url,now(), :icon, :collection_id)
        ");

        $params = array(
            "user_id" => $user_id,
            "activity_description" => $activity_description,
            "target_url" => $target_url,
            "icon" => $icon,
            "collection_id" => $collection_id
        );

        $statement->execute($params);
    }
    // attività di un EVENTO
    else{
        $statement = $pdo->prepare("
            INSERT INTO kms_user_activity(user_id, activity_description, target_url, date, icon, event_id)
            VALUES(:user_id,:activity_description,:target_url,now(), :icon, :event_id)
        ");

        $params = array(
            "user_id" => $user_id,
            "activity_description" => $activity_description,
            "target_url" => $target_url,
            "icon" => $icon,
            "event_id" => $event_id
        );

        $statement->execute($params);
    }

}



function getCollectionTitle($pdo,$collection_id){

    $statement = $pdo->prepare("
        SELECT title
        FROM kms_collection
        WHERE id = :id
    ");
    $params = array(
        "id" => $collection_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return $result[0]->title;
}


function getUserFullName($pdo,$user_id){

    $statement = $pdo->prepare("
        SELECT CONCAT(last_name,' ',first_name) as full_name
        FROM sf_guard_user
        WHERE id = :id
    ");
    $params = array(
        "id" => $user_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return $result[0]->full_name;
}


function getPoolName($pdo,$pool_id){

    $statement = $pdo->prepare("
        SELECT name
        FROM kms_pool
        WHERE id = :id
    ");
    $params = array(
        "id" => $pool_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return $result[0]->name;

}

function getCollectionFileTitle($pdo,$colletion_id,$file_id){

    $statement = $pdo->prepare("
        SELECT title
        FROM kms_collection_file
        WHERE collection_id = :collection_id
          AND file_id = :file_id
    ");
    $params = array(
        "collection_id" =>  $colletion_id,
        "file_id" => $file_id
    );

    $statement->execute($params);
    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return $result[0]->title;

}