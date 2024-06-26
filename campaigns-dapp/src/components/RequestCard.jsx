import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Stack,Text } from "@chakra-ui/react";
import React  from "react";

const RequestCard = ({request}) => {
    console.log(request);
    const approve = async () => {
        console.log("APPROVE!");
    }

    const finalize = async () => {
        console.log("FINALIZE");
    }

    return(
        <Card background={'gray.50'}>
            <CardHeader>
                <Heading size='md'>{request.description}</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing='3'>
                    <Text>{request.desc}</Text>
                    <Text>{request.val} ETH requested</Text>
                    <Text>
                        {request.compl
                        ? 'completed'
                        : 'not completed'}
                    </Text>
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