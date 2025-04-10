/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
var config = {};

var defaultK = {};
defaultK.x1=470;
defaultK.x2=670;
defaultK.x3=880;
defaultK.x4=1090;

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

var numberOfWhiteLabels = 4;
var dtype = "4to1";

function fireButton(btn)
{
  if(remoteState == 0)
  {
    alert("Remote is switched off.")
    return;
  }
  else if(remoteState == 2 && btn < 4)
  {
    alert("Only external Relays allowed.")
    return;
  } else if(isLockedByPTT)
  {
    alert("Switching locked by ptt!");
    return;
  }

  if(btn < 4)
  {
    if(relayArray[btn] == 0)
    {
      for(let b= 0; b < 4; ++b)
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
  for(let a=0; a < 16; a++)
  {

    if(a >= 8)
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
    else
    {
      if(a < 4)
      {
        let elm = document.getElementById("led"+a);

        if(relayArray[a] == 0)
          elm.setAttribute("href", serverip+"green_off.png")
        else
          elm.setAttribute("href", serverip+"green_on.png")
      }
    }
  }
}

function loadDataFromLocalStorage()
{
	loadData("imp_4to1_"+config.myid);
}

function storeLocal()
{
	storeData("imp_4to1_"+config.myid);
}

function deleteLocal()
{
	deleteData("imp_4to1_"+config.myid);
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

  for(let a=1; a < 5; a++)
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

    let newDomain = "http://"+config.Ip+"/I1to88?t=4to1&ptd=http://logic.qro.cz/logic/EasyControl/dominator.php&"+parts[1];

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
