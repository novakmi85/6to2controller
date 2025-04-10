/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
var config = {};

var defaultK = {};
defaultK.x1=60;
defaultK.x2=215;
defaultK.x3=370;
defaultK.x4=525;
defaultK.x5=685;
defaultK.x6=840;

var isExtRelVisible = false;
var isConfigVisible = false;
var isLockedByPTT1 = false;
var isLockedByPTT2 = false;
var useUrlParams = true;
var useShortCuts = true;

var relayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var statusValue = 0; // not used yet
var remoteState = 1; // 0 remote off, 1 all, 2 only externals

var client;
var getInterval;

var numberOfWhiteLabels = 6;
var dtype = "6by2";

function emptyPinsOfRadio(radioNr)
{
    if(radioNr == 1)
    {
        for(let a=0; a < 8; a++)
            relayArray[a] = 0;
    }
    else
    {
        for(let a=8; a < 15; a++)
            relayArray[a] = 0;
    }
}


function fireButton(radioNr, btn)
{
  if(radioNr ==1)
  {
    if(isLockedByPTT1)
    {
        alert("Switching locked by ptt1!");
        return;
    }        
  }
  else
  {
    if(isLockedByPTT2)
    {
        alert("Switching locked by ptt2!");
        return;
    }        
  }
  
  emptyPinsOfRadio(radioNr);

  if(radioNr == 1)
  {
    relayArray[btn] = 1;
  }
  else
  {
    relayArray[btn+8] = 1;
  }

  statusValue = GetValueByOrderedArray(relayArray);
  let localV = [0,0,0];

  localV[1] = statusValue;
  localV[2] = radioNr;
  client.SendToClient("X", localV);

  updateUI();
}

function updateUI()
{
  for(let a=0; a < 15 ; a++)
  {
    let elm = document.getElementById("led"+a);

    if(a!= 6 && a!=7 && a!=14)
    {
        if(relayArray[a] == 0)
          elm.setAttribute("href", serverip+"ringoff.png");
        else 
        {
            if(a < 6)
                elm.setAttribute("href", serverip+"ringgreen.png");
            else if(a < 14)
                elm.setAttribute("href", serverip+"ringorange.png");
        }
    }
    else if(a==6 || a==14)
    {
        if(relayArray[a] == 1)
          elm.setAttribute("href", serverip+"orange_on.png")
        else
          elm.setAttribute("href", serverip+"orange_off.png")
    }
  }
}

function loadDataFromLocalStorage()
{
	loadData("imp_6by2_"+config.myid);
}

function storeLocal()
{
	storeData("imp_6by2_"+config.myid);
}

function deleteLocal()
{
	deleteData("imp_6by2_"+config.myid);
}

function init()
{
  // order matters!!!
  if(typeof serverip === "undefined")
    serverip = "";

  // order matters!!!
  getParamsFromUrl();
  loadDataFromLocalStorage();
  setConfigParameters();
  
  if(useShortCuts==1)
    addKeyEventListener();

  for(let a=1; a < 7; a++)
  {
    let elm = document.getElementById("btn"+a);
    let elmInput = document.getElementById("label"+a);
    let elmOff = document.getElementById("off"+a);
    elmInput.value = elm.textContent;
    elmOff.value = parseInt(eval("config.Offset"+a));
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

    let newDomain = "http://"+config.Ip+"/I1to88?t=6by2&ptd=http://logic.qro.cz/logic/EasyControl/dominator.php&"+parts[1];

    window.open(newDomain, '_parent');
  }
  else
  {  
    if(config.ForceHttp == 1)
      client = new HttpClient();
    else
      client = new WebClient6by2(config.SocketTimeout);
  }  
  

  let elmDeviceName = document.getElementById("devicename");
  elmDeviceName.textContent = config.myid;

  // if (!!window.EventSource) {
  //   var source =new EventSource("http://"+config.Ip+"/xxevents");
    
  //   source.addEventListener('open', function(e) {
  //    console.log("Events Connected");
  //   }, false);
  
  //   source.addEventListener('PTT2', function(e) {
  //     handlePTT(JSON.parse(e.data));
  //   }, false); 
  
  //   source.addEventListener('PTT1', function(e) {
  //     handlePTT(JSON.parse(e.data));
  //   }, false); 
  // }
  
}
