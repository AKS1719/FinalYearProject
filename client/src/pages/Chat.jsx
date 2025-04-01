import React, { useState, useEffect } from "react";
import {
	Flex,
	Box,
	Skeleton,
	useColorModeValue,
	VStack,
	Text,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import { useSelector } from "react-redux";

function Chat() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate loading time
		setTimeout(() => setIsLoading(false), 1500);
	}, []);

	const topic = useSelector((state) => state.chatTopic.topics);

	return (
		<Flex
			h={"100vh"}
			width={"100%"}
			flexDirection={"column"}
		>
			<Flex
				height={"100%"}
				p={4}
				px={0}
			>
				<Flex
					flexDirection={"column"}
					px="0"
					alignItems={"center"}
					justifyContent={"center"}
				>
					<Sidebar />
				</Flex>
				<ChatBox />
				{/* New History & Suggestion Boxes */}
				<Flex
					flexDirection={"column"}
					alignItems={"center"}
					gap={4}
					p={4}
				>
					<Box
						w={"300px"}
						bg={"gray.300"}
						p={4}
						h={'max-content'}
						borderRadius={"md"}
					>
						<Box
							bg={"white"}
							p={2}
							borderRadius={"md"}
							textAlign={"center"}
						>
							<Text fontWeight={"bold"}>History</Text>
						</Box>
						<Box
							mt={2}
							p={2}
						>
							{topic?.map((_, i) => (
								<Box
									key={i}
									h={"10px"}
									my={1}
								>
									<Text>{_}</Text>
								</Box>
							))}
						</Box>
					</Box>
					{/* Below is the suggestion box  */}
					{/* <Box w={'300px'} bg={'gray.300'} p={4} borderRadius={'md'}>
					<Box bg={'white'} p={2} borderRadius={'md'} textAlign={'center'}>
						<Text fontWeight={'bold'}>Suggestion</Text>
					</Box>
					<Box mt={2} p={2}>
						{[...Array(7)].map((_, i) => (
							<Box key={i} h={'10px'} bg={'black'} my={1} />
						))}
					</Box>
				</Box> */}
				</Flex>
			</Flex>
		</Flex>
	);
}

export default Chat;
