<?php

header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);

$user_id = $_GET["user_id"];

$limit = $_GET['limit'];
$start = $_GET['start'];

$total = 0;

$statement = $pdo->prepare("
    SELECT A.id,A.user_id,CONCAT(B.last_name,' ',B.first_name ) as user_name,A.activity_description,A.target_url,A.date,A.icon,COUNT(*) OVER() as total
    FROM kms_user_activity A
        LEFT JOIN sf_guard_user B ON B.id = A.user_id
    
    WHERE A.user_id =  :user_id
    ORDER BY A.date DESC LIMIT :limit OFFSET :offset
");

$params = array(
    "user_id" => $user_id,
    "limit" => $limit,
    "offset" => $start
);

$statement->execute($params);

$result = $statement->fetchAll(PDO::FETCH_OBJ);

if(count($result) != 0)
    $total = $result[0]->total;


$arrayResult = array();


foreach ($result as $user_activity){
    $user_name = ($user_id==$_COOKIE["user_id"]) ? "<b>Hai</b>" : "<b>".$user_activity->user_name."</b> ha ";
    $activity_description = $user_activity->activity_description;
    $icon = $user_activity->icon;

    $composed = '<div style="margin-bottom: 5px;">
                    '.$user_name.' '.$activity_description.'                    
                 </div>';

    $date = new DateTime($user_activity->date);
    $day = $date->format('d/m/Y');
    $hour = $date->format('H:i');

    /*
    $user_activity->composed = wordWrapIgnoreHTML($composed, 70, "<br>").'
                               <hr><div style="margin-top: 5px;"><img style="margin-right: 5px;" src="images/icons/'.$icon.'" alt=" " height="16" width="16"> il '.$day.' alle '.$hour.'</div>';*/

    $user_activity->composed =  '<div style="padding:5px; border-radius: 4px;border-bottom: 2px inset #afafaf; background: white; cursor: pointer;">'.$composed.'
                                    <hr><div style="margin-top: 5px;"><img style="margin-right: 5px;" src="images/icons/'.$icon.'" alt=" " height="16" width="16"> il '.$day.' alle '.$hour.'</div>
                                </div>';

    array_push($arrayResult,$user_activity);
}

echo json_encode(array(
	"result" => $arrayResult,
    "total" => $total
));


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
