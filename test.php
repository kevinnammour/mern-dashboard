<?php
require _DIR_ . '/../db/config.inc.php';
include "Allow.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $params = json_decode(file_get_contents("php://input"));

    $firstname = $params->firstname;
    $lastname = $params->lastname;
    $dateofbirth = $params->dateofbirth;
    $gender = $params->gender;
    $email = $params->email;
    $password = $params->password;
    $needle = "@uni.com";

    if (str_ends_with($email, $needle)) {
        // this means this user is a counsellor

        $field = $params->field;
        $experience = $params->experience;
        // $field = $_POST["field"];
        // $experience = $_POST["experience"];

        $hash = password_hash($password, PASSWORD_BCRYPT, array('cost' => 11));
        $query = $mysqli->prepare("INSERT INTO counsellors (first_name, last_name, gender, email, password, field, experience) VALUES (?, ?, ?, ?, ?, ? ,?)");
        $query->bind_param("sssssss", $firstname, $lastname, $gender, $email, $hash, $field, $experience);
    } else {
        // this means this is a student
        echo json_encode(array('sd' => 'student'));
        $hash = password_hash($password, PASSWORD_BCRYPT, array('cost' => 11));
        $query = $mysqli->prepare("INSERT INTO students (first_name, last_name, date_of_birth, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssss", $firstname, $lastname, $dateofbirth, $gender, $email, $hash);
    }
    //hashing password for security
    //  $hash = password_hash($password, PASSWORD_BCRYPT, array('cost' => 11));
    //  $query = $mysqli->prepare("INSERT INTO students (first_name, last_name, date_of_birth, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)");
    //  $query->bind_param("ssssss", $firstname, $lastname, $dateofbirth, $gender, $email, $hash);

    if (!empty($firstname) && !empty($lastname) && !empty($dateofbirth) && !empty($gender) && !empty($email) && !empty($hash) && strpos($email, '@')) //making sure all fields are there and email contains @ {

    try {
        $query->execute();

    } catch (mysqli_sql_exception) { //make sure we do not have duplicate emails, as in same student with different accounts
        $response = [];
        $response["status"] = "409";
        $json_response = json_encode($response);
        echo $json_response;
        return;
    }
    $response = [];

    $response["status"] = "200";
    $json_response = json_encode($response);
    echo $json_response;
} else {
    $response["status"] = "400";
}
?>
