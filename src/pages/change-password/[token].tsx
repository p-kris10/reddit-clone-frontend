import { Box, Button, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router, { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/wrapper';
import { toErrorMap } from '../../utils/toErrormap';
import login from '../login';
import {useChangePasswordMutation} from "../../generated/graphql"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from "next/link"
export const ChangePasssword: NextPage<{token: string}> = ({token}) => {
        const router = useRouter()
        const [,changePassword] = useChangePasswordMutation();
        const [tokenError,setTokenError] = useState('');
                return (     
                <Wrapper variant="small">
                <Formik initialValues={{newPassword:""}}
                onSubmit = {async (values,{setErrors}) =>{
                        const response = await changePassword({
                                newPassword : values.newPassword,
                                token,
                        })
                        
                        if(response.data?.changePassword.errors)
                        {
                                const errorMap = toErrorMap(response.data?.changePassword.errors)
                                if('token' in errorMap){
                                        setTokenError(errorMap.token)
                                }
                                setErrors(errorMap)
                        }
                        else if (response.data?.changePassword.user)
                        {
                        router.push('/')
                        }
                        }}>
                        {
                        ({isSubmitting}) => (
                                <Form>
                                <InputField 
                                name='newPassword' 
                                label="new password"
                                placeholder="New Password"
                                type="password"/>
                                {tokenError ?
                                <Box>
                                  <Box color="red">{tokenError}</Box>
                                  <NextLink href={'/forgot-password'}>
                                        <Link>Go request new token again</Link>
                                  </NextLink>
                                </Box> 
                                 : null}
                                <Button mt={4} 
                                isLoading ={isSubmitting} 
                                type="submit" 
                                colorScheme='green'>Change Password</Button>
                                </Form>
                                
                        )}
                </Formik>
                </Wrapper>);
}

ChangePasssword.getInitialProps = ({query}) =>{
        return{
                token : query.token as string
        }
}

export default withUrqlClient(createUrqlClient)(ChangePasssword);


