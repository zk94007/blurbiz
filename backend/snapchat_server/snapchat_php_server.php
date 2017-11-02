<?php

try {
    require("src/autoload.php");

    $type = $_POST["type"];
    $username = $_POST["username"];
    $password = $_POST["password"];
    $auth_token = $_POST["auth_token"];

    $casper = new \Casper\Developer\CasperDeveloperAPI("4e315929110b4e0854485f3925ed9c7b", "c60ff5425cd04b7fc6a894272904a505");
    $snapchat = new \Snapchat\Snapchat($casper);

    if ($type == 'auth') 
    {
        checkAuth($username, $password, $snapchat);
    }

    //Login
    $snapchat->initWithAuthToken($username, $auth_token);
    $file = $_POST["file"];
    $filePath = dirname(__FILE__) . '/downloads/' . basename($file);
    downloadFile($file, $filePath);

    if ($type == 'video')
    {
        $snapchat->uploadVideo($filePath);
    }
    else if ($type == 'photo')
    {
        $snapchat->uploadPhoto($filePath);
    }

    unlink($filePath);

    echo json_encode(array(
        'status' => 200
    ));
} catch(Exception $e){

    //Something went wrong...
    echo json_encode(
        array('status' => 404, 'error' => $e->getMessage())
    );
}

exit();

function checkAuth($username, $password, $snapchat) {
    try {
        $login = $snapchat->login($username, $password);
        if($login)
        {
            $authToken = $snapchat->getAuthToken();
            echo json_encode(array(
                'status' => 200,
                'auth_token' => $authToken
            ));    
        }
        else {
            echo json_encode(array(
                'status' => 406,
            ));    
        }
        
    } catch (Exception $e) {
        echo json_encode(
            array('status' => 405, 'error' => $e->getMessage())
        );
    }
    exit();
}