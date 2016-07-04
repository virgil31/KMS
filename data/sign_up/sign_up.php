<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$data = json_decode($_POST['data'],true);

$first_name = trim($data["first_name"]);
$last_name = trim($data["last_name"]);
$mail =  trim($data["mail"]);
$username =  trim($data["username"]);
$password = trim(base64_decode(base64_decode(base64_decode($data["password"]))));
$ente_id = $data["ente_id"];
$salt = random_str(32);
$password = sha1($salt.$password);

sleep(1.5);

// se lo username già esiste torno errore
if(!isUsernameUnique($pdo,$username)){
    echo json_encode(array(
        "success" => false,
        "error_message" => "<b>Username</b> già in uso da un altro utente!"
    ));
    exit();
}

// se la mail già esiste torno errore
if(!isMailUnique($pdo,$mail)){
    echo json_encode(array(
        "success" => false,
        "error_message" => "<b>Email</b> già in uso da un altro utente!"
    ));
    exit();
}

//altrimenti creo il nuovo utente
$statement = $pdo->prepare("
    INSERT INTO sf_guard_user(first_name,last_name,email_address,username,salt,password,affiliation_id,is_active,created_at,updated_at)
    VALUES(:first_name,:last_name,:email_address,:username,:salt,:password,:affiliation_id,:is_active,NOW(),NOW())
");
$params = array(
    "first_name" => $first_name,
    "last_name" => $last_name,
    "email_address" => $mail,
    "username" => $username,
    "salt" => $salt,
    "password" => $password,
    "affiliation_id" => $ente_id,
    "is_active" => 'F'
);
$statement->execute($params);
$user_id = $pdo->lastInsertId("sf_guard_user_id_seq");

// e lo assegno al gruppo degli utenti autoregistrati (group_id:8)
$statement = $pdo->prepare("
    INSERT INTO sf_guard_user_group(user_id, group_id,created_at,updated_at)
    VALUES(:user_id,:group_id,NOW(),NOW())
");
$params = array(
    "user_id" => $user_id,
    "group_id" => 8
);
$statement->execute($params);

//invio la mail con link di attivazione


echo json_encode(array(
    "success" => true,
    "mail_inviata" => inviaMail("sitar_kms@no.reply", $mail, "SITAR - Registrazione", "Per completare la registrazione si è pregati di cliccare sul seguente link di attivazione:<br><a href='http://192.168.1.6/Cerini/KMS/#activate/$user_id/$salt'>http://192.168.1.6/Cerini/KMS/#activate/$user_id/$salt</a>")
));

////////////////////////////////////////////////////////////////////


function isUsernameUnique($pdo,$username){
    $statement = $pdo->prepare("
        SELECT *
        FROM sf_guard_user
        WHERE username like :username
    ");

    $params = array(
        "username" => $username
    );

    $statement->execute($params);

    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return (count($result) == 0);
}


function isMailUnique($pdo,$mail){
    $statement = $pdo->prepare("
        SELECT *
        FROM sf_guard_user
        WHERE sf_guard_user.email_address like :mail
    ");

    $params = array(
        "mail" => $mail
    );

    $statement->execute($params);

    $result = $statement->fetchAll(PDO::FETCH_OBJ);
    return (count($result) == 0);
}

function random_str($length, $keyspace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
{
    $str = '';
    $max = mb_strlen($keyspace, '8bit') - 1;
    for ($i = 0; $i < $length; ++$i) {
        $str .= $keyspace[rand(0, $max)];
    }
    return $str;
}


function inviaMail($from, $to, $oggetto, $testo){
    require '../../lib/PHPMailer/PHPMailerAutoload.php';
    $ini_array = parse_ini_file("../config.ini");

    $mail = new PHPMailer;

    //$mail->SMTPDebug = 3;

    $mail->isSMTP();
    $mail->Host = $ini_array["smtp_host"];
    $mail->SMTPAuth = false;
    $mail->Port = $ini_array["smtp_port"];

    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );


    $mail->setFrom($from, 'SITAR');
    $mail->addAddress($to);

    $mail->CharSet = 'UTF-8';
    $mail->Subject = $oggetto;
    $mail->Body    = $testo."<br><br><b><i>La presente e-mail è stata generata automaticamente da un indirizzo di posta elettronica di solo invio; si chiede pertanto di non rispondere a tale messaggio.</i></b>";
    //$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->isHTML(true);

    if(!$mail->send())
        return 'Mailer Error: ' . $mail->ErrorInfo;
    else
        return 'Message has been sent';

}
