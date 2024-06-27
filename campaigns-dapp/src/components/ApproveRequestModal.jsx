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

const ApproveRequestModal = ({isOpen, onClose, campaignAddress, index, fetchCampaignDetails}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const approve = async () => {
        setIsSubmitting(true);

        const campaignContract = CampaignContract(campaignAddress);
        const accounts = await web3.eth.getAccounts();

        console.log("BEFORE APPROVE");
        await campaignContract.methods.approveRequest(index)
            .send({from:accounts[0], gas:'5000000'});
        console.log("AFTER APPROVE");

        setIsSubmitting(false);
        onClose();
        fetchCampaignDetails();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure you want to approve this request?</ModalHeader>
            <ModalCloseButton />
            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button 
                    colorScheme='blue'
                    onClick={() => approve()}
                    isLoading={isSubmitting}
                >
                    Approve
                </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    )
}

export default ApproveRequestModal;