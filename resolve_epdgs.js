process = require('process')
const args = process.argv;
if (args.length < 3 ) {
    console.error("usage: generate a list of possibly active ePDG by resolving their ipv4/ipv6 addresses")
    console.error("node resolve_epdgs ./epdgs.json")
    process.exit(1);
}

let epdgs_dict = require(args[2]);

const { Resolver } = require('node:dns').promises;
const resolver = new Resolver({
    "timeout": 500,
    "tries": 1,
});


const lookup = async (domain, root) => {
    const resolver = new dns.Resolver();
    resolver.setServers([root]);
    try {
        await resolver.resolve4(domain);
    } catch (e) {
        return false;
    }
    return true;
};


async function query(domain) {
    let addrs = {}
    try {
        let ipv4 = await resolver.resolve4(domain);
        addrs["ipv4"]=ipv4
    }
    catch (err){
    }
    try {
        let ipv6 = await resolver.resolve6(domain);
        addrs["ipv6"]=ipv6
    }
    catch (err){
    }
    return addrs
}


epdgs_dict_with_addr = {}

async function resolveNames () {

    epdgs = Object.keys(epdgs_dict)
  
    await epdgs.reduce(async (promise, epdg) => {
      await promise;
      const addrs = await query(epdg)
      if (addrs && (addrs["ipv4"] && addrs["ipv4"].length > 0) || (addrs["ipv6"] && addrs["ipv6"].length >0)) {
        epdgs_dict_with_addr[epdg] =  epdgs_dict[epdg]
        epdgs_dict_with_addr[epdg]["addrs"] =  addrs
      }
    }, Promise.resolve());
  }



async function enrich_epdgs() {
    await resolveNames()
    console.log(JSON.stringify(epdgs_dict_with_addr))
  }
  
enrich_epdgs();
