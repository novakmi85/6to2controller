/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
var wsretrycounter=0;

class WebClient {

    constructor(socketTimeout = 2000) {

        let options = {};
        let wsurl = "";
        let wsportLink2004 = 59;
        
        options.timeoutInterval = socketTimeout;
	
        let urlsplit = config.Ip.split(":");

        if(urlsplit[1] != wsportLink2004)
            urlsplit[1] = wsportLink2004;

        wsurl=urlsplit[0]+":"+urlsplit[1];

        this.Client = new ReconnectingWebSocket("ws://"+wsurl+"/xxws", null, options); 
        
        this.Client.onopen = () => { 
            console.log("Connected to websockets!")
            this.SendToClient("G", null);
            getInterval = window.setInterval(() => { client.SendToClient("G", null); console.log("Interval status called")}, forcePullTime);
            wsretrycounter = 0;          
        };
        this.Client.onclose = () => { 
            console.log("WebSocket was closed. - Retrying");
            this.HandleGetStatus();
        };

        this.Client.onmessage = (event) => 
        { 
            let result = JSON.parse(event.data);
                
            this.SetValuesFromWSResult(result);
            console.log(event.data);
        };

        this.Client.onerror = (event) => 
        { 
            console.log("Connetion is onerror");
            this.HandlePort();
        };

        this.Reload = true;
    }

    HandleGetStatus()
    {
        //update UI
        if (this.Reload && this.Client.readyState === WebSocket.CLOSED) 
        {
            console.log("Trying to reconnect...");
            wsretrycounter++;
			
			if(wsretrycounter>10)
				alert("Cannot connect - Switch is unreachable");
        }

        console.log("CloseHandleCalled");
        
    }
    
    SendToClient(cmd, values)
    {
        try
        {
            /*
                S/<banknr>/<value>
                s/<banknr>/<pin>/<0/1>
                G/ => GetStatus
            */
            if (this.Client.readyState === WebSocket.CLOSED) 
            {
                console.log("Trying to reconnect...");
                //location.reload();
                return;
            };

            if(cmd == "G")
            {
                this.Client.send("G");
                return;
            };

            if(cmd == "S")
            {
                this.Client.send("S/"+values[0]+"/"+values[1]);
                return;
            };

            if(cmd == "X")
            {
                this.Client.send("X/"+values[0]+"/"+values[1]+"/"+values[2]);
                return;
            };

            if(cmd == "s")
            {
                this.Client.send("s/"+values[0]+"/"+values[1]+"/"+values[2]);
                return;
            };
        }
        catch {
            console.log("cannot connect to ws");
            this.HandlePort();
        }
    }

    SetValuesFromWSResult(result)
    {
        if(result.IsPTT != undefined)
            handlePTT(result);
        else
            handleWSResult(result);
    }

    HandlePort() {
        if(wsretrycounter>15)
            return;
        wsretrycounter++;
        //location.reload();
        let urlsplit = config.Ip.split(":");
        
        if(urlsplit[1] == 59 && this.Client.url.indexOf(":59") > 0)
            this.Client.url = "ws://"+urlsplit[0]+":58/xxws";
        else if(urlsplit[1] == 59 && this.Client.url.indexOf(":58") > 0)
            this.Client.url = "ws://"+urlsplit[0]+":59/xxws";
    
        if(wsretrycounter>10)
            console.log("Cannot connect - Switch is unreachable");
    }

    HandleGetStatus()
    {
        //update UI
        if (this.Reload && this.Client.readyState === WebSocket.CLOSED) 
        {
            console.log("Trying to reconnect...");
            this.HandlePort();
        }

        console.log("CloseHandleCalled");
        
    }
}

class HttpClient {

    constructor() {
        
        getInterval = window.setInterval(() => {
            if(remoteState==0)
                return;
            this.SendToClient("G", null);
            console.log("Interval status called")}, forcePullTime/6);          

        this.Reload = true;
        let pptled = document.getElementById("ledPtt");
        
        if(typeof pttled!="undefined")
            pptled.setAttribute("xlink:href", "");

        this.SendToClient("G", null);
    }

    SendToClient(cmd, values)
    {
        try
        {
            /*
                S/<banknr>/<value>
                s/<banknr>/<pin>/<0/1>
                G/ => GetStatus
            */
            if(cmd == "G")
            {
                this.#send("G");
                return;
            };

            if(cmd == "S")
            {
                this.#send("Set"+values[0]+"/"+values[1]);
                return;
            };

            if(cmd == "X")
            {
                this.#send("Set"+values[0]+"/"+values[1]);
                setTimeout(() => {this.#send("G")},2000);
                return;
            };

            if(cmd == "s")
            {
                this.#send("set"+values[0]+"/"+values[1]+"/"+values[2]);
                return;
            };
        }
        catch(error) 
        { 
            console.log(error)
        };
    }

    #send(strcmd)
    {
        if(strcmd == "G")
            strcmd = "Get/";
        const url = "http://"+config.Ip+"/"+strcmd;
        var headers = {}
        
        fetch(url, {
            method : "GET",
            headers: headers
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        .then(data => {
            
            if(data.Status != undefined)
                return;
            let result = data;
                
            this.SetValuesFromWSResult(result);
        })
        .catch(function(error) {
            document.getElementById('messages').value = error;
        });
    }

    SetValuesFromWSResult(result)
    {
        if(result.IsPTT != undefined)
            handlePTT(result);
        else
            handleWSResult(result);
    }
}