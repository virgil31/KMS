<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);



$keywords = $_GET["query"];

$limit = $_GET['limit'];
$start = $_GET['start'];


$query_user = "
    SELECT id,CONCAT(last_name,' ',first_name) as to_display, 'user' as type, CONCAT(last_name,' ',first_name) as description, '' as sitar_code, '' as name, '' as officer_name, '' as zone_name, '' as street_name
	FROM sf_guard_user

	WHERE first_name ilike '%$keywords%'
	OR last_name ilike '%$keywords%'
	OR CONCAT(first_name,' ',last_name) ilike '%$keywords%'
	OR CONCAT(last_name,' ',first_name) ilike '%$keywords%'";


$query_oi = "
    SELECT A.id,CONCAT('OI-',A.sitar_code) as to_display, 'information_source' as type,COALESCE(TRIM(both ' ' from A.description),'-') as description, CAST(A.sitar_code as TEXT),
            COALESCE(A.name,'-') as name,CONCAT(B.first_name,' ',B.last_name) as officer_name, D.name as zone_name,string_agg(F.name,',') as street_name
	FROM st_information_source A
	  LEFT JOIN sf_guard_user B ON B.id = A.liable_officier

	  LEFT JOIN st_information_source_st_circoscrizione C ON C.st_information_source_id = A.id
	  LEFT JOIN st_circoscrizione D ON D.id = C.st_circoscrizione_id

	  LEFT JOIN st_italian_address_info_source E ON E.information_source_id = A.id
	  LEFT JOIN st_italian_street F ON F.id = E.italian_street_id

	WHERE CAST(A.sitar_code AS TEXT) ilike '%$keywords%'
	OR A.description ilike '%$keywords%'
	OR A.name ilike '%$keywords%'
	OR D.name ilike '%$keywords%'
	OR F.name ilike '%$keywords%'
	OR(
        B.first_name ilike '%$keywords%'
        OR B.last_name ilike '%$keywords%'
        OR CONCAT(B.first_name,' ',B.last_name) ilike '%$keywords%'
        OR CONCAT(B.last_name,' ',B.first_name) ilike '%$keywords%'
	)
	GROUP BY A.id,B.first_name,B.last_name,D.name
";

$query_pa = "
    SELECT id,CONCAT('PA-',id) as to_display, 'archaeo_part' as type,description as description,'' as sitar_code, '' as name, '' as officer_name, '' as zone_name, '' as street_name
	FROM st_archaeo_part
	WHERE CAST(id AS TEXT) ilike '%$keywords%'
	OR description ilike '%$keywords%'
";


$statement = $pdo->prepare("
	SELECT *,count(*) OVER() AS total_count
	FROM
	(
    	($query_user)
    	UNION
    	($query_oi)
    	UNION
    	($query_pa)
	)tmp
    ". ((isset($_GET["search_type"]) && $_GET["search_type"] != "all") ? " WHERE type like '".$_GET["search_type"]."'" : "") . "
    ORDER BY type DESC,description ASC LIMIT $limit OFFSET $start
");



$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();
$total_count = 0;

foreach($result as $row){
    $total_count = $row->total_count;

    $row->street_name = ucwords(strtolower($row->street_name));

    $row->description = strip_tags($row->description);
    $row->description = str_ireplace($keywords,"<mark>".$keywords."</mark>",$row->description);//sottolineo le parole cercate con un semplice <mark>

    $row->tooltip = getTooltipInformation($row);
    $row->tooltip = str_ireplace($keywords,"<mark>".$keywords."</mark>",$row->tooltip);//sottolineo le parole cercate con un semplice <mark>

    array_push($arrayResult,$row);
}



echo json_encode(array(
	"result" => $arrayResult,
    "total" => $total_count,
    "eventual_error" => $pdo->errorInfo()
));

////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getTooltipInformation($record){
    $info_tooltip = "";

    if($record->type=="information_source"){
        $info_tooltip = "<hr><table>
                            <tr><th align='left' width='150' >Codice Monumento</th><td style='padding: 2px;'>".strip_tags($record->sitar_code)."</td></tr>
                            <tr><th align='left'>Nome</th><td style='padding: 2px;'>".strip_tags($record->name)."</td></tr>
                            <tr><th align='left'>Descrizione</th><td style='padding: 2px;'>".wordwrap(str_replace('"',"'",$record->description), 70, "<br>")."</td></tr>
                            <tr><th align='left'>Funz.Responsabile</th><td style='padding: 2px;'>".strip_tags($record->officer_name)."</td></tr>
                            <tr><th align='left'>Zona</th><td style='padding: 2px;'>".strip_tags($record->zone_name)."</td></tr>
                            <tr><th align='left'>Indirizzo</th><td style='padding: 2px;'>".strip_tags($record->street_name)."</td></tr>
                        </table><hr>";
    }
    if($record->type=="archaeo_part"){
        $info_tooltip = "<hr><table>
                            <tr><th align='left' width='150' >Codice Partizione</th><td style='padding: 2px;'>".strip_tags($record->id)."</td></tr>
                            <tr><th align='left'>Descrizione</th><td style='padding: 2px;'>".wordwrap(str_replace('"',"'",$record->description), 70, "<br>")."</td></tr>
                        </table><hr>";
    }
    else if($record->type=="user"){
        $info_tooltip = "<hr><table>
                            <tr><th align='left' width='150' >Utente</th><td style='padding: 2px;'>".strip_tags($record->to_display)."</td></tr>
                        </table><hr>";
    }

    return $info_tooltip;
}

