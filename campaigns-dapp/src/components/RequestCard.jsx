import { Button, 
    Card, 
    CardBody, 
    CardFooter, 
    CardHeader, 
    Flex, 
    Heading, 
    Stack,
    Text,
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList, useDisclosure } from "@chakra-ui/react";
import React  from "react";
import ApproveRequestModal from "./ApproveRequestModal";
import FinalizeRequestModal from "./FinalizeRequestModal";

const RequestCard = ({request, campaignAddress, index, fetchCampaignDetails}) => {
    console.log(request);
    const {isOpen: isApproveRequestModalOpen, onOpen: onApproveRequestModalOpen, onClose: onApproveRequestModalClose} = useDisclosure();
    const {isOpen: isFinalizeRequestModalOpen, onOpen: onFinalizeRequestModalOpen, onClose: onFinalizeRequestModalClose} = useDisclosure();

    const approve = async () => {
        onApproveRequestModalOpen();
    }

    const finalize = async () => {
        onFinalizeRequestModalOpen();
    }

    return(
        <Card >
            <CardHeader>
                <Text fontSize='lg' fontWeight={'700'}>Request {index+1}</Text>
            </CardHeader>
            <CardBody>
                <Stack spacing='3'>
                    <Flex gap='1'>
                        <Text fontWeight={'700'}>Description:</Text>
                        <Text>{request.desc}</Text>
                    </Flex>
                    <Flex gap='1'>
                        <Text fontWeight={'700'}>Requested ETH:</Text>
                        <Text> {request.val}</Text>
                    </Flex>
                    <Flex gap='1'>
                        <Text fontWeight={'700'}>Status:</Text>
                        <Text>
                            {request.compl
                                ? 'Completed'
                                : 'Not Completed'}
                        </Text>
                    </Flex>
                    <Flex gap='1'>
                        <Text fontWeight={'700'}>Number of approvers:</Text>
                        <Text> {request.apprCount}</Text>
                    </Flex>
                    <Flex gap='1' flexDir={'column'}>
                        <Text fontWeight={'700'}>Approvers:</Text>
                        <UnorderedList>
                            {request.approvers.map((approver, index) => (
                                <ListItem key={index}>{approver}</ListItem>
                            ))}
                        </UnorderedList>
                    </Flex>
                </Stack>
            </CardBody>
            <CardFooter gap={3}>
                <Button colorScheme="blue" onClick={() => approve()}>Approve</Button>
                <Button colorScheme="blue" onClick={() => finalize()}>Finalize</Button>
            </CardFooter>
            <ApproveRequestModal 
                isOpen={isApproveRequestModalOpen} 
                onClose={onApproveRequestModalClose} 
                campaignAddress={campaignAddress} 
                index={index}
                fetchCampaignDetails={fetchCampaignDetails}
            />
            <FinalizeRequestModal 
                isOpen={isFinalizeRequestModalOpen} 
                onClose={onFinalizeRequestModalClose} 
                campaignAddress={campaignAddress} 
                index={index}
                fetchCampaignDetails={fetchCampaignDetails}
            />
        </Card>
    )
}

export default RequestCard;