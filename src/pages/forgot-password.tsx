import { Box, Flex, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import Link from 'next/link';
import router from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrormap';
import login from './login';


export const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete ,setComplete] = useState(false);
    const [,forgotPassword] = useForgotPasswordMutation();
        return (
    <Wrapper variant="small">
       <Formik initialValues={{email: ""}}
       onSubmit = {async (values) =>{
           await forgotPassword(values);
           setComplete(true);
           }}>
           {
               ({isSubmitting}) =>
               complete?(<Box>If an account with that email exists,we sent you an email</Box>):
                (
                   <Form>
                    <InputField 
                    name='email' 
                    label="Email"
                    placeholder="email"
                    type="email"/>
                    
                    <Button mt={4} 
                    isLoading ={isSubmitting} 
                    type="submit" 
                    colorScheme='green'>Send Reset Link</Button>
                   </Form>
                  
            )}
       </Formik>
       </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);