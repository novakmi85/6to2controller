/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
var config = {};

var defaultK = {};
defaultK.x1=470;
defaultK.x2=670;
defaultK.x3=880;
defaultK.x4=1090;

var relayArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var relayArrayTX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var statusValue = 0; // not used yet
var statusValueTX = 0; // not used yet
var isTXMode = 0;

var isConfigVisible = false;
var isLockedByPTT = false;
var useUrlParams = true;
var useShortCuts = true;

var client;
var getInterval;

var numberOfWhiteLabels = 4;
var dtype = "mb";

function fireButton(btn)
{

  // statusValue = GetValueByOrderedArray(relayArray);
  let localV = [0,0];

  if(isTXMode)
    localV[0] = 1;

  localV[1] = btn;
  client.SendToClient("S", localV);

  // fire UI update
  updateUI();
}

function fireMode()
{
  let localV = [1,""];

  if(isTXMode)
    localV[0] = 0;

  client.SendToClient("T", "");
}

function updateUI()
{
  let arry;
  
  if(isTXMode)
  {
    if(config.deviceMode==0)
      arry  = relayArrayTX;
    else if(config.deviceMode==1)
      arry = mbrmap(statusValueTX);
    else if(config.deviceMode==2)
      arry = mbsjmap(statusValueTX);
    else if(config.deviceMode==3)
      arry = sm2map(statusValueTX);
  }
  else
  {
    if(config.deviceMode==0)
      arry  = relayArray;
    else if(config.deviceMode==1)
      arry = mbrmap(statusValue);
    else if(config.deviceMode==2)
      arry = mbsjmap(statusValue);
    else if(config.deviceMode==3)
      arry = sm2map(statusValue);
  }

  // check 3 main buttons
  for(let a=0; a < 3; a++)
  {
      let elm = document.getElementById("led"+a);

      if(arry[a] == 0)
        elm.setAttribute("href", serverip+"ringoff.png")
      else
        elm.setAttribute("href", serverip+"ringgreen.png")
  }

  //check rxtxmode
  let elm = document.getElementById("ledMode");
  let allonValue;

  if(isTXMode == 0)
  {
    elm.setAttribute("href", serverip+"ringoff.png")
    allonValue = statusValue;
  }
  else
  {
    elm.setAttribute("href", serverip+"ringgreen.png")
    allonValue = statusValueTX;
  }
  
  //check master all
  let elmall = document.getElementById("led3");

  if(config.deviceMode==0 && allonValue==15)
    elmall.setAttribute("href", serverip+"ringgreen.png")
  else if(config.deviceMode==1 && allonValue==0)
    elmall.setAttribute("href", serverip+"ringgreen.png")
  else if(config.deviceMode==2 && allonValue==0)
    elmall.setAttribute("href", serverip+"ringgreen.png")
  else if(config.deviceMode==3 && allonValue==15)
    elmall.setAttribute("href", serverip+"ringgreen.png")
  else
    elmall.setAttribute("href", serverip+"ringoff.png")
  
  updateLCD();
}

function updateLCD()
{
  let txtrx = document.getElementById("line0");
  let txttx = document.getElementById("line1");

  let pfrx;
  let pftx;

  let RXLine;
  let TXLine;

  if(isTXMode)
  {
    pftx = "> TX: ";
    pfrx = "RX: "
  }
  else
  {
    pftx = "TX: ";
    pfrx = "> RX: "
  }

  let assignedMB;
  
  if(config.deviceMode==0)
    assignedMB = deviceTypeAssignMB;
  else if(config.deviceMode==1)
    assignedMB = deviceTypeAssignMBR;
  else if(config.deviceMode==2)
    assignedMB = deviceTypeAssignMBSJ;
  else if(config.deviceMode==3)
    assignedMB = deviceTypeAssignSM2;

  RXLine = pfrx;
  for(let a=0; a < assignedMB["v"+statusValue].length; a++)
  {
    let btnnum = parseInt(assignedMB["v"+statusValue][a])+1;
    let elm = document.getElementById("btn"+btnnum);
    RXLine += elm.innerHTML;
    
    if(a+1 < assignedMB["v"+statusValue].length)
        RXLine+= "+";
  }

  TXLine = pftx;
  for(let a=0; a < assignedMB["v"+statusValueTX].length; a++)
  {
    let btnnum = parseInt(assignedMB["v"+statusValueTX][a])+1;
    let elm = document.getElementById("btn"+btnnum);
    TXLine += elm.innerHTML;
    
    if(a+1 < assignedMB["v"+statusValueTX].length)
        TXLine+= " + ";
  }
  
  txtrx.innerHTML  = RXLine;
  txttx.innerHTML  = TXLine;
  
}

function loadDataFromLocalStorage()
{
	loadData("imp_mb_"+config.myid);
}

function storeLocal()
{
	storeData("imp_mb_"+config.myid);
}

function deleteLocal()
{
	deleteData("imp_bm_"+config.myid);
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
  //xx toggleRemote();

  for(let a=1; a < 5; a++)
  {
    let elm = document.getElementById("btn"+a);
    let elmInput = document.getElementById("label"+a);
    let elmOff = document.getElementById("off"+a);
    elmInput.value = elm.textContent;
    elmOff.value = parseInt(eval("config.Offset"+a));
  }

  // for(let b=8; b < 16; b++)
  // {
  //   let elm = document.getElementById("btn"+b);
  //   let elmInput = document.getElementById("label"+b);
  //   elmInput.value = elm.childNodes[0].innerHTML;
  // }

  let elmFs = document.getElementById("fs");
  elmFs.value = config.FontSize; 

  let elmIp = document.getElementById("deviceIp");
  elmIp.value = config.Ip; 

  let elmId = document.getElementById("myid");
  elmId.value = config.myid; 

  let elmCol = document.getElementById("fcol");
  elmCol.value = config.FillColor; 

  if(document.getElementsByName("cmode") != undefined)
  {
      switch(config.deviceMode)
      {
        case "0":
          document.getElementById("mb").checked = true;
          break;
        case "1":
          document.getElementById("rmb").checked = true;
          break;
        case "2":
          document.getElementById("sj2w").checked = true;
          break;
        case "3":
          document.getElementById("sm2").checked = true;
          break;   
      }
  }
  
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
