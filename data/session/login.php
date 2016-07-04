<?php

header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");
$conn = pg_connect($ini_array['stringconnect']) or die("Can't connect");

$username = $_POST["username"];
$password = base64_decode(base64_decode(base64_decode($_POST["password"])));

$result = pg_query($conn,"
        SELECT id,username
        FROM sf_guard_user
        WHERE username like '".$username."'
        AND password like encode(digest(concat(salt,'".$password."'), 'sha1'),'hex')
        AND is_active = TRUE
") or die(pg_last_error());



while($row = pg_fetch_object($result)) {
    $user_id = $row->id;
}

//Se non ci sono risultati il login è errato
if(pg_num_rows($result) == 0)
    echo json_encode(
        array(
            'success' => false
        )
    );

//altrimenti ritorno TRUE
else {
    echo json_encode(
        array(
            'success' => true,
            'user_id' => $user_id,
            'username' => $username
        )
    );
}