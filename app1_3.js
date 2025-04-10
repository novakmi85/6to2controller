/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
var config = {};

var defaultK = {};
defaultK.x1=470;
defaultK.x2=670;
defaultK.x3=880;

var isExtRelVisible = false;
var isConfigVisible = false;
var isLockedByPTT = false;
var useUrlParams = true;
var useShortCuts = true;

var relayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var statusValue = 0; // not used yet
var remoteState = 0; // 0 remote off, 1 all, 2 only externals

var client;
var getInterval;

var numberOfWhiteLabels = 3;
var dtype = "1-3";

function fireButton(btn)
{
  if(remoteState == 0)
  {
    alert("Remote is switched off.")
    return;
  }
  else if(remoteState == 2 && btn < 7)
  {
    alert("Only external Relays allowed.")
    return;
  } else if(isLockedByPTT)
  {
    alert("Switching locked by ptt!");
    return;
  }

  if(btn < 8)
  {
    if(relayArray[btn] == 0)
    {
      for(let b= 0; b < 7; ++b)
        relayArray[b] = 0;

      relayArray[btn]= 1;    
    }
    else
      relayArray[btn]= 0;    
  }
  else
    relayArray[btn] = !relayArray[btn];

  // fire ui update command and update only if success
  /*
    S/<banknr>/<value>
    s/<banknr>/<pin>/<0/1>
    G/ => GetStatus
  */
  statusValue = GetValueByOrderedArray(relayArray);
  let localV = [0,0];

  localV[1] = statusValue;
  client.SendToClient("S", localV);

  // fire UI update
  updateUI();
}

function updateUI()
{
  for(let a=8; a < 16; a++)
  {
      let elm = document.getElementById("btn"+a);

      if(relayArray[a] == 0)
      {
        elm.className = "xxButton";
      }
      else
      {
        elm.className = "xxButton xxButtonGreen";
      }
  }

  // check to see if new
  let local = GetValueByOrderedArray(relayArray.slice(0,8));

  switch(local)
  {
    case 0:
      for(let b=0; b < 3; b++ )
        document.getElementById("led"+b).setAttribute("href", serverip+"green_off.png");
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href', serverip+'1_3_top_hover.png');      
      document.getElementById("btn09").setAttribute('href', serverip+'1_3_mid_hover.png');      
      document.getElementById("btn00").setAttribute('href', serverip+'1_3_bot_hover.png');
      break;
    case 1:
      document.getElementById("led0").setAttribute("href", serverip+"green_on.png");
      document.getElementById("led1").setAttribute("href", serverip+"green_off.png");
      document.getElementById("led2").setAttribute("href", serverip+"green_off.png");  
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_on.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_hover.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_hover.png');
      break;
    case 2:
      document.getElementById("led0").setAttribute("href", serverip+"green_off.png");
      document.getElementById("led1").setAttribute("href", serverip+"green_on.png");
      document.getElementById("led2").setAttribute("href", serverip+"green_off.png");  
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_hover.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_on.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_hover.png');
      break;
    case 4:
      document.getElementById("led0").setAttribute("href", serverip+"green_off.png");
      document.getElementById("led1").setAttribute("href", serverip+"green_off.png");
      document.getElementById("led2").setAttribute("href", serverip+"green_on.png");  
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_hover.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_hover.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_on.png');
      break;
    case 16:
      document.getElementById("led0").setAttribute("href", serverip+"green_on.png");
      document.getElementById("led1").setAttribute("href", serverip+"green_on.png");
      document.getElementById("led2").setAttribute("href", serverip+"green_off.png");
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_on.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_on.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_on.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_hover.png');
      break;
    case 64:
      document.getElementById("led0").setAttribute("href", serverip+"green_on.png");
      document.getElementById("led1").setAttribute("href", serverip+"green_off.png");
      document.getElementById("led2").setAttribute("href", serverip+"green_on.png");
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_on.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_on.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_hover.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_on.png');
      break;
    case 32:
      document.getElementById("led0").setAttribute("href", serverip+"green_off.png");
      document.getElementById("led1").setAttribute("href", serverip+"green_on.png");
      document.getElementById("led2").setAttribute("href", serverip+"green_on.png");
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_hover.png');      
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_on.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_hover.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_on.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_on.png');
      break;  
    case 8:
      for(let b=0; b < 3; b++ )
        document.getElementById("led"+b).setAttribute("href", serverip+"green_on.png");
      document.getElementById("btn4").setAttribute('href', serverip+'1_3_all_on.png');     
      document.getElementById("btn5").setAttribute('href', serverip+'1_3_top_mid_hover.png');      
      document.getElementById("btn6").setAttribute('href', serverip+'1_3_top_bot_hover.png');      
      document.getElementById("btn7").setAttribute('href', serverip+'1_3_mid_bot_hover.png');
      document.getElementById("btn08").setAttribute('href',serverip+'1_3_top_on.png');      
      document.getElementById("btn09").setAttribute('href',serverip+'1_3_mid_on.png');      
      document.getElementById("btn00").setAttribute('href',serverip+'1_3_bot_on.png');
      break;
  }
}

function loadDataFromLocalStorage()
{
	loadData("imp_1_3_"+config.myid);
}

function storeLocal()
{
	storeData("imp_1_3_"+config.myid);
}

function deleteLocal()
{
	deleteData("imp_1_3_"+config.myid);
}

function init()
{
  // order matters!!!
  if(typeof serverip === "undefined")
    serverip = "";
  
  // order matters!!!
  getParamsFromUrl();
  //loadDataFromLocalStorage();
  setConfigParameters();

  if(useShortCuts==1)
    addKeyEventListener();

  // switch on Remote default
  toggleRemote();

  for(let a=1; a < 4; a++)
  {
    let elm = document.getElementById("btn"+a);
    let elmInput = document.getElementById("label"+a);
    let elmOff = document.getElementById("off"+a);
    elmInput.value = elm.textContent;
    elmOff.value = parseInt(eval("config.Offset"+a));
  }

  for(let b=8; b < 16; b++)
  {
    let elm = document.getElementById("btn"+b);
    let elmInput = document.getElementById("label"+b);
    elmInput.value = elm.childNodes[0].innerHTML;
  }

  let elmFs = document.getElementById("fs");
  elmFs.value = config.FontSize; 

  let elmIp = document.getElementById("deviceIp");
  elmIp.value = config.Ip; 

  let elmId = document.getElementById("myid");
  elmId.value = config.myid; 

  let elmCol = document.getElementById("fcol");
  elmCol.value = config.FillColor; 

  if(config.SocketTimeout!=2000)
    document.getElementById("socketTimeout").value = config.SocketTimeout; 

  if(config.ForceHttp == 1)
    document.getElementById("forceHttp").checked = true;

  if(config.ForceHttp == 1 && (navigator.userAgent.indexOf("Chrome") != -1 && window.location.href.indexOf("dominator") == -1))
  {    
    console.log("Chrome redirection started");
    generateLink();

    let daLink = document.getElementById("genLink").value;
    let parts = daLink.split("?");

    let newDomain = "http://"+config.Ip+"/I1to88?t=1_3&ptd=http://logic.qro.cz/logic/EasyControl/dominator.php&"+parts[1];

    window.open(newDomain, '_parent');
  }
  else
  {  
    if(config.ForceHttp == 1)
      client = new HttpClient();
    else
      client = new WebClient(config.SocketTimeout);
  }  
  
  let elmDeviceName = document.getElementById("devicename");
  elmDeviceName.textContent = config.myid;
}
