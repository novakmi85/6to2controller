/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
//************************************************** Configuration ************************************************************
//*****************************************************************************************************************************

function updateLabels()
{
  for(let a=1; a < numberOfWhiteLabels+1; a++)
  {
    let elm = document.getElementById("btn"+a);
    let elmInput = document.getElementById("label"+a);
    elm.textContent = elmInput.value;
    config["Label"+a] = elmInput.value;
  }
}

function updateExtLabels()
{
  for(let a=8; a < 16; a++)
  {
    let elm = document.getElementById("btn"+a).childNodes[0];
    let elmInput = document.getElementById("label"+a);
    elm.innerHTML = elmInput.value;
    config["Label"+a] = elmInput.value;
  }
}

function updatePosition()
{
  for(let a=1; a < numberOfWhiteLabels+1; a++)
  {
    let elm = document.getElementById("btn"+a);
    let elmOff = document.getElementById("off"+a);
    
    elm.textContent = eval("config.Label"+a); 
    elm.setAttribute('x', parseInt(eval("defaultK.x"+a)) + parseInt(elmOff.value));
    config["Offset"+a] = elmOff.value;
  }
}

function updateIp()
{
  let elmIp = document.getElementById("deviceIp");
  
  let found = (elmIp.value).indexOf(":");
  
  if(found==-1)
	  elmIp.value = elmIp.value+":59";
  config.Ip = elmIp.value; 
}

function updateId()
{
  let elmId = document.getElementById("myid");
  let elmDeviceName = document.getElementById("devicename");
  elmDeviceName.textContent = elmId.value;
  config.myid = elmId.value; 
}


function updateFontSize()
{
  let elmFs = document.getElementById("fs");

  for(let a=1; a < numberOfWhiteLabels+1; a++)
  {
    document.getElementById("btn"+a).style.fontSize = elmFs.value+"px";
  }

  config.FontSize = elmFs.value; 
}

function updateFontCol()
{
  let elmCol = document.getElementById("fcol");

  for(let a=1; a < numberOfWhiteLabels+1; a++)
  {
    document.getElementById("btn"+a).style.fill = elmCol.value;
  }

  config.FillColor = elmCol.value; 
}



//************************************************** Link n device ************************************************************
//*****************************************************************************************************************************

function generateLink()
{
  RequestParams['ip'] = document.getElementById("deviceIp").value;

  for(let a=1; a < numberOfWhiteLabels+1; a++)
  {
    RequestParams["l"+a] = document.getElementById("btn"+a).textContent;
    RequestParams["o"+a] = document.getElementById("off"+a).value;
  }

  RequestParams['id'] = document.getElementById("myid").value;
  RequestParams['col'] = escape(document.getElementById("fcol").value);
  RequestParams['fons']= document.getElementById("fs").value;

  if(document.getElementById("socketTimeout").value != "")
    RequestParams['st']= document.getElementById("socketTimeout").value;

  if(document.getElementById("forceHttp").checked)
    RequestParams['fhttp']= 1;

  const paramString = new URLSearchParams(RequestParams)  
  let result = window.location.href.split('?')[0];

  result += "?"+paramString.toString();

  document.getElementById("genLink").value = result;
}

function findDevice()
{
  //let result = window.location.href.split('/index')[0];
  window.open(serverip+"pinger.html", '_blank');
}

function openUrl()
{
  window.open(document.getElementById("genLink").value, '_blank');
}

function openStorage()
{
  let result = window.location.href.split('.html')[0];
  result += ".html?id="+config.myid
  window.open(result, '_blank');
}
