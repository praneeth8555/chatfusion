import React from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import {
  useNavigate
} from "react-router-dom";

export default function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [Confirmpassword, setConfirmpassword] = useState('');
    const [pic, setPic] = useState('');
    const [show, setShow] = useState(false);
    const [Loading, setLoading] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const navigate=useNavigate();

    const postDetails = (pics) => {
        setLoading(true);

        if (pics === undefined) {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chatfusion');
            data.append('cloud_name', 'dzrcalore');

            fetch('https://api.cloudinary.com/v1_1/dzrcalore/image/upload', {
                method: 'POST',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.url) {
                        setPic(data.url.toString());
                        
                    }
                    setLoading(false);
                    console.log(data.url.toString());
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false)
            return;
        }
    };
    const submitHandler=async()=>{
        setLoading(true);
        if(!name || !email || !password || !Confirmpassword){
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        if(password !== Confirmpassword){
            toast({
                title: 'Passwords do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                }
            };
            const { data } = await axios.post("http://localhost:4000/api/user",{name,email,password,pic},config);
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            
                localStorage.setItem("userInfo", JSON.stringify({data}));
              
            
            
            setLoading(false);
           navigate('/chats');
        } catch (error) {
            toast({
                title: 'error occured',
                
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    }
    return (
        <VStack>
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="signupemail" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input type="email" placeholder="Enter Your Email Address" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="signuppassword" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={Loading}>
                Sign Up
            </Button>
        </VStack>
    );
}
