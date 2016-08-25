<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


// LIST files BY event_id
if(isset($_GET["event_id"])){
    $event_id = $_GET["event_id"];

    //nella prima parte della query mi ottengo i dati del CREATORE DELLA EVENT (che non fa parte della tabella kms_event_user, ma si eredita implicitamente da kms_event)
    //nella seconda quella degli altri
    $statement = $pdo->prepare("
        SELECT *
        FROM (
            (
                SELECT A.id as event_id, created_by as user_id, CONCAT(B.last_name,' ',B.first_name) user_name, D.id as group_id, D.name as group_name, false as is_coworker_manager, 'images/icons/icon_hammer.png' as icon_url, 'Creatore dell''Evento' as icon_tooltip,
                  CONCAT(E.short_name,' - ',E.legal_name) as affiliation_name
                FROM kms_event A
                    LEFT JOIN sf_guard_user B ON B.id = A.created_by
                    LEFT JOIN sf_guard_user_group C ON C.user_id = B.id
                    LEFT JOIN sf_guard_group D ON D.id = C.group_id
                    LEFT JOIN st_person E ON E.id = B.affiliation_id
                WHERE A.id = $event_id
            )
            UNION
            (
                SELECT A.event_id, A.user_id, CONCAT(B.last_name,' ',B.first_name) as user_name, D.id as group_id,D.name as group_name,is_coworker_manager, '' as icon_url, '' as icon_tooltip,
                  CONCAT(E.short_name,' - ',E.legal_name) as affiliation_name
                FROM kms_event_user A
                    LEFT JOIN sf_guard_user B ON B.id = A.user_id	
                    LEFT JOIN sf_guard_user_group C ON C.user_id = B.id
                    LEFT JOIN sf_guard_group D ON D.id = C.group_id
                    LEFT JOIN st_person E ON E.id = B.affiliation_id
                WHERE A.event_id = $event_id
            )
        ) tmp
        ORDER BY user_name
    
        
    ");
}


$statement->execute();
//$result = $statement->fetchAll(PDO::FETCH_OBJ);


$result = array();

while($row = $statement->fetchObject()){

    if($row->is_coworker_manager == true){
        $row->icon_url = "images/icons/icon_star.png";
        $row->icon_tooltip = "Gestore lista Collaboratori";
    }
    else if($row->group_id == 1 && $row->icon_url == "") {
        $row->icon_url = "images/icons/icon_admin.png";
        $row->icon_tooltip = "Amministratore KMS";
    }

    array_push($result,$row);
}

sleep(1);

echo json_encode(array(
    "success" => true,
	"result" => $result
));
