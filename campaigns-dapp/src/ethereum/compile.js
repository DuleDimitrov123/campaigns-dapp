const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const campaignManagerPath = path.resolve(__dirname, "contracts", "CampaignManager.sol");

const sources = {
    "Campaign.sol": fs.readFileSync(campaignPath, "utf8"),
    "CampaignManager.sol": fs.readFileSync(campaignManagerPath, "utf8")
};

// following creates couple important things:
// 1. bytecode: used for sending smart contract to the network
// 2. interface: used for communication from js code to smart contract
const output = solc.compile({sources}, 1).contracts;

fs.ensureDirSync(buildPath);

for(let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.substring(contract.indexOf(':')+1) + '.json'),
        output[contract]
    );
}