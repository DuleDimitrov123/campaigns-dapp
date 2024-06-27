import { useState } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter
  } from '@chakra-ui/react';

import CampaignContract from "../ethereum/campaignContract";
import web3 from "../ethereum/web3";

const FinalizeRequestModal = ({isOpen, onClose, campaignAddress, index, fetchCampaignDetails}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const finalize = async () => {
        setIsSubmitting(true);

        const campaignContract = CampaignContract(campaignAddress);
        const accounts = await web3.eth.getAccounts();

        //real finalizing

        setIsSubmitting(false);
        onClose();
        fetchCampaignDetails();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure you want to finalize this request?</ModalHeader>
            <ModalCloseButton />
            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button 
                    colorScheme='blue'
                    onClick={() => finalize()}
                    isLoading={isSubmitting}
                >
                    Finalize
                </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    )
}

export default FinalizeRequestModal;