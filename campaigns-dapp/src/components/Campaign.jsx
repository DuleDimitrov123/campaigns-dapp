import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CampaignContract from "../ethereum/campaignContract";
import web3 from "../ethereum/web3";
import CampaignInfo from "./CampaignInfo";
import CampaignRequests from "./CampaignRequests";

const Campaign = () => {
    const { address } = useParams();

    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState({
        organiser: '',
        title: '',
        description: '',
        minDonationInEth: '',
        requests: []
    });
    const [totalDonationsInEth, setTotalDonationsInEth] = useState(0);
    const [donors, setDonors] = useState(0);

    const fetchCampaignDetails = async () => {
        setLoading(true);
        var campaignContract = CampaignContract(address);

        const organiser = await campaignContract.methods.organiser().call();
        const title = await campaignContract.methods.title().call();
        const description = await campaignContract.methods.description().call();
        const minDonationInWei = await campaignContract.methods.minDonationInWei().call();
        const minDonationInEth = web3.utils.fromWei(minDonationInWei, 'ether');
        const requestsCount = await campaignContract.methods.getRequestCount().call();

        let requests = [];
        console.log(requestsCount);
        for (let i=0; i<= requestsCount - 1; i++) {
            let request = await campaignContract.methods.getRequest(i).call();
            request.val = web3.utils.fromWei(request.val, 'ether')
            request.approvers = await campaignContract.methods.getApprovers(i).call();
            requests.push(request);
        }

        setCampaign({
            organiser: organiser,
            title: title,
            description: description,
            minDonationInEth: minDonationInEth,
            requests:requests
        });

        var totalDonationsInWei = await campaignContract.methods.getTotalDonations().call();
        setTotalDonationsInEth(web3.utils.fromWei(totalDonationsInWei, 'ether'));

        setDonors(await campaignContract.methods.getDonors().call());

        setLoading(false);
    }

    useEffect(() => {
        fetchCampaignDetails();
    }, []);

    if (loading) {
        return (
            <Flex w="100%" h="97vh" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return(
        <Flex flexDir={'row'} gap='30' h='93vh'  p='4'>
            <CampaignInfo 
                campaign={campaign} 
                totalDonationsInEth={totalDonationsInEth} 
                fetchCampaignDetails={fetchCampaignDetails}
                donors={donors}
            />
            <CampaignRequests 
                requests={campaign?.requests} 
                campaignAddress={address}
                fetchCampaignDetails={fetchCampaignDetails} 
            />
        </Flex>
    )
}

export default Campaign;