import React  from "react";
import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CampaignCard = ({campaign}) => {
  const navigate = useNavigate();
  
  const viewCampaign = () => {
    navigate(`/campaign/${campaign?.address}`);
  }
  
    return(
      <Card background={'gray.50'}>
        <CardHeader>
          <Heading size='md'> {campaign?.title}</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing='3'>
            <Text fontSize={'md'}>{campaign?.description}</Text>
            <Flex gap='1' alignItems={'start'} flexDir={'column'}>
              <Text fontSize={'md'} color='gray.500'>Minimum donation in ETH:</Text>
              <Text color='blue.600' fontSize='xl'> {campaign?.minDonationInEth} </Text>
            </Flex>
            <Flex gap='1' alignItems={'start'} flexDir={'column'}>
              <Text fontSize={'md'} color='gray.500'>Organiser:</Text>
              <Text color='blue.600' fontSize='xl'> {campaign?.organiser} </Text>
            </Flex>
          </Stack>
        </CardBody>
        <CardFooter>
          <Button  colorScheme="blue" onClick={()=> viewCampaign()}>View Campaign</Button>
        </CardFooter>
      </Card>
    )
}

export default CampaignCard;