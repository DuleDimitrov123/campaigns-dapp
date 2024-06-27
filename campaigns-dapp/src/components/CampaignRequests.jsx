import { Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import RequestCard from "./RequestCard";

const CampaignRequests = ({requests, campaignAddress, fetchCampaignDetails}) => {
    return(
            <Flex flex='1' flexDir={'column'} gap='5' p='4' background={'gray.50'} border="2px"  borderRadius='10' borderColor="gray.200" >
                <Text fontSize='xl' fontWeight={'700'}>
                    Requests for this campaign:
                </Text>
                <Flex spacing={4} flexDir='column' templateColumns="repeat(2, 1fr)" overflow={'auto'} gap='2' >
                    {requests?.map((request, index) => (
                        <RequestCard 
                            key={index} 
                            request={request}  
                            index={index} 
                            campaignAddress={campaignAddress}
                            fetchCampaignDetails={fetchCampaignDetails}
                        />
                    ))}
                </Flex>
            </Flex>

    )
}

export default CampaignRequests;