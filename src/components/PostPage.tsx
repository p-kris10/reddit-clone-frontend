import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { Form, Formik,} from 'formik';
import { resetClient } from 'next-urql/dist/types/init-urql-client';
import React from 'react';
import { PostQuery, useCreateCommentMutation } from '../generated/graphql';
import { Comments } from './Comments';
import { InputField } from './InputField';
import { UpdootSection } from './UpdootSection';

interface PostPageProps {
 data : PostQuery
}

export const PostPage: React.FC<PostPageProps> = ({data}) => {

    const [,createComment] = useCreateCommentMutation();
    
    if(data?.post)
    {
        const pid = data.post.id;
        return (
        
                <Stack spacing={3}>
                    <Box alignContent="center" shadow="md" borderWidth="1px" padding="5">
                        <Flex alignItems="center">
                            <UpdootSection post={data.post}/>
                            <Heading textAlign="center"  mb={4}>{data.post.title}</Heading>
                        </Flex>
                   
                    </Box>
                    
                    <Box shadow="md" borderWidth="1px" padding="5">Probably the most effective way to achieve paragraph unity is to express the central idea of the paragraph in a topic sentence.

Topic sentences are similar to mini thesis statements. Like a thesis statement, a topic sentence has a specific main point. Whereas the thesis is the main point of the essay, the topic sentence is the main point of the paragraph. Like the thesis statement, a topic sentence has a unifying function. But a thesis statement or topic sentence alone doesn’t guarantee unity. An essay is unified if all the paragraphs relate to the thesis, whereas a paragraph is unified if all the sentences relate to the topic sentence. Note: Not all paragraphs need topic sentences. In particular, opening and closing paragraphs, which serve different functions from body paragraphs, generally don’t have topic sentences.

In academic writing, the topic sentence nearly always works best at the beginning of a paragraph so that the reader knows what to expect:</Box>
                    
                    <Heading as='h4' size='md'pl={3} >Comments</Heading>

                    
                        {/* <Textarea placeholder="Add a comment" onChange={()=>hangleChange()}></Textarea> */}
                        <Formik
                            initialValues={{ text:""}}
                            onSubmit={async (values,{resetForm}) => {
                            if(values.text !== "")
                            {
                                await createComment({postId : pid,...values});
                            }
                            resetForm();
                
                            }}
                        >
                            {({ isSubmitting }) => (
                            <Form>
                            <Flex shadow="md" alignItems="center" justifyContent="center" borderWidth="1px">
                            <Box flex={1} >
                                <InputField
                                    textarea
                                    name="text"
                                    placeholder="Add a comment"
                                    label=""
                                />
                                </Box>
                                <Button
                                mt={4}
                                type="submit"
                                isLoading={isSubmitting}
                                colorScheme="teal"
                                >
                                Comment
                                </Button>
                                </Flex>
                            </Form>
                            )}
                        </Formik>
                        {/* <Button colorScheme="blackAlpha">Post</Button> */}
                    
                   <Comments postId={data.post.id}/>
                    
                </Stack>

        );

    }
    else 
    return null;
        
}

