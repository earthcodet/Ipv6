function Main() {  
    let Ipv6_Input = document.getElementById('inputip').value;
    if (Ipv6_Input.search(/[^0-9:abcdef]/i) !== -1) {
        CallError();
        return;
    }

    if (Ipv6_Input.length > 0) {
        const semicolon_pattern = /[:]/g;
        var colon_list = [];
        while (match = semicolon_pattern.exec(Ipv6_Input)) {
            colon_list.push(match.index);
        }
        const double_colon_pattern = /(::)/g;
        let search = double_colon_pattern.exec(Ipv6_Input);

        var double_colon;
        if (search) {
            double_colon = search.index;

            //เรียก function CallError ถ้า :: มีมากกว่า 1
            if (Ipv6_Input.match(double_colon_pattern).length > 1) {
                CallError();
                return;
            }
        } else {
            double_colon = null;
        }
       

        //เรียก function CallError ถ้าตัวแรกเป็น 0 และ :ติดกัน
        if (colon_list[0] === 0 && colon_list[0] !== double_colon) {
            CallError();
            return;
        }

        if (colon_list.length === 7) {
            let ipv6_full = "";
            if (double_colon) {              
                const firstpart = Ipv6_Input.slice(0, double_colon);
                const secondpart = Ipv6_Input.slice(double_colon + 1, Ipv6_Input.length);
                let zeroline = "";
                for (i = 0; i < 8 - colon_list.length; i++) {
                    zeroline += ":0000"
                }
                ipv6_full = firstpart + zeroline + secondpart;
            } else {
                ipv6_full = Ipv6_Input;
            }

            colon_list = [];
            while (match = semicolon_pattern.exec(ipv6_full)) {
                
                colon_list.push(match.index);
            }

            search = double_colon_pattern.exec(ipv6_full);
            if (search) {
                CallError();
                return;
            }

            const Array_ipv6_sub = addZeroAndMakeItArray(colon_list, ipv6_full);
            const prefix_length = document.getElementById('prefix-dropdown').value;
            create_Table_detail_ipv6(Ipv6_Input, Array_ipv6_sub, prefix_length)
            
        } else {
            if (colon_list.length !== 0) {
                if (double_colon !== null) {
                    const firstpart = Ipv6_Input.slice(0, double_colon);
                    const secondpart = Ipv6_Input.slice(double_colon + 1, Ipv6_Input.length);
                    let zeroline = "";
                    for (i = 0; i < 8 - colon_list.length; i++) {
                        zeroline += ":0000"
                    }
                    const newip = firstpart + zeroline + secondpart;
                    colon_list = [];
                    while (match = semicolon_pattern.exec(newip)) {
                        
                        colon_list.push(match.index);
                    }
                
                    search = double_colon_pattern.exec(newip);
                    if (search) {
                        CallError();
                        return;
                    }

                    const ipblockarr = addZeroAndMakeItArray(colon_list, newip);
                    const prefixlength = document.getElementById('prefix-dropdown').value;
                    create_Table_detail_ipv6(Ipv6_Input, ipblockarr, prefixlength)
                } else {
                    CallError();
                    return;
                }
               
            } else {
                CallError();
            }
        }
    } else {
        CallError();
    }
}

function addZeroAndMakeItArray(colon_list, ip) {
    let result = [];
    colon_list.map((IndexRun) => {
        if (colon_list.indexOf(IndexRun) === 0) {
            var newword = ip.slice(0, IndexRun);
            if (IndexRun < 4) {
              
                const length = newword.length;
                for (i = 0; i < 4 - length; i++) {
                    newword = 0 + newword;
                }
                result.push(newword);
               
            } else if (IndexRun > 4) {
                CallError();
                return;
            } else {
                result.push(newword);
            }
        } else {
            var newword = ip.slice(colon_list[colon_list.indexOf(IndexRun) - 1] + 1, IndexRun);
            
            if (IndexRun - colon_list[colon_list.indexOf(IndexRun) - 1] < 5) {
                
                const length = newword.length;
                for (i = 0; i < 4 - length; i++) {
                    newword = 0 + newword;
                }
                result.push(newword);
            } else if (IndexRun - colon_list[colon_list.indexOf(IndexRun) - 1] > 5) {
                CallError();
                return;
            } else {
                result.push(newword);
            }
        }

    });

    var newword = ip.slice(colon_list[colon_list.length - 1] + 1, ip.length);
    if (ip.length - 1 - colon_list[colon_list.length - 1] < 5) {
        const length = newword.length;
        for (i = 0; i < 4 - length; i++) {
            newword = 0 + newword;
        }
        result.push(newword);
    } else if (ip.length - 1 - colon_list[colon_list.length - 1] > 5) {
        CallError();
        return;
    } else {
        result.push(newword);
    }
    return result;
}

function create_Table_detail_ipv6(originalip, ipblock, prefixlength) {
    if (document.getElementById('content') !== null) {
        document.getElementById('address').innerText = originalip + " /" + prefixlength;
        document.getElementById('network').innerText = getNetworkString(ipblock);
        document.getElementById('prefixlength').innerText = prefixlength;
        document.getElementById('networkrange').innerText = divideIpBlock(calculateNetworkRange(ipblock).minlength) + " - \n" + divideIpBlock(calculateNetworkRange(ipblock).maxlength);
        document.getElementById('totalip').innerText = new BigNumber(2).pow(128 - prefixlength).toFormat();
        document.getElementById('fullip').innerText = divideIpBlock(ipblock);
        document.getElementById('integerid').innerText = new BigNumber(createBinaryString(createBinaryArray(ipblock)), 2).toFixed(0);
        document.getElementById('hexadecimalid').innerText = createHexadecimalId(ipblock);
        document.getElementById('dotdecimalid').innerText = createDotDecimalId(ipblock);
        createSubnetArea(ipblock, prefixlength);
    } else {
        const contentdiv = document.createElement('div');
        contentdiv.setAttribute("id", "content");
        document.body.appendChild(contentdiv);
        let table = document.createElement('table');
        table.setAttribute('id', 'table1');

        //original address
        let addresstxt = document.createElement('td');
        addresstxt.appendChild(document.createTextNode('IP address'));
        let address = document.createElement('td');
        address.appendChild(document.createTextNode(originalip + " /" + prefixlength));
        address.setAttribute('id', 'address');
        let row = document.createElement('tr');
        row.appendChild(addresstxt);
        row.appendChild(address);
        table.appendChild(row);

        //network address
        let networktxt = document.createElement('td');
        networktxt.appendChild(document.createTextNode('Network'));
        let networkvalue = document.createElement('td');
        networkvalue.appendChild(document.createTextNode(getNetworkString(ipblock)));
        networkvalue.setAttribute('id', 'network');
        row = document.createElement('tr');
        row.appendChild(networktxt);
        row.appendChild(networkvalue);
        table.appendChild(row);

        //prefix length
        let prefixtxt = document.createElement('td');
        prefixtxt.appendChild(document.createTextNode('Prefix length'));
        let prefixvalue = document.createElement('td');
        prefixvalue.appendChild(document.createTextNode(prefixlength));
        prefixvalue.setAttribute('id', 'prefixlength');
        row = document.createElement('tr');
        row.appendChild(prefixtxt);
        row.appendChild(prefixvalue);
        table.appendChild(row);
        let networkrangetxt = document.createElement('td');
        networkrangetxt.appendChild(document.createTextNode('Network range'));
        let networkrangevalue = document.createElement('td');
        networkrangevalue.appendChild(document.createTextNode(divideIpBlock(calculateNetworkRange(ipblock).minlength) + " - \n" + divideIpBlock(calculateNetworkRange(ipblock).maxlength)));
        networkrangevalue.setAttribute('id', 'networkrange');
        row = document.createElement('tr');
        row.appendChild(networkrangetxt);
        row.appendChild(networkrangevalue);
        table.appendChild(row);

        //total ip addresses
        let totaltiptxt = document.createElement('td');
        totaltiptxt.appendChild(document.createTextNode('Total IP addresses'));
        let totalipvalue = document.createElement('td');
        totalipvalue.appendChild(document.createTextNode(new BigNumber(2).pow(128 - prefixlength).toFormat()));
        totalipvalue.setAttribute('id', 'totalip');
        row = document.createElement('tr');
        row.appendChild(totaltiptxt);
        row.appendChild(totalipvalue);
        table.appendChild(row);
        contentdiv.appendChild(table);
        contentdiv.appendChild(document.createElement('br'));

        //table 2
        let table2 = document.createElement('table');
        table2.setAttribute('id', 'table2');

        //full ip addresses
        let fulliptxt = document.createElement('td');
        fulliptxt.appendChild(document.createTextNode('IP Address (Full)'));
        let fullipvalue = document.createElement('td');
        fullipvalue.appendChild(document.createTextNode(divideIpBlock(ipblock)));
        fullipvalue.setAttribute('id', 'fullip');
        row = document.createElement('tr');
        row.appendChild(fulliptxt);
        row.appendChild(fullipvalue);
        table2.appendChild(row);

        //integer id
        let integeridtxt = document.createElement('td');
        integeridtxt.appendChild(document.createTextNode('Integer ID'));
        let integeridvalue = document.createElement('td');
        integeridvalue.appendChild(document.createTextNode(new BigNumber(createBinaryString(createBinaryArray(ipblock)), 2).toFixed(0)));
        integeridvalue.setAttribute('id', 'integerid');
        row = document.createElement('tr');
        row.appendChild(integeridtxt);
        row.appendChild(integeridvalue);
        table2.appendChild(row);

        //hexadecimal id
        let hexadecimaltxt = document.createElement('td');
        hexadecimaltxt.appendChild(document.createTextNode('Hexadecimal ID'));
        let hexadecimalvalue = document.createElement('td');
        hexadecimalvalue.appendChild(document.createTextNode(createHexadecimalId(ipblock)));
        hexadecimalvalue.setAttribute('id', 'hexadecimalid');
        row = document.createElement('tr');
        row.appendChild(hexadecimaltxt);
        row.appendChild(hexadecimalvalue);
        table2.appendChild(row);

        //dot decimal id
        let dotdecimaltxt = document.createElement('td');
        dotdecimaltxt.appendChild(document.createTextNode('Dotted decimal ID'));
        let dotdecimalvalue = document.createElement('td');
        dotdecimalvalue.appendChild(document.createTextNode(createDotDecimalId(ipblock)));
        dotdecimalvalue.setAttribute('id', 'dotdecimalid');
        row = document.createElement('tr');
        row.appendChild(dotdecimaltxt);
        row.appendChild(dotdecimalvalue);
        table2.appendChild(row);
        contentdiv.appendChild(table2);
        contentdiv.appendChild(document.createElement('h3').appendChild(document.createTextNode('subnet level 1')));
        createSubnetArea(prefixlength)
    }
}

function createSubnetArea(prefixlength) {

    if (document.getElementById('subnetarea')) {
        document.body.removeChild(document.getElementById('subnetarea'));
    }

    let subnetarea = document.createElement('div');
    subnetarea.setAttribute('id', 'subnetarea');
    document.body.appendChild(subnetarea);

    for (i = 1; i < 64 && Number.parseInt(prefixlength) + i <= 128; i++) {
        let subnet = document.createElement('a');
        let sunnet_name = Number.parseInt(prefixlength) + i;
        if (sunnet_name < 64) {
            subnet.appendChild(document.createTextNode(`${new BigNumber(2).pow(i).toFormat()} networks /${sunnet_name} (${new BigNumber(2).pow(64 - (sunnet_name)).toFormat()} networks /64)`))
        } else {
            subnet.appendChild(document.createTextNode(`${new BigNumber(2).pow(i).toFormat()} networks /${sunnet_name} (${new BigNumber(2).pow(128 - (sunnet_name)).toFormat()} addresses)`))
        }
        subnetarea.appendChild(subnet);
        subnetarea.appendChild(document.createElement('br'));
    }
}




function CallError() {
    document.getElementById('showWorlk').innerHTML = "Error Invalid IPv6 address Press F5 to back pang";
}

function fillZeroInBinaryArray(array) {
    //build zero
    array.map((block) => {
        let zeroline = ""
        while (zeroline.length < 16 - block.length) {
            zeroline += "0";
        }
        array[array.indexOf(block)] = zeroline + block;
    });
    
    return array;
}

function getNetworkString(ipblock) {
    const ipdata = calculateNetwork(ipblock);

    //make network string

    let returnstring = "";
    for (i = 0; i < ipdata.binaryblock.length; i++) {
        if (i === ipdata.blockindex && ipdata.binaryblock[i] == "0000000000000000") {
            returnstring.charAt(returnstring.length - 1) === ":" ? returnstring += ":" : returnstring += "::";
            break;
        } else if (i === ipdata.blockindex) {
            returnstring += Number.parseInt(ipdata.binaryblock[i], 2).toString(16) + "::";
            break;
        }
        else if (i === ipdata.binaryblock.length - 1) {
            returnstring += Number.parseInt(ipdata.binaryblock[i], 2).toString(16);
        } else {
            if (ipdata.binaryblock[i] == "0000000000000000") {
                returnstring += "0:";
            } else {
                returnstring += Number.parseInt(ipdata.binaryblock[i], 2).toString(16) + ":";
            }
        }
    }

    return returnstring;
}

function createBinaryArray(ipblock) {


    let binaryarr = [];

    ipblock.map((block) => {
        binaryarr.push(Number.parseInt(block, 16).toString(2));
    });
    return fillZeroInBinaryArray(binaryarr);
}

function createBinaryString(binaryarray) {
    let returnstring = "";
    binaryarray.map((block) => {
        returnstring += block;
    })

    return returnstring;
}


function calculateNetwork(ipblock) {
    
    let newblockbinary = createBinaryArray(ipblock)
   
    const prefixlength = document.getElementById('prefix-dropdown').value
    
    let blockindex;
    prefixlength == 128 ? 7 : blockindex = Number.parseInt(prefixlength / 16);
    const blockradix = prefixlength % 16;
  
    //fill block with zero
    let newstring = "";
    if (blockindex > 0) {
        if (blockindex === 8) {
            newstring = newblockbinary[blockindex - 1].slice(0, blockradix);
        } else {
            newstring = newblockbinary[blockindex].slice(0, blockradix);
        }

    } else {
        newstring = newblockbinary[0].slice(0, blockradix);
    }
 
    for (i = blockradix + 1; i <= 16; i++) {
        newstring += "0";
    }
  
    newblockbinary[blockindex] = newstring;

    //fill everybit behind prefix with zero
    for (i = blockindex + 1; i < ipblock.length; i++) {
        newblockbinary[i] = "0000000000000000";
    }

    const returnjson = {
        binaryblock: newblockbinary,
        blockindex: blockindex,
        blockradix: blockradix
    }
    return returnjson;
}

function calculateNetworkRange(ipblock) {
    const minrangedata = calculateNetwork(ipblock);
    const binaryarray = minrangedata.binaryblock;
    const blockindex = minrangedata.blockindex;
    const blockradix = minrangedata.blockradix;

    //create max network range
    let newstring = binaryarray[blockindex].slice(0, blockradix);
    for (i = blockradix; i < binaryarray[blockindex].length; i++) {
        newstring = newstring + "1";
    }


    //build string
    let minrangebinaryarr = [];

    for (i = 0; i < binaryarray.length; i++) {
        minrangebinaryarr[i] = Number.parseInt(binaryarray[i], 2).toString(16);
    }


    let maxrangebinaryarr = minrangebinaryarr.slice(0);

    for (i = blockindex; i < maxrangebinaryarr.length; i++) {
        if (i == blockindex) {
            maxrangebinaryarr[i] = Number.parseInt(newstring, 2).toString(16);
        } else {
            maxrangebinaryarr[i] = "ffff";
        }
    }


    let returndata = {
        minlength: minrangebinaryarr,
        maxlength: maxrangebinaryarr
    }

    return returndata;
}

function divideIpBlock(ipblock) {

    let returnstring = "";
    for (i = 0; i < ipblock.length; i++) {
        if (i == ipblock.length - 1) {
            returnstring += ipblock[i];
        } else {
            returnstring += ipblock[i] + ":";
        }
    }


    return returnstring;
}

function createHexadecimalId(ipblock) {
    let returnstring = "0x";

    ipblock.map((block) => {
        returnstring += block;
    })

    return returnstring;
}

function createDotDecimalId(ipblock) {
    let binaryarr = createBinaryArray(ipblock);

    let returnstring = ""
    for (i = 0; i < ipblock.length; i++) {
        let dotdecimalblock = "";
        if (i == 0) {
            dotdecimalblock += Number.parseInt(binaryarr[i].slice(0, 8), 2);
            dotdecimalblock += ".";
            dotdecimalblock += Number.parseInt(binaryarr[i].slice(9, 16), 2);
        } else {
            dotdecimalblock += "."
            dotdecimalblock += Number.parseInt(binaryarr[i].slice(0, 8), 2);
            dotdecimalblock += ".";
            dotdecimalblock += Number.parseInt(binaryarr[i].slice(9, 16), 2);
        }
        returnstring += dotdecimalblock;
    }
    return returnstring
}


//ทำ list --> Prefix length
function dropdrowlist() {
    let list = document.getElementById('prefix-dropdown');
    const subnet = 128;
    for (i = 1; i <= subnet; i++) {
        if (i < 64) {
            const option = document.createElement('option');
            option.text = i + ` (${new BigNumber(2).pow(64 - i).toFormat()} networks /64)`;
            option.value = i;
            list.appendChild(option);
        } else {
            const option = document.createElement('option');
            option.text = i + ` (${new BigNumber(2).pow(subnet - i).toFormat()} addresses)`;
            option.value = i;
            list.appendChild(option);
        }
    }
}
dropdrowlist();