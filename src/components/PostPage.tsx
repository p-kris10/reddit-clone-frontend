import { Stack, Heading, Box, Flex, Textarea, Button } from '@chakra-ui/react';
import React from 'react'
import { PostQuery } from '../generated/graphql';
import { Layout } from './Layout';
import { UpdootSection } from './UpdootSection';

interface PostPageProps {
 data : PostQuery | undefined
}

const PostPage: React.FC<PostPageProps> = ({data}) => {
    if(data?.post)
    {
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
                    
                    <Heading as='h4' size='md' >Comments</Heading>

                    <Flex shadow="md" alignItems="center" borderWidth="1px">
                        <Textarea placeholder="Add a comment"></Textarea>
                        <Button colorScheme="blackAlpha">Post</Button>
                    </Flex>

                    <Box shadow="md" padding="50px" borderWidth="1px">Comments</Box>
                </Stack>

        );

    }
    else 
    return null;
        
}

export default PostPage;