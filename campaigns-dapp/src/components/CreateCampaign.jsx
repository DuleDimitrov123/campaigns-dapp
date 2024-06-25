import { FormControl, FormLabel, Input,Button, FormErrorMessage,Flex,Heading, Box,Textarea  } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
    const initialValues={title:'',description:'',minDonationInWei:''};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    function validateTitle(value) {
        let error
        if (!value) {
          error = 'Title is required'
        } 
        return error
      }
      function validateDescription(value) {
        let error
        if (!value) {
          error = 'Description is required'
        } 
        return error
      }
      function validateMinDonationInWei(value) {
        let error
        if (!value) {
          error = 'Min donation in Wei is required'
        } 
        return error
      }
    
      return (
        <Flex w='100%' h='93vh' p='4' flexDir={'column'} gap='10'>
        <Heading as='h2' size='2xl'>
            Add new Campaign
        </Heading>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            setTimeout(() => {
                console.log("values",values)
              actions.setSubmitting(false)
              navigate(`/`);
            }, 1000)
          }}
        >
          {(props) => (
            <Box p='6'  px={4} border="2px" borderColor="gray.200" width='50%'>
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