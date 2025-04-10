/* LICSENSE INFORMATION
copyright 2018 by Michael Müller. All rights reserved. This code is NOT open source. The provided functionality is only allowed to be used with qro.cz/hamparts.shop hardware. Violations of this license agreement will be prosecuted. -->
*/

var forcePullTime = 60000;

function GetOrderedArraybyValue(value)
{
    var i;
    var feld = [];

    for (i = 0; i < 16; i++)
    {
        feld[i] = value % 2;
        value = float2int(value/2);
    }

    return feld;
}

function GetValueByOrderedArray(arr)
{
  var result = 0;

  for(var a = 15; a >= 0; a--)
  {
        result = result + (arr[a] * 1<<a);
  }

  return result;
}

function float2int(value) {
    return  Math.trunc(value);
}

function isKInNSet(n, k) 
{ 
    if (n & (1 << (k))) 
        return true; 
    else
        return false;
}

function setBit(n, k)
{
    return (n | (1 << (k - 1)));
}

function clearBit(n, k)
{
    return (n & (~(1 << (k - 1))));
}