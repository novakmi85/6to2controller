/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
function loadData(iname)
{
    _config = JSON.parse(localStorage.getItem(iname)); // Auslesen

    if(_config == null)
    {
        console.log("Main: No config in local storage. Will use urlParams");
        return;
    }

    let sresult = JSON.stringify(_config);

    console.log(JSON.stringify(_config, null, 4));
    config = JSON.parse(sresult);
    
    console.log("Config from local storage loaded successfully");
}

function storeData(iname)
{
    let json = JSON.stringify(config);  
    localStorage.setItem (iname, json); 
}

function deleteData(iname)
{
    localStorage.removeItem(iname);
    console.log("Delete Config in Storage");
}
