import { Flex, Heading, Spinner, Stack, Text, Button, useDisclosure, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CampaignContract from "../ethereum/campaignContract";
import CreateRequestModal from "./CreateRequestModal";
import RequestCard from "./RequestCard";
import DonateModal from "./DonateModal";

const Campaign = () => {
    const { address } = useParams();

    const [loading, setLoading] = useState(false);
    const [campaign, setCampaign] = useState({
        organiser: '',
        title: '',
        description: '',
        minDonationInWei: '',
        requests: []
    });
    const [totalDonations, setTotalDonations] = useState(0);

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
            const requestsCount = await campaignContract.methods.getRequestCount().call();

            let requests = [];
            console.log(requestsCount);
            for (let i=0; i<= requestsCount - 1; i++) {
                requests.push(await campaignContract.methods.getRequest(i).call());
            }

            setCampaign({
                organiser: organiser,
                title: title,
                description: description,
                minDonationInWei: minDonationInWei,
                requests:requests
            });

            setTotalDonations(await campaignContract.methods.getTotalDonations().call());

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
        <Flex w='100%' h='10%' flexDir={'column'} >
            <Flex flexDir={'row'}>
                <Flex w='65%' h='93vh' p='4' flexDir={'column'} gap='10' background={'gray.50'}>
                    <Heading as='h2' size='2xl'>
                        Campaign: {campaign?.title}
                    </Heading>
                    <Stack mt="6" spacing="3">
                        <Text fontSize={'md'}>{campaign?.description}</Text>
                        <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                            <Text fontSize={'md'} color='gray.500'>Minimum donation in Wei:</Text>
                            <Text color='blue.600' fontSize='xl'>{campaign?.minDonationInWei}</Text>
                        </Flex>
                        <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                            <Text fontSize={'md'} color='gray.500'>Organiser:</Text>
                            <Text color='blue.600' fontSize='xl'> {campaign?.organiser} </Text>
                        </Flex>
                        <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                            <Text fontSize={'md'} color='gray.500'>Total donations in wei:</Text>
                            <Text color='blue.600' fontSize='xl'> {totalDonations} </Text>
                        </Flex>
                    </Stack>
                </Flex>
                <Flex flexDir={'column'}>
                    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 0.5fr))' >
                        {campaign?.requests?.map((request, index) => (
                            <RequestCard key={index} request={request} />
                        ))}
                    </SimpleGrid>
                </Flex>
            </Flex>
            <Flex gap='3' alignItems={'start'}>
                <Button onClick={onCreateRequestModalOpen} colorScheme="blue" >Add request</Button>
                <CreateRequestModal isOpen={isCreateRequestModalOpen} onClose={onCreateRequestModalClose} campaignAddress={address}  />

                <Button onClick={onDonateModalOpen} colorScheme="blue" >Donate</Button>
                <DonateModal isOpen={isDonateModalOpen} onClose={onDonateModalClose} />
            </Flex>
        </Flex>
    )
}

export default Campaign;