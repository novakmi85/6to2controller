/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
//************************************************** Parameters ***************************************************************
//*****************************************************************************************************************************

let RequestParams = {};

function paramsToObject(entries) {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

function getUrlParam(parameter, defaultvalue){
    const queryString = window.location.search;
    console.log(queryString);

    if(JSON.stringify(RequestParams) === '{}')
    {
      let reqp = new URLSearchParams(queryString);    
      RequestParams = paramsToObject(reqp);
    }

    if(RequestParams[parameter])
      return RequestParams[parameter];
    else
      return defaultvalue;
}

function getParamsFromUrl()
{
  config.myid = getUrlParam("id", "qro.cz"); 
  config.Ip = getUrlParam("ip", "192.168.0.0"); 
  config.FontSize = getUrlParam("fons", 30); 
  config.FillColor = getUrlParam("col", "green"); 
  config.Label1 = getUrlParam("l1", "Ant 1");
  config.Label2 = getUrlParam("l2", "Ant 2");
  
  if(dtype != "1-2")
    config.Label3 = getUrlParam("l3", "Ant 3");
  
  if(dtype == "4to1" || dtype == "6to1")
  {
    config.Label4 = getUrlParam("l4", "Ant 2");
    config.Offset4 = getUrlParam("o4", 10);
	
    if(dtype == "6to1")
    {
      config.Label5 = getUrlParam("l5", "Ant 3");
      config.Label6 = getUrlParam("l6", "Ant 3");
      config.Offset5 = getUrlParam("o5", 10);
      config.Offset6 = getUrlParam("o6", 10);
    }
  }
  
  config.Label8 = getUrlParam("l8", "Ant 8");
  config.Label9 = getUrlParam("l9", "Ant 9");
  config.Label10 = getUrlParam("l10", "Ant 10");
  config.Label11 = getUrlParam("l11", "Ant 11");
  config.Label12 = getUrlParam("l12", "Ant 12");
  config.Label13 = getUrlParam("l13", "Ant 13");
  config.Label14 = getUrlParam("l14", "Ant 14");
  config.Label15 = getUrlParam("l15", "Ant 15");

  config.Offset1 = getUrlParam("o1", 10);
  config.Offset2 = getUrlParam("o2", 10);

  if(dtype != "1-2")
    config.Offset3 = getUrlParam("o3", 10);
										 
  useShortCuts = getUrlParam("usc", 1);
  config.SocketTimeout = getUrlParam("st", 2000);
  config.ForceHttp = getUrlParam("fhttp", 0);
}

function setConfigParameters()
{
  for(let a=1; a < numberOfWhiteLabels+1; a++)
  {
    let elm = document.getElementById("btn"+a);
    elm.textContent = eval("config.Label"+a); 
    elm.setAttribute('x', parseInt(elm.getAttribute('x')) + parseInt(eval("config.Offset"+a)));
    elm.setAttribute("font-size", parseInt(config.FontSize));
    elm.setAttribute("fill", config.FillColor);
  }  

  for(let b=8; b < 16; b++)
  {
    let elm = document.getElementById("btn"+b);
    elm.innerHTML =  "<div class='divTableCell'>"+eval("config.Label"+b)+"</div>";
  }

  let elmDeviceName = document.getElementById("devicename");
  elmDeviceName.textContent = config.myid;
}



//************************************************** Togglers *****************************************************************
//*****************************************************************************************************************************

function toggleRemote()
{
  let elm = document.getElementById("ledRemote");

  switch(remoteState)
  {
    case 0:
      remoteState = 1;
      elm.setAttribute("href", serverip+"green_on.png");
      break;
    case 1:
      remoteState = 2;
      unsetFirst8Relay();
      elm.setAttribute("href", serverip+"orange_on.png");
      break;
    case 2:
      remoteState = 0;
      unsetFirst8Relay();
      elm.setAttribute("href", serverip+"orange_off.png");
      break;
  }
}

function unsetFirst8Relay()
{
  for(let a=0; a < 8; a++)
    relayArray[a] = 0;

  statusValue = GetValueByOrderedArray(relayArray);
  client.SendToClient("S", [0,statusValue]);
}

function toggleExternalRelays()
{
  let elm = document.getElementById("container").style;

  if(isExtRelVisible)
  {
    elm.display = "none";
  }
  else
  {
    elm.display = "grid";
  }

  isExtRelVisible = !isExtRelVisible;
}

function toggleConfig()
{
  let elm = document.getElementById("container").style;
  let confElm = document.getElementById("configuration").style;
  let panelElm = document.getElementById("configPanel").style;

  if(isConfigVisible)
  {
    confElm.display = "none";
    panelElm.display = "none";
    client.Reload = true;
    getInterval = window.setInterval(() => { client.SendToClient("G", null); console.log("Interval status called")}, 10000);
    
    if(useShortCuts==1)
      addKeyEventListener();
  }
  else
  {
    if(!isExtRelVisible)
      elm.display = "grid";

    confElm.display = "grid";
    panelElm.display = "block";
    client.Reload = false;
    clearInterval(getInterval);
    console.log("Interval cleared.");
    
    if(useShortCuts==1)
      removeKeyEventListener();
  }

  isConfigVisible = !isConfigVisible;
}




//************************************* Handler for Result and PTT ************************************************************
//*****************************************************************************************************************************

function handleWSResult(result)
{
  let aelm = document.getElementById("activity");
  aelm.style.fill = "#00ff00";

  console.log(result);  
  statusValue = result.B0;
  relayArray = GetOrderedArraybyValue(statusValue);
 
  updateUI();

  window.setTimeout(() => {   aelm.style.fill = "#008000"; }, 200);
}

function handlePTT(result)
{
  let aelm = document.getElementById("activity");
  aelm.style.fill = "#00ff00";

  if(remoteState==0)
    return;
  
  let elm = document.getElementById("ledPtt");

  if(result.IsPTT == 1)
  {
    elm.setAttribute("href", serverip+"red_on.png");
    isLockedByPTT = true;
  }
  else
  {
    elm.setAttribute("href", serverip+"red_off.png");
    isLockedByPTT = false;
  }

  window.setTimeout(() => {   aelm.style.fill = "#008000"; }, 200);
}

