import React from "react";
import {Formik,Form} from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrormap";
import router, { Router } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface LoginProps{}



const Login : React.FC<{}> = ({}) =>{
    const [,login]= useLoginMutation();
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
             router.push('/')
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