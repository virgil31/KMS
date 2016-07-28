<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$collection_id = $_GET["collection_id"];


$query_user = "
    SELECT id,CONCAT('user,',CAST(A.id as TEXT)) as composed_id,CONCAT(last_name,' ',first_name) as to_display, CAST('user' as TEXT) as type, CONCAT(last_name,' ',first_name) as description, CAST('' as TEXT) as sitar_code, '' as name, NULL as officer_id ,
          '' as officer_name, '' as zone_name, '' as street_name,0 as oi_id, 0 as oi_sitar_code
    FROM sf_guard_user A
      LEFT JOIN kms_collection_tag B ON (A.id = B.target_id AND B.type like 'user')
    
    WHERE B.collection_id = $collection_id

";


$query_oi = "
    SELECT A.id, CONCAT('information_source,',CAST(A.id as TEXT)) as composed_id, CONCAT('Monumento-',A.sitar_code) as to_display,CAST('information_source' as TEXT) as type, 
        COALESCE( NULLIF(A.description,'') , '-' ) as description, 
        CAST(A.sitar_code as TEXT) as sitar_code,
        COALESCE( NULLIF(A.name,'') , '-' ) as name,                
        B.id as officer_id,CONCAT(B.last_name,' ',B.first_name) as officer_name,         
        D.name as zone_name, 
        string_agg(F.name,', ') as street_name,
             
        0 as oi_id, 0 as oi_sitar_code
    
    FROM st_information_source A
        LEFT JOIN sf_guard_user B ON B.id = A.liable_officier
    
        LEFT JOIN st_information_source_st_circoscrizione C ON C.st_information_source_id = A.id
        LEFT JOIN st_circoscrizione D ON D.id = C.st_circoscrizione_id
    
        LEFT JOIN st_italian_address_info_source E ON E.information_source_id = A.id
        LEFT JOIN st_italian_street F ON F.id = E.italian_street_id
    
        LEFT JOIN kms_collection_tag G ON (A.id = G.target_id AND G.type like 'information_source')
    
    WHERE G.collection_id = $collection_id
    
    
    GROUP BY A.id,B.id,B.first_name,B.last_name,D.name
     
";



$query_pa = "
    SELECT A.id,CONCAT('archaeo_part,',CAST(A.id as TEXT)) as composed_id, CONCAT('Partizione-',A.id) as to_display, 'archaeo_part' as type,
           COALESCE( NULLIF(A.description,'') , '-' ) as description,
           CAST(A.id as TEXT) as sitar_code, '' as name,
           B.liable_officier as officer_id,
           CONCAT(C.last_name,' ',C.first_name) as officer_name,
           E.name as zone_name,
           '' as street_name,
           B.id as oi_id, B.sitar_code as oi_sitar_code
    
    FROM st_archaeo_part A
         LEFT JOIN st_information_source B ON B.id = A.information_source_id
         LEFT JOIN sf_guard_user C ON C.id = B.liable_officier
    
         LEFT JOIN st_information_source_st_circoscrizione D ON D.st_information_source_id = B.id
         LEFT JOIN st_circoscrizione E ON E.id = D.st_circoscrizione_id
    
         LEFT JOIN kms_collection_tag F ON (A.id = F.target_id AND F.type like 'archaeo_part')
    
    WHERE collection_id = $collection_id
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
    ORDER BY type DESC,sitar_code
");


$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();
$total_count = 0;

foreach($result as $row){
    $total_count = $row->total_count;

    $row->collection_id = $collection_id;

    $row->street_name = ucwords(strtolower($row->street_name));    
    $row->tooltip = getTooltipInformation($pdo,$row);

    array_push($arrayResult,$row);
}

sleep(1);   //per evitare il run layout failed


echo json_encode(array(
    "result" => $arrayResult,
    "total" => $total_count,
    "eventual_error" => $pdo->errorInfo()
));




////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


function getTooltipInformation($pdo,$record){
    $info_tooltip = "";

    // OI
    if($record->type=="information_source"){
        $info_tooltip = "<div style='background: white; border-radius: 3px; padding: 10px; width: 100%; border-bottom: 2px inset #afafaf;'>
                            <table>
                                <tr><th align='left' width='150' style='color:#2c2c2c;' >Codice Monumento</th><td style='padding: 2px;'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->sitar_code)."</u></a></td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Nome</th><td style='padding: 2px;color:#2c2c2c;'>".$record->name."</td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Descrizione</th><td style='padding: 2px;color:#2c2c2c;'>".wordwrap(str_replace('"',"'",$record->description), 70, "<br>")."</td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Funz.Responsabile</th><td style='padding: 2px;'><a href='#user/".$record->officer_id."' style='color: #963232 !important; font-weight: bold;'><u>".$record->officer_name."</u></td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Zona</th><td style='padding: 2px;color:#2c2c2c;'>".strip_tags($record->zone_name)."</td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Indirizzo</th><td style='padding: 2px;color:#2c2c2c;'>".wordwrap(str_replace('"',"'",$record->street_name), 70, "<br>")."</td></tr>
                            </table>
                            <br/>
                            <table style='background: #ececec; padding: 10px; width: 100%; border-radius: 2px; border: 1px inset #afafaf;'>
                                <tr>
                                <td align='center' style='color:#2c2c2c;'># Collezioni</td>
                                <td align='center' style='color:#2c2c2c;'># Eventi</td>
                                    <td align='center'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".getCountOIDocs($pdo,$record->id)." Documenti</u></a></td>
                                    <td align='center'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>Anteprima</u></a></td>
                                    <td align='center'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>Mappa</u></a></td>
                                </tr>
                            </table>
                        </div>";
    }

    // PA
    if($record->type=="archaeo_part"){
        $info_tooltip = "<div style='background: white; border-radius: 3px; padding: 10px; width: 100%; border-bottom: 2px inset #afafaf;'>
                            <table>
                                <tr><th align='left' width='150'  style='color:#2c2c2c;'>Codice Partizione</th><td style='padding: 2px;'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->sitar_code)."</u></a></td></tr>
                                <tr><th align='left' width='150'  style='color:#2c2c2c;'>Monumento di Rif.</th><td style='padding: 2px;'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->oi_sitar_code)."</u></a></td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Descrizione</th><td style='padding: 2px;color:#2c2c2c;'>".wordwrap(str_replace('"',"'",$record->description), 70, "<br>")."</td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Funz.Responsabile</th><td style='padding: 2px;'><a href='#user/".$record->officer_id."' style='color: #963232 !important; font-weight: bold;'><u>".$record->officer_name."</u></td></tr>
                                <tr><th align='left' style='color:#2c2c2c;'>Zona</th><td style='padding: 2px;color:#2c2c2c;'>".strip_tags($record->zone_name)."</td></tr>
                            </table>
                            <br/>
                            <table style='background: #ececec; padding: 10px; width: 100%; border-radius: 2px; border: 1px inset #afafaf;'>
                                <tr>
                                <td align='center' style='color:#2c2c2c;'># Collezioni</td>
                                <td align='center' style='color:#2c2c2c;'># Eventi</td>
                                    <td align='center'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".getCountPADocs($pdo,$record->id)." Documenti</u></a></td>
                                    <td align='center'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>Anteprima</u></a></td>
                                    <td align='center'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>Mappa</u></a></td>
                                </tr>
                            </table>
                        </div>";
    }

    // USER
    else if($record->type=="user"){
        $info_tooltip = "<table style='background: white; border-radius: 3px; padding: 10px; width: 100%; border-bottom: 2px inset #afafaf;'>
                            <tr><th align='left' width='150' style='color:#2c2c2c;' >Utente</th><td><a href='#user/".$record->id."' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->to_display)."</u></td></tr>
                        </table>";
    }

    return $info_tooltip;
}




function getCountOIDocs($pdo,$oi_id){
    $statement = $pdo->prepare("
        SELECT count(*)
        FROM st_information_source_document
        WHERE information_source_id = :oi_id
    ");

    $statement->execute(array(
        "oi_id" => $oi_id
    ));

    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    return $result[0]->count;
}

function getCountPADocs($pdo,$pa_id){
    $statement = $pdo->prepare("
        SELECT count(*)
        FROM st_archaeo_part_document
        WHERE archaeo_part_id = :pa_id
    ");

    $statement->execute(array(
        "pa_id" => $pa_id
    ));

    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    return $result[0]->count;
}

