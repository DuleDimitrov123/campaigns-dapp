import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Stack,Text } from "@chakra-ui/react";
import React  from "react";

const RequestCard = ({request}) => {
    console.log(request);
    return(
        <Card background={'gray.50'}>
            <CardHeader>
                <Heading size='md'>{request.description}</Heading>
            </CardHeader>
            <CardBody>
                <Stack spacing='3'>
                    <Text>{request.desc}</Text>
                    <Text>{request.val} wei requested</Text>
                    <Text>
                        {request.compl
                        ? 'completed'
                        : 'not completed'}
                    </Text>
                </Stack>
            </CardBody>
            <CardFooter>
                <Button colorScheme="blue" >Approve</Button>
            </CardFooter>
        </Card>
    )
}

export default RequestCard;