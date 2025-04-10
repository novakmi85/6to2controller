/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
class WebClient6by2 extends WebClient {

    constructor() {
        super(config.SocketTimeout);
    }

    SetValuesFromWSResult(result)
    {
        if(typeof result.IsPTT1 == "undefined" && typeof result.IsPTT2 == "undefined")
            handleWSResult(result);
        else
            handlePTT(result);
    }
}