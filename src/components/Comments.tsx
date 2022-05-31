import { CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box ,Flex,IconButton,Stack, Textarea} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react'
import { useCommentsQuery, useCommentUpdateMutation, useDeleteCommentMutation, useMeQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface CommentsProps {
    postId : number
}

export const Comments: React.FC<CommentsProps> = ({postId}) => {
        const variables = {postId}
        const [dispState,setDisp] = useState({isEdit:false,cid:-1});
        const [text,setText] = useState("");
        const [{data : comments,fetching }] = useCommentsQuery({variables});
        const [{ data: meData }] = useMeQuery();

        const [,updateComment] = useCommentUpdateMutation();
        const [,deleteComment] = useDeleteCommentMutation();

        const handleChange =(e:any)=>{
            let inputValue = e.target.value
            setText(inputValue)
        }
        //console.log(isEdit,cid);
        if(comments?.comments)
        {
            return (
                <Stack spacing={1} mb={10} paddingBottom={50}>
                    {
                    comments.comments.map((c)=>
                    (<Flex key={c.id}  shadow="md" alignItems="center" padding="20px" borderWidth="1px">
                        {c.id !== dispState.cid && <Box>{c.creator.username} :  </Box>}

                        {dispState.isEdit && c.id == dispState.cid ?
                        (<Textarea
                        maxW="70%" paddingLeft={4}
                        onChange={handleChange}
                        mr="auto" defaultValue ={c.text}/>) : 
                        
                        (
                            <Box paddingLeft={4} onClick={()=>{
                                if(c.creatorId === meData?.me?.id)
                                {
                                    setDisp({isEdit:true,cid:c.id})
                                    
                                }
                            }}>{c.text}</Box>
                        )
                        }
                        
                        {meData?.me?.id === c.creatorId &&

                        (
                        <>
                        {dispState.isEdit && c.id == dispState.cid && 
                        <>
                        
                        <IconButton colorScheme="blackAlpha" 
                        ml="auto" onClick={() => {
                        setDisp({isEdit:false,cid:-1})

                        }} 
                        aria-label='CloseButton' icon={<CloseIcon/>}/>

                        <IconButton colorScheme="blackAlpha" 
                        ml="auto" onClick={async() => {
                            await updateComment({comId : c.id,text,creatorId : c.creatorId})
                            setText("")
                            setDisp({isEdit:false,cid:-1})
                        }} 
                        aria-label='EditButton' icon={<EditIcon/>}/>
                        </>
                        }
                        
                    
                        <IconButton colorScheme="blackAlpha" ml="auto" onClick={() => {deleteComment({id : c.id})}} aria-label='DeleteButton' icon={<DeleteIcon/>}/>
                        </>
                        )
                        }
                    </Flex>))
                    }
                </Stack>
                
            );
        }

        return null
        
}

