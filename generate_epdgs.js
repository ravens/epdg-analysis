util = require('util')
process = require('process')

const args = process.argv;
if (args.length < 3 ) {
    console.error("usage: generate a dictionary of FQDN for ePDG based on PLMN luts from P1 Security")
    console.error("node generate_epdgs.js ./p1_mcc.json ./p1_mnc.json")
    process.exit(1);
}

p1_mcc = require(args[2])
p1_mnc = require(args[3])


mcc_list = p1_mcc[1]
mnc_list = p1_mnc[1]

let epdg_list = {};

Object.keys(mcc_list).forEach(function(mcc) {
    //console.log(mcc + " " + util.inspect(mcc_list[mcc]));
    let mncs = mcc_list[mcc]["mncs"]
    if (mncs) {
        for (var i = 0; i < mncs.length; i++) {
            mncs.forEach(function (plmn, index) {
                let mnc = plmn.slice(mcc.length)
                original_mnc = mnc
                if (mnc.length === 2) {

                    mnc = "0" + mnc
                }
                let epdgfqdn = "epdg.epc.mnc" + mnc + ".mcc" + mcc+ ".pub.3gppnetwork.org"
                epdg_list[epdgfqdn] = {"fqdn":epdgfqdn , "mcc": mcc, "mnc": mnc, "operator" : mnc_list[mcc+original_mnc].operator}
            });
        }
    }
});


console.log(JSON.stringify(epdg_list))