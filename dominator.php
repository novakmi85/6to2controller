<?php
header('Content-Type: application/javascript');
$typeparam = $_GET['t'];

if($typeparam == '6by2')
{
echo "var JS = ['coloris.js','app6by2.js','reconnecting-websocket.min.js','WebSocketClient.js','WebSocketClient6by2.js','Helper.js','ShortCuts.js','ParamToggleHandlers6by2.js','storageHelper.js','configHelper6by2.js']; ";
}
else if($typeparam == '1_2')
{
echo "var JS = ['coloris.js','app1_2.js','reconnecting-websocket.min.js','WebSocketClient.js','Helper.js','ShortCuts.js','ParamToggleHandlers.js','storageHelper.js','configHelper.js']; ";
}
else if($typeparam == '1_3')
{
echo "var JS = ['coloris.js','app1_3.js','reconnecting-websocket.min.js','WebSocketClient.js','Helper.js','ShortCuts.js','ParamToggleHandler.js','storageHelper.js','configHelper.js']; ";
}
else if($typeparam == '4to1')
{
echo "var JS = ['coloris.js','app4to1.js','reconnecting-websocket.min.js','WebSocketClient.js','Helper.js','ShortCuts.js','ParamToggleHandlers.js','storageHelper.js','configHelper.js']; ";
}
else if($typeparam == '6to1')
{
echo "var JS = ['coloris.js','app6to1.js','reconnecting-websocket.min.js','WebSocketClient.js','Helper.js','ShortCuts.js','ParamToggleHandlers.js','storageHelper.js','configHelper.js']; ";
}

echo "\nvar CSS = ['coloris.css','style.css'];";

$protocol = ((!empty($_SERVER['HTTPS'])&&$_SERVER['HTTPS']!='off')||$_SERVER['SERVER_PORT']==443)? "https://":"http://";

$idx = strrpos($_SERVER['REQUEST_URI'], "/");
$resi = $_SERVER['REQUEST_URI'];

if($idx != false)
    $resi = substr($_SERVER['REQUEST_URI'], 0, $idx); 

$serverip = $protocol.$_SERVER['HTTP_HOST'].$resi;

echo "let serverip = \"".$serverip."\"";
?>

for(let a=0; a < CSS.length; a++)
{
    const ll = document.createElement('link');
    ll.setAttribute("rel", "stylesheet");
    ll.setAttribute("href", "<?php echo $serverip ?>/"+CSS[a]);
    document.head.appendChild(ll);
}

const loadScript = function (url) {
    return new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src = "<?php echo $serverip ?>/"+url;
        script.addEventListener('load', function () { resolve(true);});
        document.head.appendChild(script);
    });
};

const waterfall = function (promises) {return promises.reduce(function (p, c) { return p.then(function () { return c.then(function (result) { return true;});});},Promise.resolve([]));};

function get_url_param( name )
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    return urlParams.get(name);
}

const loadScripts = () => { const promises = JS.map(function (url) { return loadScript(url);}); return waterfall(promises);};

<?php  echo "\nserverip = \"".$serverip."/\";"; ?>

loadScripts().then( () => {
    window.onload = () => { let xx = document.getElementById('controller');

<?php

if($typeparam == '6by2')
{
    $content =  file_get_contents("index6by2.html");
}
else if($typeparam == '1_2')
{
    $content =  file_get_contents("index1_2.html");
}
else if($typeparam == '1_3')
{
    $content =  file_get_contents("index1_3.html");
}
else if($typeparam == '4to1')
{
    $content =  file_get_contents("index4to1.html");
}
else if($typeparam == '6to1')
{
    $content =  file_get_contents("index6to1.html");
}

$pathcor = str_replace("xlink:href=\"","xlink:href=\"".$serverip."/", $content); 

$arc = (explode("<!--S-->", $pathcor))[1];
$result = str_replace(array("  ","\r", "\n"), "", $arc);

echo "xx.innerHTML='".$result."'";
?> 
init();}
});