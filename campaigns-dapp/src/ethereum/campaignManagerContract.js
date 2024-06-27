import web3 from "./web3";
import CampaignManager from './build/CampaignManager.json';
import { address } from "./contractAddress";

export default () => {
    return new web3.eth.Contract(
        JSON.parse(CampaignManager.interface),
        address
    );
}