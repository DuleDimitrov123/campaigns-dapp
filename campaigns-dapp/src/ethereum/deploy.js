const path = require('path');
const ganache = require('ganache-cli');
const fs = require('fs-extra');
const HDWalletProvider = require('truffle-hdwallet-provider');

const Web3 = require('web3');
const {interface, bytecode} = require('./build/CampaignManager.json');

// const mnemonic = '';//DON'T FORGET TO ADD MNEMONICS
// const infuraUrl = "https://sepolia.infura.io/v3/6a0cfddad38546c5876a302d4e38a409";

// const provider = new HDWalletProvider(mnemonic, infuraUrl);

//const web3 = new Web3(provider);
const web3 = new Web3(ganache.provider());//just for local testing....

const deploy = async () => {
    console.log('starting deployment');
    const accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    console.log('Attempting to deploy from account', accounts[0]);
    let result;

    try {
        result = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: '0x' + bytecode, arguments: []})
            .send({from: accounts[0], gas:'5000000'});
    }
    catch(err) {
        console.log('Error', err);
    }

    if (result && result.options) {
        console.log('Deployment completed');
        console.log(result.options.address);

        fs.outputFileSync(path.resolve(__dirname, 'contractAddress.js'),
            `const address = '${result.options.address}';\nmodule.exports = { address };\n`);
    } else {
        console.error('Deployment failed, no result returned');
    }

    console.log('Done deploy function')
};
deploy();

