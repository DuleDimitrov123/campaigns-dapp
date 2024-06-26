import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import CampaignContract from '../ethereum/campaignContract';
import web3 from "../ethereum/web3";

const DonateModal = ({isOpen, onClose, campaignAddress, fetchCampaignDetails}) => {
    console.log(fetchCampaignDetails);
    const initialValues={donationValue:''};

    const validateDonationValue = (value) => {
        let error;
        if (!value) {
            error = 'Donation value is required';
        } else if (isNaN(value)) {
            error = 'Donation value must be a number';
        } else if (parseFloat(value) <= 0) {
            error = 'Donation value must be greater than zero';
        }
        return error;
      };

    const donate = async (values, formikActions) => {
        const campaignContract = CampaignContract(campaignAddress);
        const accounts = await web3.eth.getAccounts();

        const donationWei = web3.utils.toWei(`${values.donationValue}`, 'ether');

        await campaignContract.methods.donate()
            .send({
                from:accounts[0], 
                value: donationWei,
                gas:'5000000'});

        formikActions.setSubmitting(false);
        onClose();
        fetchCampaignDetails();
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Donate</ModalHeader>
            <ModalCloseButton />
            <Formik
                initialValues={initialValues}
                onSubmit={async (values, actions) => donate(values, actions)}
            >
            {(props) => (
                <Form>
                    <ModalBody>
                        <Field name='donationValue' validate={validateDonationValue}>
                            {({ field, form}) => (
                                <FormControl isInvalid={form.errors.donationValue && form.touched.donationValue}>
                                    <FormLabel>Donation value in ETH</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder='Enter donation value...'
                                        size='sm'
                                        type='number'
                                        step='0.01'
                                    />
                                    <FormErrorMessage>{form.errors.donationValue}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button 
                            colorScheme='blue'
                            type='submit'
                            isLoading={props.isSubmitting}
                        >
                            Done
                        </Button>
                    </ModalFooter>
                </Form>
            )}
            </Formik>
          </ModalContent>
        </Modal>
    )
}

export default DonateModal;