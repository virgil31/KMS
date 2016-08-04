<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


// LIST files BY collection_id
if(isset($_GET["collection_id"])){
    $collection_id = $_GET["collection_id"];

    //nella prima parte della query mi ottengo i dati del CREATORE DELLA COLLECTION (che non fa parte della tabella kms_collection_user, ma si eredita implicitamente da kms_collection)
    //nella seconda quella degli altri
    $statement = $pdo->prepare("
        SELECT *
        FROM (
            (
                SELECT A.id as collection_id, created_by as user_id, CONCAT(B.first_name,' ',B.last_name) user_name, D.id as group_id, D.name as group_name, false as is_coworker_manager, 'images/icons/icon_hammer.png' as icon_url, 'Creatore della Collezione' as icon_tooltip
                FROM kms_collection A
                    LEFT JOIN sf_guard_user B ON B.id = A.created_by
                    LEFT JOIN sf_guard_user_group C ON C.user_id = B.id
                    LEFT JOIN sf_guard_group D ON D.id = C.group_id
                WHERE A.id = $collection_id
            )
            UNION
            (
                SELECT A.collection_id, A.user_id, CONCAT(B.first_name,' ',B.last_name) as user_name, D.id as group_id,D.name as group_name,is_coworker_manager, '' as icon_url, '' as icon_tooltip
                FROM kms_collection_user A
                    LEFT JOIN sf_guard_user B ON B.id = A.user_id	
                    LEFT JOIN sf_guard_user_group C ON C.user_id = B.id
                    LEFT JOIN sf_guard_group D ON D.id = C.group_id
                WHERE A.collection_id = $collection_id
            )
        ) tmp
        ORDER BY user_name
    
        
    ");
}


$statement->execute();
//$result = $statement->fetchAll(PDO::FETCH_OBJ);


$result = array();

while($row = $statement->fetchObject()){
    if($row->group_id == 1 && $row->icon_url == "") {
        $row->icon_url = "images/icons/icon_admin.png";
        $row->icon_tooltip = "Amministratore KMS";
    }
    else if($row->is_coworker_manager == true){
        $row->icon_url = "images/icons/icon_star.png";
        $row->icon_tooltip = "Gestore lista Collaboratori";
    }

    array_push($result,$row);
}

sleep(1);

echo json_encode(array(
    "success" => true,
	"result" => $result
));
