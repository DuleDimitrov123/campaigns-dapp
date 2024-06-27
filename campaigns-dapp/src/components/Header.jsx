import React from 'react';
import { Box, Flex, Link, HStack, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const Header = () => {

  return (
    <Box bg="gray.50" px={4} borderBottom="2px" borderColor="gray.200" h='7vh'>
      <Flex h={'100%'} alignItems="center" justifyContent="space-between">
        <Box>
          <Text fontWeight={'700'} color='blue.500' >CAMPAIGNS DAPP</Text>
        </Box>
        <HStack as="nav" spacing={4}>
          <Link as={NavLink} to="/" style={({ isActive }) => ({
            fontWeight: isActive ? 'bold' : 'normal'
          })}>
            Campaigns
          </Link>
          <Link as={NavLink} to="/campaign/new" style={({ isActive }) => ({
            fontWeight: isActive ? 'bold' : 'normal'
          })}>
            Add campaign
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;