import Web3 from "web3";
const ganache = require('ganache-cli');

let web3;

// if (typeof window != 'undefined' && typeof window.web3 !== 'undefined') {
//     //Metamask is available
//     web3 = new Web3(window.web3.currentProvider);
//     console.log("metamask")
//     window.ethereum.request({ method: 'eth_requestAccounts' });
// } else {
//     console.log("custom")
//     // Metamask is not available, use Infura
//     const provider = new Web3.providers.HttpProvider(
//         'https://sepolia.infura.io/v3/6a0cfddad38546c5876a302d4e38a409'
//     );
//     web3 = new Web3(provider);
// }
web3 = new Web3(ganache.provider())//just for local testing

export default web3;