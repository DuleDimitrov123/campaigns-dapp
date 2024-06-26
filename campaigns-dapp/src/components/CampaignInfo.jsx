import { Flex, Heading, Stack, Text, Button, useDisclosure, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import CreateRequestModal from "./CreateRequestModal";
import DonateModal from "./DonateModal";


const CampaignInfo = ({campaign, totalDonationsInEth, fetchCampaignDetails, numberOfDonors}) => {
    const { address } = useParams();

    const { isOpen: isCreateRequestModalOpen, onOpen: onCreateRequestModalOpen, onClose: onCreateRequestModalClose } = useDisclosure();
    const { isOpen: isDonateModalOpen, onOpen: onDonateModalOpen, onClose: onDonateModalClose } = useDisclosure();

    return(
        <Flex flex='1' p='4' flexDir={'column'} gap='10'>
            <VStack align="start" spacing="6">
                <Heading as='h2' size='2xl'>
                    Campaign: {campaign?.title}
                </Heading>
                <Stack mt="6" spacing="3">
                <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                <Text fontSize={'md'} color='gray.500'>Description:</Text>
                    <Text fontSize={'md'}>{campaign?.description}</Text>
                    </Flex>
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
                    <Flex gap='1' alignItems={'start'} flexDir={'column'}>
                        <Text fontSize={'md'} color='gray.500'>Number of donors:</Text>
                        <Text color='blue.600' fontSize='xl'> {numberOfDonors} </Text>
                    </Flex>
                </Stack>
            </VStack>
            <Flex gap='10'>
                <Button onClick={onCreateRequestModalOpen} colorScheme="blue" >Create request</Button>
                <Button onClick={onDonateModalOpen} colorScheme="blue" >Donate</Button>
            </Flex>
            <CreateRequestModal isOpen={isCreateRequestModalOpen} onClose={onCreateRequestModalClose} campaignAddress={address} fetchCampaignDetails={fetchCampaignDetails}  />
            <DonateModal isOpen={isDonateModalOpen} onClose={onDonateModalClose} campaignAddress={address} fetchCampaignDetails={fetchCampaignDetails} />
        </Flex>
    )
}

export default CampaignInfo;