import { Flex, Heading } from "@chakra-ui/react";

const Campaign = () => {
    return(
        <Flex w='100%' h='93vh' p='4' flexDir={'column'} gap='10' background={'gray.50'}>
            <Heading as='h2' size='2xl'>
                Campaign
            </Heading>
        </Flex>
    )
}

export default Campaign;