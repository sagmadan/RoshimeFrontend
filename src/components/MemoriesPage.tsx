import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './MemoriesPage.css';
import React, { useEffect, useState } from 'react';
import {
  Box, Image, Text, Avatar, Popover, PopoverTrigger, PopoverContent,
  PopoverBody, Button, useBreakpointValue, Card, CardBody,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, useDisclosure, Grid, GridItem, Tag, TagLabel, Wrap,
  VStack, Flex, Spacer, Divider, Input, HStack, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import Footer from './Footer';

interface Memory {
  id: string;
  title: string;
  sid: number;
  date: string;
  imgurl: string;
  description: string;
  tags: string[];
  reaction?: string;
  comments?: string[];
}

type EmojiPosition = {
  emoji: string;
  top: string;
  left: string;
};

const MemoriesPage: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [newComment, setNewComment] = useState('');
  const [emojis, setEmojis] = useState<EmojiPosition[]>([]); // Explicitly type the state
  const [animationKey, setAnimationKey] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/memories`, {
          headers: { 'x-auth-token': token }
        });
        setMemories(response.data);
        setBackgroundImage(selectedMemory? selectedMemory.imgurl : response.data[0]?.imgurl);
      } catch (err) {
        navigate('/');
      }
    };

    fetchMemories();
  }, [navigate, selectedMemory]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const openMemoryModal = (memory: Memory) => {
    setSelectedMemory(memory);
    onOpen();
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendUrl}/api/memories/comment`, {
        sid: selectedMemory?.sid,
        comment: newComment,
      }, {
        headers: { 'x-auth-token': token } // Include headers with the request
      });
      if (response.status === 200) {
        const updatedMemory: Memory = {
          ...selectedMemory!,
          comments: [...(selectedMemory?.comments || []), newComment]
        };
        setSelectedMemory(updatedMemory);
        setNewComment('');
        toast({
          title: 'Thanks for sharing how you feel 😊',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Hey, sorry some issue with my code probably 😂',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const getRandomPositions = (count: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push({
        top: Math.floor(Math.random() * 100) + 'vh',
        left: Math.floor(Math.random() * 100) + 'vw',
      });
    }
    return positions;
  };

  const handleEmojiClick = async (emoji: string) => {

    const currentMemory = memories.find(memory => memory.imgurl === backgroundImage);

    if (!currentMemory) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/memories/reaction`, {
        sid: currentMemory.sid,
        reaction: emoji,
      }, {
        headers: { 'x-auth-token': token }
      });

      // Update the local state with the new reaction
      const updatedMemories = memories.map(memory =>
        memory.sid === currentMemory.sid ? { ...memory, reaction: emoji } : memory
      );
      setMemories(updatedMemories);

      const positions = getRandomPositions(40); // Generate 30 random positions
      setEmojis(positions.map((position) => ({ emoji, ...position }))); // Set emoji with positions

      setTimeout(() => {
        setEmojis([]);
      }, 2000);

      setAnimationKey(prevKey => prevKey + 1);
    } catch (error) {
      toast({
        title: 'Error updating reaction.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Show only 1 card for both mobile and non-mobile
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    initialSlide: 0,
    beforeChange: (current: number, next: number) => {
      setBackgroundImage(memories[next]?.imgurl);
    },
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Box maxW="100%" minH="100vh" position="relative">
        {/* Blurred Background */}
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bgImage={backgroundImage ? `url(${backgroundImage})` : ''}
          bgSize="cover"
          bgPosition="center"
          filter="blur(14px)"
          zIndex="-1"
        />

        {/* Top Bar */}
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="60px"
          bg="rgba(255, 255, 255, 0.2)"
          backdropFilter="blur(10px)"
          zIndex="1000"
          boxShadow="sm"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={6}
        >
          <Text
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="bold"
          >
            Roshime
          </Text>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Avatar name="R" bg="blue.500" color="white" size="sm" cursor="pointer" />
            </PopoverTrigger>
            <PopoverContent width="auto">
              <PopoverBody>
                <Button
                  size="sm"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  color="white"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>

        {/* Carousel of Memories */}
        <Box mt="60px" maxW="100%" pl={7} pr={7} pt={12} pb={3}>
          <Slider {...settings}>
            {memories.map((memory) => (
              <Card
                key={memory.id}
                borderRadius="20px"
                boxShadow="sm"
                overflow="hidden"
                textAlign="center"
                transition="transform 0.6s ease"
                transform="scale(0.9)"
                cursor="pointer"
                height="auto"
              >
                <CardBody>
                  {isMobile ? (
                    // Mobile View
                    <>
                      <Image
                        src={memory.imgurl}
                        alt={`Memory from ${memory.date}`}
                        borderRadius="20px"
                        objectFit="cover"
                        h="220px"
                        w="100%"
                        mb={4}
                      />
                      <Text textAlign="left" fontWeight="bold" fontSize="lg" color="gray.600">
                        {memory.title}
                      </Text>
                      <Wrap mt={2} spacing={2}>
                        {memory.tags?.map((tag, index) => (
                          <Tag key={index} size="sm" colorScheme="blue">
                            <TagLabel>{tag}</TagLabel>
                          </Tag>
                        ))}
                      </Wrap>
                      <Flex justify="space-between" align="center" mt={2}>
                        <Text fontSize="sm" color="gray.500">
                          {memory.date}
                        </Text>
                        {memory.reaction ? (
                          <Text fontSize="2xl" color="gray.500">
                            {memory.reaction}
                          </Text>
                        ) : (
                          <Spacer />
                        )}
                      </Flex>
                      <Flex justify="center" mt={4}>
                        <Button
                          width="100%"
                          bgGradient="linear(to-r, #3498DB, #F1C40F)"
                          color="white"
                          _hover={{ bgGradient: "linear(to-r, #3498DB, #F1C40F)" }}
                          onClick={() => openMemoryModal(memory)}
                        >
                          View memory
                        </Button>
                      </Flex>
                    </>
                  ) : (
                    // Non-Mobile View
                    <Grid templateColumns="1fr 1fr" gap={8} alignItems="left">
                      <GridItem>
                        <Image
                          src={memory.imgurl}
                          alt={`Memory from ${memory.date}`}
                          borderRadius="20px"
                          objectFit="cover"
                          h="350px"
                          w="100%"
                        />
                      </GridItem>
                      <GridItem p={6}>
                        <Text textAlign="left" fontWeight="bold" fontSize="2xl" color="gray.600">
                          {memory.title}
                        </Text>
                        <VStack align="start" mt={2} spacing={2}>
                          {memory.tags?.map((tag, index) => (
                            <Tag key={index} size="md" colorScheme="blue">
                              <TagLabel>{tag}</TagLabel>
                            </Tag>
                          ))}
                        </VStack>
                        <Flex justify="space-between" align="center" mt={5}>
                          <Text fontSize="sm" color="gray.500">
                            {memory.date}
                          </Text>
                          {memory.reaction ? (
                            <Text fontSize="4xl" color="gray.500">
                              {memory.reaction}
                            </Text>
                          ) : (
                            <Spacer />
                          )}
                        </Flex>
                        <Flex justify="center" mt={10}>
                          <Button
                            width="100%"
                            bgGradient="linear(to-r, #3498DB, #F1C40F)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-r, #3498DB, #F1C40F)" }}
                            onClick={() => openMemoryModal(memory)}
                          >
                            View memory
                          </Button>
                        </Flex>
                      </GridItem>
                    </Grid>
                  )}
                </CardBody>
              </Card>
            ))}
          </Slider>
        </Box>

        {/* Emoji Box */}
        <Box mt={7} maxW="100%" p={7} display="flex" justifyContent="center">
          <Box
            borderRadius="60px"
            boxShadow="md"
            p={4}
            bg="white"
            maxW="600px"
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            flexWrap="wrap"
          >
            <Text fontSize="2xl" role="img" aria-label="happy" mx={2} onClick={() => handleEmojiClick('😊')}>😊</Text>
            <Text fontSize="2xl" role="img" aria-label="sad" mx={2} onClick={() => handleEmojiClick('😢')}>😢</Text>
            <Text fontSize="2xl" role="img" aria-label="hearts" mx={2} onClick={() => handleEmojiClick('😍')}>😍</Text>
            <Text fontSize="2xl" role="img" aria-label="heart" mx={2} onClick={() => handleEmojiClick('❤️')}>❤️</Text>
            <Text fontSize="2xl" role="img" aria-label="star" mx={2} onClick={() => handleEmojiClick('🤩')}>🤩</Text>
            <Text fontSize="2xl" role="img" aria-label="crying" mx={2} onClick={() => handleEmojiClick('😂')}>😂</Text>
            <Text fontSize="2xl" role="img" aria-label="angry" mx={2} onClick={() => handleEmojiClick('😠')}>😠</Text>
          </Box>
        </Box>

        {emojis.map((emojiObj, index) => (
          <Text
            key={index}
            fontSize="2xl"
            position="absolute"
            top={emojiObj.top}
            left={emojiObj.left}
            zIndex={10} // Ensure emojis appear above the main UI
            className="emoji-animate"
          >
            {emojiObj.emoji}
          </Text>
        ))}

        {/* Memory Modal */}
        {selectedMemory && (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedMemory.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Image
                  src={selectedMemory.imgurl}
                  alt={`Memory from ${selectedMemory.date}`}
                  borderRadius="20px"
                  objectFit="cover"
                  mb={4}
                  w="100%"
                />
                <Text fontSize="sm" color="gray.500">{selectedMemory.date}</Text>
                <Wrap mt={2} spacing={2}>
                  {selectedMemory.tags?.map((tag, index) => (
                    <Tag key={index} size="sm" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </Wrap>
                <Text mt="10px" fontSize="md" color="gray.600">{selectedMemory.description}</Text>
                <Divider mt="5px" />
                <VStack align="start" spacing={3} mt={6}>
                  {/* Heading */}
                  <Text fontSize="lg" fontWeight="bold" color="gray.600" mb={4}>
                    Comments
                  </Text>

                  {/* Add Comment Input and Button */}
                  <HStack spacing={4} alignItems="center">
                    <Input
                      width="100%"
                      box-sizing="border-box"
                      placeholder="Wanna say something..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      borderColor="gray.300"
                      borderRadius="md"
                    />
                    <Button
                      onClick={handleAddComment}
                      colorScheme="blue"
                      bgGradient="linear(to-r, blue.400, purple.500)" // Gradient background
                      color="white"
                      _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }} // Hover effect
                      borderRadius="md"
                    // size="sm" // Size of the button
                    >
                      Post it
                    </Button>
                  </HStack>

                  {/* Comments */}
                  <VStack width="100%" align="start" spacing={4} mt={4}>
                    {selectedMemory.comments?.map((comment, index) => (
                      <Box
                        key={index}
                        px={2}
                        borderRadius="lg" // More rounded corners for a bubble effect
                        borderWidth="1px"
                        shadow="md"
                        background="linear-gradient(135deg, rgba(251, 194, 235, 0.4), rgba(166, 193, 238, 0.8))" // Semi-transparent gradient
                        backgroundSize="cover"
                        color="gray.600" // Text color
                        position="relative"
                        backdropFilter="blur(20px)" // Apply blur effect to the background
                        _before={{
                          content: '""',
                          position: 'absolute',
                          bottom: '-10px', // Position tail at the bottom
                          left: '20px', // Adjust the position as needed
                          width: 0,
                          height: 0,
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                        }}
                      >
                        {comment}
                      </Box>
                    ))}
                  </VStack>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button bgGradient="linear(to-r, blue.400, purple.500)" color="white"
                  _hover={{ bgGradient: "linear(to-r, blue.500, purple.600)" }}
                  size="sm"
                  onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default MemoriesPage;