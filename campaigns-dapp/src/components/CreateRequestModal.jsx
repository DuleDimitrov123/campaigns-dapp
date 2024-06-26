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
  FormErrorMessage,
  Input
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

import CampaignContract from '../ethereum/campaignContract';
import web3 from "../ethereum/web3";

const CreateRequestModal = ({ isOpen, onClose, campaignAddress, fetchCampaignDetails }) => {

    console.log(fetchCampaignDetails);

    const initialValues={description:'', value:''};

    const validateValue = (value) => {
        let error;
        if (!value) {
            error = 'Request value is required';
        } else if (isNaN(value)) {
            error = 'Request value must be a number';
        } else if (parseFloat(value) <= 0) {
            error = 'Request value must be greater than zero';
        }
        return error;
      }

    const validateDescription = (value) => {
        let error;
        if (!value) {
            error = 'Request description is required';
        } 
        return error;
    }

    const createNewRequest = async (request, formikActions) => {
        const campaignContract = CampaignContract(campaignAddress);
        const accounts = await web3.eth.getAccounts();

        const valueInWei = web3.utils.toWei(`${request.value}`, 'ether');
        await campaignContract.methods.createRequest(request.description, valueInWei)
            .send({from:accounts[0], gas:'5000000'});

        formikActions.setSubmitting(false);
        console.log("Before onClose")
        onClose();
        console.log("After onClose")
        fetchCampaignDetails();
        console.log("After fetch")
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create campaign request</ModalHeader>
            <ModalCloseButton />
            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => createNewRequest(values, actions)}
            >
            {(props) => (
                <Form>
                    <ModalBody>
                        <Field name='description' validate={validateDescription}>
                            {({ field, form}) => (
                                <FormControl isInvalid={form.errors.description && form.touched.description}>
                                    <FormLabel>Description</FormLabel>
                                    <Textarea
                                        {...field} placeholder='Enter description...'
                                        size='sm'
                                    />
                                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='value' validate={validateValue}>
                            {({ field, form}) => (
                                <FormControl isInvalid={form.errors.value && form.touched.value}>
                                    <FormLabel>Value in ETH for campaign request</FormLabel>
                                    <Input
                                        {...field}
                                        placeholder='Enter value...'
                                        size='sm'
                                        type='number'
                                        step='0.01'
                                    />
                                    <FormErrorMessage>{form.errors.value}</FormErrorMessage>
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
                            Add request
                        </Button>
                    </ModalFooter>
                </Form>
            )}
            </Formik>
          </ModalContent>
        </Modal>
    )
}

export default CreateRequestModal;