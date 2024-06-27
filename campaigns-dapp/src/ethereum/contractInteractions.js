const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface} = require('./build/CampaignManager.json');
const Campaign = require('./build/Campaign.json')
const {address} = require('./contractAddress');
const { hdkey } = require('ethereumjs-wallet');
const bip39 = require('bip39');


const mnemonic = '';//DON'T FORGET TO ADD MNEMONICS
const infuraUrl = "https://sepolia.infura.io/v3/6a0cfddad38546c5876a302d4e38a409";

const provider = new HDWalletProvider(mnemonic, infuraUrl);

const web3 = new Web3(provider);

const getAddressForIndex = async (i) => {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdwallet = hdkey.fromMasterSeed(seed);

    const walletHdPath = "m/44'/60'/0'/0/" + i;
    const walletAddress = hdwallet.derivePath(walletHdPath).getWallet().getAddressString();
    console.log("WallerADdress", walletAddress);
    return walletAddress;
};

const createCampaignAndDonate = async () => {
    const accounts = await web3.eth.getAccounts();

    const campaignManager = new web3.eth.Contract(JSON.parse(interface), address);

    console.log(`accounts[0]: ${accounts[0]}`);
    var acc2 = await getAddressForIndex(2);

    await campaignManager.methods.createCampaign(
        acc2,
        "Testing campaign",
        "This is some testing campaign",
        "10000000000000000"
        )
        .send({from:accounts[0], gas: 6000000});

    console.log("Getting created campaigns,...");
    const campaigns = await campaignManager.methods.getCampagins()
        .call({from:accounts[0]});

    console.log(`Last created campaign address: ${campaigns[campaigns.length - 1]}`);

    const campaign = new web3.eth.Contract(JSON.parse(Campaign.interface), campaigns[campaigns.length - 1]);

    console.log(`Donate to ${campaigns[campaigns.length - 1]}`);
    await campaign.methods.donate()
        .send({from: accounts[0], gas:6000000, value:web3.utils.toWei('0.02', 'ether')});
    
    console.log("Donated...");

    const donated = await campaign.methods.getTotalDonations()
        .call({from:accounts[0]});
    console.log('Total donated:', donated);
    
    const donors = await campaign.methods.getDonors()
        .call({from:accounts[0]});
    console.log('First donor:', donors[0]);
};

createCampaignAndDonate();