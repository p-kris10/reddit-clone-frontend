import React from "react";
import {Formik,Form} from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button, Flex, Link } from "@chakra-ui/react";
import { Wrapper } from "../components/wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrormap";
import router, { Router } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link';
interface LoginProps{}



const Login : React.FC<{}> = ({}) =>{
    const [,login]= useLoginMutation();
    console.log(router);
    return (
      <Wrapper variant="small">
       <Formik initialValues={{usernameOrEmail:"",password:""}}
       onSubmit = {async (values,{setErrors}) =>{
           const response = await login(values);
           if(response.data?.login.errors)
           {
             setErrors(
               toErrorMap(response.data?.login.errors)
             )
           }
           else if (response.data?.login.user)
           {
             if(typeof router.query.next === "string")
             {
               router.push(router.query.next)
             }
             else
             {
              router.push('/')
             }
            
           }
           }}>
           {
               ({isSubmitting}) => (
                   <Form>
                    <InputField 
                    name='usernameOrEmail' 
                    label="Username or Email"
                    placeholder="username or email"/>
                    <Box mt={3}>
                        <InputField 
                        name='password' 
                        label="Password"
                        placeholder="password"
                        type="password" />
                    </Box>
                    <Flex mt={2}>
                      <NextLink href={'/forgot-password'}>
                          <Link ml='auto'>forgot password?</Link>
                      </NextLink>
                    </Flex>
                    <Button mt={4} 
                    isLoading ={isSubmitting} 
                    type="submit" 
                    colorScheme='green'>Login</Button>
                   </Form>
                  
            )}
       </Formik>
       </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Login);