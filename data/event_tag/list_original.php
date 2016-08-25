<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);


$collection_id = $_GET["collection_id"];
$statement = $pdo->prepare("
        SELECT  A.collection_id, A.type, A.target_id,
		  COALESCE(
			  CAST(B.sitar_code as TEXT),
			  CAST(C.id as TEXT),
			  CONCAT(D.last_name,' ',D.first_name)
		  ) as to_display
		
		FROM kms_collection_tag A
		  LEFT JOIN st_information_source B ON (B.id = A.target_id AND A.type like 'information_source')
		  LEFT JOIN st_archaeo_part C ON (C.id = A.target_id AND A.type like 'archaeo_part')
		  LEFT JOIN sf_guard_user D ON (D.id = A.target_id AND A.type like 'user')
		
		WHERE A.collection_id = :collection_id
		ORDER BY A.type,to_display
");


$params = array(
    "collection_id" => $collection_id
);

$statement->execute($params);
$result = $statement->fetchAll(PDO::FETCH_OBJ);

$arrayResult = array();
foreach ($result as $row){
    $row->to_display_complex = getComplexInformation($pdo,$row);;
    array_push($arrayResult,$row);
}

//

echo json_encode(array(
    "success" => true,
	"result" => $result
));


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
function getComplexInformation($pdo,$record){
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
                            <tr><th align='left' width='150' style='color:#2c2c2c;' >Utente</th><td style='padding: 2px;color:#2c2c2c;'>".strip_tags($record->to_display)."</td></tr>
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

