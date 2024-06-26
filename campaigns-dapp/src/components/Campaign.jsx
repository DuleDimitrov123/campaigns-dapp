import { Flex, Heading, Spinner, Stack, Text, Button, useDisclosure, SimpleGrid, VStack, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CampaignContract from "../ethereum/campaignContract";
import CreateRequestModal from "./CreateRequestModal";
import RequestCard from "./RequestCard";
import DonateModal from "./DonateModal";

import web3 from "../ethereum/web3";

const Campaign = () => {
    const { address } = useParams();

    //const valueInEth = web3.utils.fromWei(valueInWei, 'ether');

    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState({
        organiser: '',
        title: '',
        description: '',
        minDonationInEth: '',
        requests: []
    });
    const [totalDonationsInEth, setTotalDonationsInEth] = useState(0);

    const { isOpen: isCreateRequestModalOpen, onOpen: onCreateRequestModalOpen, onClose: onCreateRequestModalClose } = useDisclosure();
    const { isOpen: isDonateModalOpen, onOpen: onDonateModalOpen, onClose: onDonateModalClose } = useDisclosure();

    useEffect(() => {
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

            setLoading(false);
        }
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
        <Flex flexDir={'row'} gap='30'>
            <Flex w='50%' h='93vh' p='4' flexDir={'column'} gap='10' background={'gray.50'}>
                <VStack align="start" spacing="6">
                    <Heading as='h2' size='2xl'>
                        Campaign: {campaign?.title}
                    </Heading>
                    <Stack mt="6" spacing="3">
                        <Text fontSize={'md'}>{campaign?.description}</Text>
                        <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                            <Text fontSize={'md'} color='gray.500'>Minimum donation in ETH:</Text>
                            <Text color='blue.600' fontSize='xl'>{campaign?.minDonationInEth}</Text>
                        </Flex>
                        <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                            <Text fontSize={'md'} color='gray.500'>Organiser:</Text>
                            <Text color='blue.600' fontSize='xl'> {campaign?.organiser} </Text>
                        </Flex>
                        <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                            <Text fontSize={'md'} color='gray.500'>Total donations in ETH:</Text>
                            <Text color='blue.600' fontSize='xl'> {totalDonationsInEth} </Text>
                        </Flex>
                    </Stack>
                </VStack>
                <Flex gap='10'>
                    <Button onClick={onCreateRequestModalOpen} colorScheme="blue" >Add request</Button>
                    <CreateRequestModal isOpen={isCreateRequestModalOpen} onClose={onCreateRequestModalClose} campaignAddress={address}  />

                    <Button onClick={onDonateModalOpen} colorScheme="blue" >Donate</Button>
                    <DonateModal isOpen={isDonateModalOpen} onClose={onDonateModalClose} campaignAddress={address} />
                </Flex>
            </Flex>
            <Flex w='50%' flexDir={'column'} gap='5'>
                <Heading as='h3' size='2xl'>
                    Requests for this campaign
                </Heading>
                <SimpleGrid spacing={4} templateColumns="repeat(2, 1fr)" >
                    {campaign?.requests?.map((request, index) => (
                        <RequestCard key={index} request={request} />
                    ))}
                </SimpleGrid>
            </Flex>
        </Flex>
    )
}

export default Campaign;