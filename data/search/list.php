<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);



$keywords = $_GET["query"];

$limit = $_GET['limit'];
$start = $_GET['start'];

$ts_query_keywords = str_replace(" ",":* &",$keywords);


$query_user = "
    SELECT id,CONCAT(last_name,' ',first_name) as to_display, 'user' as type, CONCAT(last_name,' ',first_name) as description, '' as sitar_code, '' as name, NULL as officer_id ,
      '' as officer_name, '' as zone_name, '' as street_name,0 as oi_id, 0 as oi_sitar_code
	FROM sf_guard_user

	WHERE first_name ilike '%$keywords%'
	OR last_name ilike '%$keywords%'
	OR CONCAT(first_name,' ',last_name) ilike '%$keywords%'
	OR CONCAT(last_name,' ',first_name) ilike '%$keywords%'";


$query_oi = "
    SELECT *
    FROM (
      SELECT A.id, CONCAT('OI-',A.sitar_code) as to_display,CAST('information_source' as TEXT) as type, 
        ts_headline(COALESCE( NULLIF(A.description,'') , '-' ),to_tsquery('italian','$ts_query_keywords'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as description, 
        CAST(A.sitar_code as TEXT) as sitar_code,
        ts_headline(COALESCE( NULLIF(A.name,'') , '-' ),to_tsquery('italian','$ts_query_keywords'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as name,     
           
        B.id as officer_id,ts_headline(CONCAT(B.last_name,' ',B.first_name),to_tsquery('italian','$ts_query_keywords'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as officer_name,         

        D.name as zone_name, 
        ts_headline(string_agg(F.name,', '),to_tsquery('italian','$ts_query_keywords'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as street_name,
                 
        0 as oi_id, 0 as oi_sitar_code
    
      FROM st_information_source A
        LEFT JOIN sf_guard_user B ON B.id = A.liable_officier
    
        LEFT JOIN st_information_source_st_circoscrizione C ON C.st_information_source_id = A.id
        LEFT JOIN st_circoscrizione D ON D.id = C.st_circoscrizione_id
    
        LEFT JOIN st_italian_address_info_source E ON E.information_source_id = A.id
        LEFT JOIN st_italian_street F ON F.id = E.italian_street_id
        
      GROUP BY A.id,B.id,B.first_name,B.last_name,D.name
    ) tmp
    
    WHERE to_tsvector('italian',description) ||
          to_tsvector('italian',CAST(sitar_code as TEXT))||
          to_tsvector('italian',name) ||
          to_tsvector('italian',officer_name)  ||
          to_tsvector('italian',street_name) @@ to_tsquery('italian','$ts_query_keywords')
";

$query_pa = "
    SELECT *
    FROM (
    
           SELECT A.id, CONCAT('PA-',A.id) as to_display, 'archaeo_part' as type, 
                ts_headline(COALESCE( NULLIF(A.description,'') , '-' ),to_tsquery('italian','manto:* & stradale:* & musco:*'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as description,     
                CAST(A.id as TEXT) as sitar_code, '' as name,
                B.liable_officier as officer_id,
                ts_headline(CONCAT(C.last_name,' ',C.first_name),to_tsquery('italian','manto:* & stradale:* & musco:*'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as officer_name,                         
                ts_headline(E.name,to_tsquery('italian','manto:* & stradale:* & musco:*'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as zone_name, 
                '' as street_name,
                B.id as oi_id, B.sitar_code as oi_sitar_code
    
           FROM st_archaeo_part A
             LEFT JOIN st_information_source B ON B.id = A.information_source_id
             LEFT JOIN sf_guard_user C ON C.id = B.liable_officier
    
    
             LEFT JOIN st_information_source_st_circoscrizione D ON D.st_information_source_id = B.id
             LEFT JOIN st_circoscrizione E ON E.id = D.st_circoscrizione_id
    )tmp
    WHERE to_tsvector('italian',description) ||
          to_tsvector('italian',officer_name)  ||
          to_tsvector('italian',zone_name) @@ to_tsquery('italian','$ts_query_keywords')
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

    //$row->description = strip_tags($row->description);
    //$row->description = str_ireplace($keywords,"<mark>".$keywords."</mark>",$row->description);//sottolineo le parole cercate con un semplice <mark>

    $row->tooltip = getTooltipInformation($pdo,$row);
    //$row->tooltip = str_ireplace($keywords,"<mark>".$keywords."</mark>",$row->tooltip);//sottolineo le parole cercate con un semplice <mark>

    array_push($arrayResult,$row);
}

//se non ci sono stati risultati ritorno un record
if(count($arrayResult) == 0){
    array_push($arrayResult,array(
        "tooltip" => '<img src="http://www.japanwanted.com/images/noresult.jpg" alt="Mountain View" style="width:100%;height:228px;">'
    ));
}



echo json_encode(array(
	"result" => $arrayResult,
    "total" => $total_count,
    "eventual_error" => $pdo->errorInfo()
));

////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getTooltipInformation($pdo,$record){
    $info_tooltip = "";

    // OI
    if($record->type=="information_source"){
        $info_tooltip = "<div style='background: white; border-radius: 3px; padding: 10px; width: 100%; border-bottom: 2px inset #afafaf;'>
                            <table>
                                <tr><th align='left' width='150' >Codice Monumento</th><td style='padding: 2px;'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->sitar_code)."</u></a></td></tr>
                                <tr><th align='left'>Nome</th><td style='padding: 2px;'>".$record->name."</td></tr>
                                <tr><th align='left'>Descrizione</th><td style='padding: 2px;'>".wordwrap(str_replace('"',"'",$record->description), 70, "<br>")."</td></tr>
                                <tr><th align='left'>Funz.Responsabile</th><td style='padding: 2px;'><a href='#user/".$record->officer_id."' style='color: #963232 !important; font-weight: bold;'><u>".$record->officer_name."</u></td></tr>
                                <tr><th align='left'>Zona</th><td style='padding: 2px;'>".strip_tags($record->zone_name)."</td></tr>
                                <tr><th align='left'>Indirizzo</th><td style='padding: 2px;'>".wordwrap(str_replace('"',"'",$record->street_name), 70, "<br>")."</td></tr>
                            </table>
                            <br/>
                            <table style='background: #ececec; padding: 10px; width: 100%; border-radius: 2px; border: 1px inset #afafaf;'>
                                <tr>
                                <td align='center'># Collezioni</td>
                                <td align='center'># Eventi</td>
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
                                <tr><th align='left' width='150' >Codice PA</th><td style='padding: 2px;'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->sitar_code)."</u></a></td></tr>
                                <tr><th align='left' width='150' >Monumento di Rif.</th><td style='padding: 2px;'><a href='#' style='color: #963232 !important; font-weight: bold;'><u>".strip_tags($record->oi_sitar_code)."</u></a></td></tr>
                                <tr><th align='left'>Descrizione</th><td style='padding: 2px;'>".wordwrap(str_replace('"',"'",$record->description), 70, "<br>")."</td></tr>
                                <tr><th align='left'>Funz.Responsabile</th><td style='padding: 2px;'><a href='#user/".$record->officer_id."' style='color: #963232 !important; font-weight: bold;'><u>".$record->officer_name."</u></td></tr>
                                <tr><th align='left'>Zona</th><td style='padding: 2px;'>".strip_tags($record->zone_name)."</td></tr>
                            </table>
                            <br/>
                            <table style='background: #ececec; padding: 10px; width: 100%; border-radius: 2px; border: 1px inset #afafaf;'>
                                <tr>
                                <td align='center'># Collezioni</td>
                                <td align='center'># Eventi</td>
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
                            <tr><th align='left' width='150' >Utente</th><td style='padding: 2px;'>".strip_tags($record->to_display)."</td></tr>
                        </table>";
    }

    return $info_tooltip;
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////


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

function getCountPADocs($pdo,$oi_id){
    $statement = $pdo->prepare("
        SELECT count(*)
        FROM st_archaeo_part_document
        WHERE archaeo_part_id = :oi_id
    ");

    $statement->execute(array(
        "oi_id" => $oi_id
    ));

    $result = $statement->fetchAll(PDO::FETCH_OBJ);

    return $result[0]->count;
}










/*



SELECT *
    FROM (
      SELECT A.id, CONCAT('OI-',A.sitar_code) as to_display,CAST('information_source' as TEXT) as type,
        ts_headline(A.description,to_tsquery('italian','$ts_query_keywords'),'StartSel=<mark>,StopSel=</mark>,HighlightAll=TRUE') as description,
        CAST(A.sitar_code as TEXT) as sitar_code,COALESCE( NULLIF(A.name,'') , '-' ) as name,
        CONCAT(B.first_name,' ',B.last_name) as officer_name, D.name as zone_name, string_agg(F.name,', ') as street_name

      FROM st_information_source A
        LEFT JOIN sf_guard_user B ON B.id = A.liable_officier

        LEFT JOIN st_information_source_st_circoscrizione C ON C.st_information_source_id = A.id
        LEFT JOIN st_circoscrizione D ON D.id = C.st_circoscrizione_id

        LEFT JOIN st_italian_address_info_source E ON E.information_source_id = A.id
        LEFT JOIN st_italian_street F ON F.id = E.italian_street_id

      GROUP BY A.id,B.first_name,B.last_name,D.name
    ) tmp

    WHERE to_tsvector('italian',description) ||
          to_tsvector('italian',CAST(sitar_code as TEXT))||
          to_tsvector('italian',name) ||
          to_tsvector('italian',officer_name)  ||
          to_tsvector('italian',street_name) @@ to_tsquery('italian','$ts_query_keywords')





$query_pa = "
    SELECT *
    FROM (

           SELECT A.id, CONCAT('PA-',A.id) as to_display, 'archaeo_part' as type, A.description, A.id as sitar_code, '' as name,
                        B.liable_officier as officer_id,CONCAT(C.last_name,' ',C.first_name) as officer_name, E.name as zone_name, '' as street_name,
                        B.id as oi_id, B.sitar_code as oi_sitar_code

           FROM st_archaeo_part A
             LEFT JOIN st_information_source B ON B.id = A.information_source_id
             LEFT JOIN sf_guard_user C ON C.id = B.liable_officier


             LEFT JOIN st_information_source_st_circoscrizione D ON D.st_information_source_id = B.id
             LEFT JOIN st_circoscrizione E ON E.id = D.st_circoscrizione_id
    )tmp
    WHERE to_tsvector('italian',description) ||
          to_tsvector('italian',officer_name)  ||
          to_tsvector('italian',zone_name) @@ to_tsquery('italian','$ts_query_keywords')
";

*/