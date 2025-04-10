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
  config.Label3 = getUrlParam("l3", "Ant 3");
  config.Label4 = getUrlParam("l4", "Ant 4");
  config.Label5 = getUrlParam("l5", "Ant 5");
  config.Label6 = getUrlParam("l6", "Ant 6");

  config.Offset1 = getUrlParam("o1", 10);
  config.Offset2 = getUrlParam("o2", 10);
  config.Offset3 = getUrlParam("o3", 10);
  config.Offset4 = getUrlParam("o4", 10);
  config.Offset5 = getUrlParam("o5", 10);
  config.Offset6 = getUrlParam("o6", 10);
										 
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

  let elmDeviceName = document.getElementById("devicename");
  elmDeviceName.textContent = config.myid;
}



//************************************************** Togglers *****************************************************************
//*****************************************************************************************************************************

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

  if(result.IsPTT1 == 1)
  {
    if(!isLockedByPTT1)
    {
      let elm = document.getElementById("ledPtt1");
      elm.setAttribute("href", serverip+"red_on.png");
      isLockedByPTT1 = true;     
    }
  }
  else if(result.IsPTT2 == 1)
  {
    if(!isLockedByPTT2)
    {
      let elm = document.getElementById("ledPtt2");
      elm.setAttribute("href", serverip+"red_on.png");
      isLockedByPTT2 = true;     
    }
  }
  else if(result.IsPTT1 == 0)
  {
    if(isLockedByPTT1)
    {
      let elm1 = document.getElementById("ledPtt1");
      elm1.setAttribute("href", serverip+"red_off.png");
      isLockedByPTT1 = false;
    }
  }
  else if(result.IsPTT2 == 0)
  {
    if(isLockedByPTT2)
    {
      let elm2 = document.getElementById("ledPtt2");
      elm2.setAttribute("href", serverip+"red_off.png");
      isLockedByPTT2 = false;
    }
  }

  window.setTimeout(() => {   aelm.style.fill = "#008000"; }, 200);
}

