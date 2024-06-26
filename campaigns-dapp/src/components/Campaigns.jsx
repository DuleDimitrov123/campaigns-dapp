import React, { useEffect, useState } from "react";
import web3 from "../ethereum/web3";
import CampaignManagerContract from "../ethereum/campaignManagerContract";
import CampaignContract from '../ethereum/campaignContract';
import { Flex, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
import CampaignCard from "./CampaignCard";

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCampaigns = async () => {
            setLoading(true);
            const campaignManagerContract = CampaignManagerContract();
            const accounts = await web3.eth.getAccounts();
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
            setLoading(false);
        }
        getCampaigns();
    }, [])

    if (loading) {
        return (
            <Flex w="100%" h="97vh" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return(
        <Flex w='100%' h='93vh' p='4' flexDir={'column'} gap='10'>
            <Heading as='h2' size='2xl'>
                All Campaignes
            </Heading>
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(400px, 1fr))' >
                {campaigns?.map((campaign, index)=>(
                    <CampaignCard key={index} campaign={campaign} />
                ))}
            </SimpleGrid>
        </Flex>
    )
}

export default Campaigns;