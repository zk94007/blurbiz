 <?php
$path = '?username=user1&password=123QWEqwe&caption=iamworking&file=test.jpg&type=photo';
require("vendor/autoload.php");

// $path = $_SERVER['PATH_INFO'];

$type = $_POST["type"];
$username = $_POST["username"];
$password = $_POST["password"];
$file = $_POST["file"];
$filePath = dirname(__FILE__) . '/downloads/' . basename($file);

// file_put_contents($filePath, fopen($file, 'r'));
downloadFile($file, $filePath);
// $caption = $_POST["caption"];
$caption = 'iamworking';
if ($type == 'video')
{
	uploadVideo($username, $password, $filePath, $caption);
}
else if ($type == 'photo')
{
	uploadPhoto($username, $password, $filePath, $caption);
}
else if ($type == 'auth')
{
	checkAuth($username, $password);
}
else
{
	echo "unknown type";
}
exit();

//

function downloadFile($url, $path)
{
    $newfname = $path;
    $file = fopen ($url, 'rb');
    if ($file) {
        $newf = fopen ($newfname, 'wb');
        if ($newf) {
            while(!feof($file)) {
                fwrite($newf, fread($file, 1024 * 8), 1024 * 8);
            }
        }
    }
    if ($file) {
        fclose($file);
    }
    if ($newf) {
        fclose($newf);
    }
}


function checkAuth($username, $password) {
	$instagram = new \InstagramAPI\Instagram();
	$i = new \InstagramAPI\Instagram($username, $password, false);
	try {
	    $i->login();
	    echo 'ok';
	} catch (Exception $e) {
	    echo $e->getMessage();
	    exit();
	}
}


function uploadVideo($username, $password, $video, $caption) {
	$instagram = new \InstagramAPI\Instagram();
	$i = new \InstagramAPI\Instagram($username, $password, false);
	try {
	    $i->login();
	} catch (Exception $e) {
	    echo $e->getMessage();
	    exit();
	}
	try {
	    $i->uploadVideo($video, $caption);
	    unlink($filePath);
	    echo 'ok';
	} catch (Exception $e) {
	    echo $e->getMessage();
	}
}


function uploadPhoto($username, $password, $photo, $caption) {
	$i = new \InstagramAPI\Instagram($username, $password, false);
	try {
	    $i->login();
	} catch (Exception $e) {
	    echo $e->getMessage();
	    exit();
	}
	try {
	    $i->uploadPhoto($photo, $caption);
	    unlink($filePath);
	    echo 'ok';
	} catch (Exception $e) {
	    echo $e->getMessage();
	}
}
 ?>