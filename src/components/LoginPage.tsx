import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Image,
  Input,
  FormControl,
  FormLabel,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import Confetti from 'react-confetti';
import Footer from './Footer';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeTimeout, setWelcomeTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/auth/login`, { username, password });
      localStorage.setItem('token', response.data.token);

      setShowWelcome(true);

      const timeout = setTimeout(() => {
        setShowWelcome(false);
        navigate('/memories');
      }, 5000);

      setWelcomeTimeout(timeout);
    } catch {
      setError('Invalid username or password');
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Box
        w="100%"
        h="100vh"
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {showWelcome && (
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="white" // Grey background
            backdropFilter="blur(20px)" // Blurred effect
            zIndex="9999" // Ensure it's on top
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              numberOfPieces={100} // Adjust the number of confetti pieces
              colors={['#FFD700', '#C0C0C0']}
            />
            <Text
              fontSize="6xl"
              fontWeight="bold"
              textAlign="center"
              css={`
                background: linear-gradient(90deg, #63b3ed, #9f7aea);
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent; /* Make text transparent to show gradient */
            `}
            >
              Welcome {username}
            </Text>
          </Box>
        )}

        {isMobile ? (
          <>
            {/* Mobile View */}
            <Box
              flex="1"
              borderBottomRadius="10%"
              height="50vh"
            >
              <Image
                src="https://roshime.s3.ap-south-1.amazonaws.com/CoverDesktop.PNG"
                objectFit="cover"
                width="100%"
                height="100%"
                borderBottomRadius="10%"
              />
            </Box>
            <Box textAlign="center" flex="1" mt="4" px="4">
              <Heading
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                fontSize="3xl"
              >
                Roshime
              </Heading>
              <Text color="gray.500" mt="2">
                A journey through the moments that defined us, captured in every memory
              </Text>
              <Button
                bgGradient="linear(to-r, blue.400, purple.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }}
                size="lg"
                mt="4"
                onClick={onOpen}
              >
                Take me through the memory lane
              </Button>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent
                bg="white"
                p="4"
                borderRadius="md"
              >
                <ModalHeader color="gray.500">Login</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text mb="4" color="gray.500">
                    Unlock the stories that time couldn’t fade
                  </Text>
                  {error && (
                    <Alert status="error" mb="4">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}
                  <form onSubmit={handleSubmit}>
                    <VStack spacing="4">
                      <FormControl id="username">
                        <FormLabel color="gray.500">Username</FormLabel>
                        <Input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </FormControl>
                      <FormControl id="password">
                        <FormLabel color="gray.500">Password</FormLabel>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        color="white"
                        _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }}
                        width="full"
                      >
                        Login
                      </Button>
                    </VStack>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <Box display="flex" width="100%" height="100%">
            {/* Desktop View */}
            <Box
              flex="1"
              backgroundImage="url(https://roshime.s3.ap-south-1.amazonaws.com/CoverDesktop.PNG)"
              backgroundSize="cover"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              borderTopRightRadius="50px"
              borderBottomRightRadius="50px"
              h="97vh"
            />
            <Box
              flex="1"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p="6"
              boxShadow="lg"
              borderRadius="md"
              backgroundColor="white"
              opacity="0.9"
            >
              <Heading
                mb="4"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
                fontSize="4xl"
                textAlign="center"
              >
                Roshime
              </Heading>
              <Text color="gray.500" mb="6" textAlign="center">
                A journey through the moments that defined us, captured in every memory
              </Text>

              <Box boxShadow="md" mt="5" p="6" borderRadius="md" width="100%" maxW="md">
                <Heading size="lg" mb="4" textAlign="center" color="gray.500">
                  Login
                </Heading>
                <Text mb="4" textAlign="center" color="gray.500">
                  Unlock the stories that time couldn’t fade
                </Text>
                {error && (
                  <Alert status="error" mb="4">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
                  <VStack spacing="4">
                    <FormControl id="username">
                      <FormLabel color="gray.500">Username</FormLabel>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl id="password">
                      <FormLabel color="gray.500">Password</FormLabel>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      bgGradient="linear(to-r, blue.400, purple.500)"
                      color="white"
                      _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }}
                      width="full"
                    >
                      Login
                    </Button>
                  </VStack>
                </form>
              </Box>
            </Box>
          </Box>
        )}

      </Box>
      <Footer />
    </>
  );
};

export default LoginPage;

