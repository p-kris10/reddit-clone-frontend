import React from "react";
import {Formik,Form} from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrormap";
import router, { Router } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface registerProps{}



const Register : React.FC<registerProps> = ({}) =>{
    const [,register]= useRegisterMutation();
    return (
        <Wrapper variant="small">
       <Formik initialValues={{username:"",email:"",password:""}}
       onSubmit = {async (values,{setErrors}) =>{
           const response = await register({options : values});
           if(response.data?.register.errors)
           {
             setErrors(
               toErrorMap(response.data?.register.errors)
             )
           }
           else if (response.data?.register.user)
           {
             router.push('/')
           }
           }}>
           {
               ({isSubmitting}) => (
                   <Form>
                    <InputField 
                    name='username' 
                    label="Username"
                    placeholder="username"/>
                      <Box mt={3}>
                        <InputField 
                        name='email' 
                        label="Email"
                        placeholder="email"/>
                    </Box>
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
                    colorScheme='green'>register</Button>
                   </Form>
                  
            )}
       </Formik>
       </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient)(Register);