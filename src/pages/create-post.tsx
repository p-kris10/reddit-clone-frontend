import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { Layout } from '../components/Layout';
import { Wrapper } from '../components/wrapper';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import {useMeQuery} from "../generated/graphql";
import { useIsAuth } from '../utils/useisAuth';

const CreatePost: React.FC<{}> = ({}) => {
    const [{data,fetching}] = useMeQuery();
    const router = useRouter();
    useIsAuth();
    const [,createPost] = useCreatePostMutation();
        return (
            <Layout variant="small">
                <Formik initialValues={{title:"",text:""}}
       onSubmit = {async (values) =>{
           const {error} =  await createPost({input : values});
           if(!error)
           {
                router.push('/');
           }
           
           }}>
           {
               ({isSubmitting}) => (
                   <Form>
                    <InputField 
                    name='title' 
                    label="Title"
                    placeholder="title"/>
                    <Box mt={3}>
                        <InputField 
                        textarea
                        name='text' 
                        label="Body"
                        placeholder="text..."
                        />
                    </Box>
                    <Button mt={4} 
                    isLoading ={isSubmitting} 
                    type="submit" 
                    colorScheme='green'>Create Post</Button>
                   </Form>
                  
            )}
       </Formik> 

        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(CreatePost);