import { FormControl, FormLabel, Input,Button, FormErrorMessage,Flex,Heading, Box,Textarea  } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import CampaignManagerContract from "../ethereum/campaignManagerContract";
import web3 from "../ethereum/web3";

const CreateCampaign = () => {
    const initialValues={title:'',description:'',minDonationInWei:''};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const validateTitle = (value) => {
        let error;
        if (!value) {
          error = 'Title is required';
        } 
        return error;
      }

    const validateDescription = (value) => {
        let error;
        if (!value) {
            error = 'Description is required';
        } 
        return error;
    }

    const validateMinDonationInWei = (value) => {
        let error;
        if (!value) {
            error = 'Min donation in Wei is required';
        } 
        return error;
    }

    const createNewCampaign = async (campaign, formikActions) => {
        const campaignManagerContract = CampaignManagerContract();
        const accounts = await web3.eth.getAccounts();
        //console.log(accounts);
        await campaignManagerContract.methods.createCampaign(
            accounts[0],
            campaign.title,
            campaign.description,
            campaign.minDonationInWei
        )
        .send({from:accounts[0], gas:'5000000'});

        console.log("Created...");

        formikActions.setSubmitting(false)
        navigate(`/`);
    }
     
    return (
        <Flex w='100%' h='93vh' p='4' flexDir={'column'} gap='10'>
            <Heading as='h2' size='2xl'>
                Add new Campaign
            </Heading>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values, actions) => createNewCampaign(values, actions)}
            >
            {(props) => (
                <Box p='6' px={4} border="2px" borderColor="gray.200" width='50%'>
                    <Form>
                        <Field name='title' validate={validateTitle}>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.title && form.touched.title}>
                                <FormLabel>Title</FormLabel>
                                <Input {...field} placeholder='Enter title...' />
                                <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Field name='description' validate={validateDescription}>
                            {({ field, form }) => (
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
                        <Field name='minDonationInWei' validate={validateMinDonationInWei}>
                            {({ field, form }) => (
                            <FormControl isInvalid={form.errors.minDonationInWei && form.touched.minDonationInWei}>
                                <FormLabel>Min donation in Wei</FormLabel>
                                <Input {...field} placeholder='Enter min donation in wei...' />
                                <FormErrorMessage>{form.errors.minDonationInWei}</FormErrorMessage>
                            </FormControl>
                            )}
                        </Field>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={props.isSubmitting}
                            type='submit'
                        >
                            Submit
                        </Button>
                    </Form>
                </Box>
            )}
            </Formik>
        </Flex>
    )
}

export default CreateCampaign;