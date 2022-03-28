import { Box, Button, Flex,Link } from "@chakra-ui/react";
import NextLink from 'next/link';
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps{

}

export const NavBar : React.FC<NavBarProps> = ({}) =>{
    const[{data,fetching}] = useMeQuery({
        pause : isServer(),
    })
    const [{fetching : LogoutFetching},logout] = useLogoutMutation()
    let body = null
    //data is loading
    if(fetching)
    {

    }
    //not logged in
    else if(!data?.me)
    {
        body = (
            <>
            <NextLink href={"/login"}>
                    <Link  mr={2}>Login </Link>
                    </NextLink>
                    <NextLink href={"/register"}>
                    <Link>Register </Link>
            </NextLink>
            </>
        )
    }
    else
    {
        body = (
            <Flex>
                <Box mr={2}>{data.me.username}</Box>
                <Button onClick={()=>{logout();}} isLoading={LogoutFetching} variant="link">logout</Button>
            </Flex>
            
        )
    }
    return (
        <Flex zIndex={1} position="sticky" top={0} bg='tomato'>
                <Box  p={4} ml={'auto'} >
                    {body}
                </Box>
            </Flex>
            
    );
}