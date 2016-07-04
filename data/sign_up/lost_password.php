<?php


header('Content-Type: application/json');

$ini_array = parse_ini_file("../config.ini");

$pdo=new PDO("pgsql:host=".$ini_array['pdo_host'].";port=".$ini_array['pdo_port']."; dbname=".$ini_array['pdo_db'].";",$ini_array['pdo_user'],$ini_array['pdo_psw']);
$mail = $_POST["mail"];


// ottengo id, username e salt dell'utente correlato a quella mail
$statement = $pdo->prepare("
    SELECT id, username, salt
    FROM sf_guard_user
    WHERE email_address ilike :mail
");

$params = array(
    "mail" => trim($mail)
);

$statement->execute($params);
$user = $statement->fetchObject();
$user_id = $user->id;
$username = $user->username;
$salt = $user->salt;

if($user_id != null){
    echo json_encode(array(
        "success" => true,
        "mail_inviata" => inviaMail("sitar_kms@no.reply", $mail, "SITAR - Recupero Password", "E' stata effettuata una richiesta di reset password per l'account <b>".$username."</b> associato a questa mail. E' possibile cambiare la password andando su questo link<br><a href='http://192.168.1.6/Cerini/KMS/#reset_psw/$user_id/$salt'>http://192.168.1.6/Cerini/KMS/#reset_psw/$user_id/$salt</a>")
    ));
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

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