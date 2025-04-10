/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/
function addKeyEventListener()
{
    document.addEventListener('keydown', keyboardHandler);
}

function removeKeyEventListener()
{
    document.removeEventListener('keydown', keyboardHandler);
}

function keyboardHandler(event)
{
        if (event.defaultPrevented) {
            return;
        }

        var key = event.key || event.keyCode;
        var code = event.code;

        if(code == "Numpad"+key)
        {
            if(key>8 || key == 0)
                return;

            fireButton(key-1);
            return;
        }
}