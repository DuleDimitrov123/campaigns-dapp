import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Stack,Text } from "@chakra-ui/react";
import React  from "react";

const RequestCard = ({request,index}) => {
    console.log(request);
    const approve = async () => {
        console.log("APPROVE!");
    }

    const finalize = async () => {
        console.log("FINALIZE");
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
                  
                </Stack>
            </CardBody>
            <CardFooter gap={3}>
                <Button colorScheme="blue" onClick={() => approve()}>Approve</Button>
                <Button colorScheme="blue" onClick={() => finalize()}>Finalize</Button>
            </CardFooter>
        </Card>
    )
}

export default RequestCard;