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
  Textarea,
  FormErrorMessage
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import CampaignContract from '../ethereum/campaignContract';
import web3 from "../ethereum/web3";

const DonateModal = ({isOpen, onClose}) => {
    const initialValues={donationValue:''};

    const validateDonationValue = (value) => {
        let error;
        if (!value) {
          error = 'Request value is required';
        } 
        return error;
      }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Donate</ModalHeader>
            <ModalCloseButton />
            <Formik
                initialValues={initialValues}
            >
            {(props) => (
                <Form>
                    <ModalBody>
                        <Field name='donationValue' validate={validateDonationValue}>
                            {({ field, form}) => (
                                <FormControl isInvalid={form.errors.donationValue && form.touched.donationValue}>
                                    <FormLabel>Donation value</FormLabel>
                                    <Textarea
                                        {...field} placeholder='Enter donation value...'
                                        size='sm'
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