import React, { useEffect, useState } from "react";
import web3 from "../ethereum/web3";
import CampaignManagerContract from "../ethereum/campaignManagerContract";
import CampaignContract from '../ethereum/campaignContract';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const getCampaigns = async () => {
            const campaignManagerContract = CampaignManagerContract();
            const accounts = await web3.eth.getAccounts();
            //console.log(accounts[0]);
            const campaignAddresses = await campaignManagerContract.methods.getCampagins()
                .call({from:accounts[0]});
            console.log(campaignAddresses);

            let campaigns = await Promise.all(
                Array(campaignAddresses.length).fill().map( async (element, i) => {
                    const campaignContract = CampaignContract(campaignAddresses[i]);
                    let campaign = {
                        address:campaignAddresses[i]
                    }
                    await Promise.all(
                        campaign["organiser"] = await campaignContract.methods.organiser().call(),
                        campaign["title"] = await campaignContract.methods.title().call(),
                        campaign["description"] = await campaignContract.methods.description().call(),
                        campaign["minDonationInWei"] = await campaignContract.methods.minDonationInWei().call(),
                    )
                    return campaign;
                })
            );

            setCampaigns(campaigns);
        }
        getCampaigns();
    }, [])

    return(
        <div>CAMPAIGNS</div>
    )
}

export default Campaigns;