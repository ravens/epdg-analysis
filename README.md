# epdg-analysis

A weekend exercice into caracterizing the ePDGs (VoWiFi endpoints) visible from the Internet.

Needed: nodejs, ike-scan.

```
wget https://raw.githubusercontent.com/P1sec/MCC_MNC/master/mcc_mnc_lut/p1_mcc.json
wget https://raw.githubusercontent.com/P1sec/MCC_MNC/master/mcc_mnc_lut/p1_mnc.json
node generate_epdgs.js >  epdgs.json # generate a list of epdgs FQDN to try
node resolve_epdgs.js > active_epdgs.json # generate a list having a A or AAAA record
./probe-epdgs.sh active_epdgs.json > active_scan # scan with ike-acan for active endpoints
# stats 
# unique plmn 
cat epdgs.json | jq '.[].fqdn' | sort -u   | wc -l 
    2894
# unique ePDG with IPv4 or IPv6 addresses
cat active_epdgs.json | jq -r  '.[].fqdn' | sort -u | wc -l
     325
# ePDG responding to IKEv2 probes
cat active_scan | wc -l                                      
     196
```