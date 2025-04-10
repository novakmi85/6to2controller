const deviceTypeAssignMB=
{
    "v1" : [0],
    "v11" : [0,1],
    "v2" : [1],
    "v14": [1,2],
    "v4" : [2],
    "v13" : [0,2],
    "v15" : [0,1,2]
}

// const deviceTypeAssignMBR=
// {
//     "v1" : [0],
//     "v11" : [0,1],
//     "v2" : [1],
//     "v14": [1,2],
//     "v4" : [2],
//     "v13" : [0,2],
//     "v15" : [0,1,2]
// }

const deviceTypeAssignMBR=
{
    "v14" : [0],
    "v4" : [0,1],
    "v13" : [1],
    "v1": [1,2],
    "v11" : [2],
    "v2" : [0,2],
    "v0" : [0,1,2]
}

const deviceTypeAssignMBSJ=
{
    "v9" : [0],
    "v4" : [0,1],
    "v10" : [1],
    "v1": [1,2],
    "v12" : [2],
    "v2" : [0,2],
    "v0" : [0,1,2]
}

const deviceTypeAssignSM2=
{
    "v1" : [0],
    "v2" : [1],
    "v7" : [2],
    "v15" : [3]
}

function mbsjmap(bitv)
{
    let entry = deviceTypeAssignMBSJ["v"+bitv];
    return mbmp(entry);
}

function mbrmap(bitv)
{
    let entry = deviceTypeAssignMBR["v"+bitv];
    return mbmp(entry);
}

function sm2map(bitv)
{
    let entry = deviceTypeAssignSM2["v"+bitv];
    return mbmp(entry);
}


function mbmp(entry)
{
    let temparr = [0,0,0,0];

    for(a=0; a < entry.length; a++)
    {
        temparr[entry[a]] = 1;
    }

    return temparr;
}


// const nrLabelsMB = 7;
// const nrLabelsSM1_2 = 4;

// var DeviceType = 0;
// var DeviceModel = 0;

// const LabelsMB = [
//     "Antenna 1",
//     "Ant1 + Ant2",
//     "Antenna 2",
//     "Ant2 + Ant3",
//     "Antenna 3",
//     "Ant3 + Ant1",
//     "All Antennas"
// ];

// const LabelsSM1_3 = [
//     "Antenna TOP",
//     "TOP + MID",
//     "Antenna MID",
//     "MID + BOT",
//     "Antenna BOT",
//     "BOT + TOP",
//     "All Antennas"
// ];


// const LabelsSM1_2 = [
//     "Antenna 1",
//     "Antenna 2",
//     "IN Phase",
//     "OUT Phase"
// ];

// const MatrixxMB = [
//     [1,0,0,0],
//     [1,1,0,1],
//     [0,1,0,0],
//     [0,1,1,1],
//     [0,0,1,0],
//     [1,0,1,1],
//     [1,1,1,1]
// ]; 

// const MatrixxMBINV = [
//     [0,1,1,1],
//     [0,0,1,0],
//     [1,0,1,1], 
//     [1,0,0,0],
//     [1,1,0,1],
//     [0,1,0,0],
//     [0,0,0,0]
// ]; 

// const MatrixxMBSJ = [
//     [1,0,0,1],
//     [0,0,1,0],
//     [0,1,0,1],
//     [1,0,0,0],
//     [0,0,1,1], 
//     [0,1,0,0], 
//     [0,0,0,0]
// ]; 

// const MatrixxSM1_2 = [
//     [1,0,0,0],
//     [0,1,0,0],
//     [1,1,1,0],
//     [1,1,1,1]
// ];

// function getArraySize()
// {
//     switch (DeviceType)
//     {
//         case 1: case 2:
//             return nrLabelsMB;
//         case 3:
//             return nrLabelsSM1_2;
//     }

//     return 0;
// };

// function getLabels()
// {
//     switch (DeviceType)
//     {
//         case 1: 
//             return LabelsMB;
//         case 2:
//             return LabelsSM1_3;
//         case 3:
//             return LabelsSM1_2;
//     }

//     return null;
// };

// function getMatrix()
// {
//     if(DeviceModel == 0) // QRO CZ
//     {
//         switch (DeviceType)
//         {
//             case 1: case 2:
//                 return MatrixxMB[0];
//             case 3:
//                 return MatrixxSM1_2[0];
//         }
//     }
//     else if(DeviceModel == 1) // QRO CZ INV
//     {
//         switch (DeviceType)
//         {
//             case 1: case 2:
//                 return MatrixxMBINV[0];
//             case 3:
//                 return MatrixxSM1_2[0]; // NO INV => DEFAULT
//         }
//     }
//     else
//     {
//         switch (DeviceType) // NON QRO CZ
//         {
//             case 1: case 2:
//                 return MatrixxMBSJ[0];
//             case 3:
//                 return MatrixxSM1_2[0];  // NO INV => DEFAULT
//         }
//     }

//    return null;
// };

/*

    const uint8_t nrLabelsMB = 7;
    const uint8_t nrLabelsSM1_2 = 4;

    const char* LabelsMB[7] = {
        "Antenna 1",
        "Ant1 + Ant2",
        "Antenna 2",
        "Ant2 + Ant3",
        "Antenna 3",
        "Ant3 + Ant1",
        "All Antennas"
    };

    const char* LabelsSM1_3[7] = {
        "Antenna TOP",
        "TOP + MID",
        "Antenna MID",
        "MID + BOT",
        "Antenna BOT",
        "BOT + TOP",
        "All Antennas"
    };


    const char* LabelsSM1_2[4] = {
        "Antenna 1",
        "Antenna 2",
        "IN Phase",
        "OUT Phase"
    };

    bool MatrixxMB[7][4] = {
        {1,0,0,0},
        {1,1,0,1},
        {0,1,0,0},
        {0,1,1,1},
        {0,0,1,0},
        {1,0,1,1},
        {1,1,1,1}
    }; 

    bool MatrixxMBINV[7][4] = {
        {0,1,1,1},
        {0,0,1,0},
        {1,0,1,1}, 
        {1,0,0,0},
        {1,1,0,1},
        {0,1,0,0},
        {0,0,0,0}
    }; 

    bool MatrixxMBSJ[7][4] = {
        {1,0,0,1},
        {0,0,1,0},
        {0,1,0,1},
        {1,0,0,0},
        {0,0,1,1}, 
        {0,1,0,0}, 
        {0,0,0,0}
    }; 

    bool MatrixxSM1_2[4][4] = {
        {1,0,0,0},
        {0,1,0,0},
        {1,1,1,0},
        {1,1,1,1}
    };

public:
    uint8_t DeviceType = 0;
    uint8_t DeviceModel = 0;

    QROCustomConfig(uint8_t devtype, uint8_t devModel)
    {
        DeviceType = devtype;
        DeviceModel = devModel;
    };

    const uint8_t getArraySize()
    {
        switch (DeviceType)
        {
            case 1: case 2:
                return nrLabelsMB;
            case 3:
                return nrLabelsSM1_2;
        }

        return 0;
    };

    const char** getLabels()
    {
        switch (DeviceType)
        {
            case 1: 
                return LabelsMB;
            case 2:
                return LabelsSM1_3;
            case 3:
                return LabelsSM1_2;
        }

        return nullptr;
    };

    bool *getMatrix()
    {
        if(DeviceModel == 0) // QRO CZ
        {
            switch (DeviceType)
            {
                case 1: case 2:
                    return MatrixxMB[0];
                case 3:
                    return MatrixxSM1_2[0];
            }
        }
        else if(DeviceModel == 1) // QRO CZ INV
        {
            switch (DeviceType)
            {
                case 1: case 2:
                    return MatrixxMBINV[0];
                case 3:
                    return MatrixxSM1_2[0]; // NO INV => DEFAULT
            }
        }
        else
        {
            switch (DeviceType) // NON QRO CZ
            {
                case 1: case 2:
                    return MatrixxMBSJ[0];
                case 3:
                    return MatrixxSM1_2[0];  // NO INV => DEFAULT
            }
        }

       return nullptr;
    };
};
*/