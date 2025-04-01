import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	VStack,
	HStack,
	IconButton,
	Input,
	Flex,
	useColorModeValue,
} from "@chakra-ui/react";
import { FaImage, FaMicrophone, FaPaperPlane, FaTrash } from "react-icons/fa";
import { addTopic } from "../store/chatTopicSlice";
import { useDispatch } from "react-redux";

// Function to format API responses into HTML
const formatResponse = (text) => {
	if (!text) return "";

	// Convert bullet points and numbered lists
	let formattedText = text
		.replace(/\n\n/g, "\n") // Normalize line breaks
		.replace(/\*/g, "") // Remove unnecessary asterisks
		.replace(/(?<=\n|^)\s*-\s+/g, "• ") // Convert lists (- to •)
		.replace(/(?<=\n|^)\s*\d+\.\s+/g, "🔹 ") // Convert numbered lists
		.replace(/\n/g, "<br>"); // Convert new lines to <br> for HTML

	// Format code blocks (```)
	formattedText = formattedText.replace(
		/```([\s\S]*?)```/g,
		'<pre><code>$1</code></pre>'
	);

	// Format inline code (`code`)
	formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');

	return formattedText;
};

function ChatBox() {
	const dispatch = useDispatch()
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const chatEndRef = useRef(null);

	// Auto-scroll inside chat box
	useEffect(() => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
		}
	}, [messages]);

	const extractTopic = (message) => {
		const words = message.split(' ');
		// console.log(words)
		return words.find((word) => word.length > 3) || "General"; // Picks a relevant word
	  };
	

	// Handle message sending
	const handleSendMessage = async () => {
		if (input.trim() === "") return;

		const topic = extractTopic(input);
		dispatch(addTopic(topic))
		
		const newMessage = { text: input.toUpperCase(), sender: "user", topic: topic };
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setInput("");

		try {
			const response = await fetch("http://localhost:8000/api/v1/chat/getResponse", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: input + "education" }),
				credentials:'include'
			});

			const data = await response.json();

			if (response.ok) {
				const botMessage = { text: formatResponse(data.data), sender: "bot" };
				setMessages((prevMessages) => [...prevMessages, botMessage]);
				localStorage.setItem('chatMessage',messages)
			} else {
				throw new Error(data.error || "AI response failed");
			}
		} catch (error) {
			console.error("Error fetching response:", error);
			setMessages((prevMessages) => [
				...prevMessages,
				{ text: "⚠️ AI is not responding. Try again later.", sender: "bot" },
			]);
		}
	};

	// Handle enter key event
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleClearChat = () => {
		setMessages([]);
		localStorage.removeItem("chatMessages");
	};

	const handleVoiceInput = () => {
		if (!("webkitSpeechRecognition" in window)) {
		  alert("Voice recognition not supported in this browser. Try Chrome.");
		  return;
		}
	
		const recognition = new window.webkitSpeechRecognition();
		recognition.lang = "en-US";
		recognition.continuous = false;
		recognition.interimResults = false;
	
		// recognition.onstart = () => console.log("Voice recognition started...");
		recognition.onresult = (event) => {
		  const transcript = event.results[0][0].transcript;
		//   console.log(transcript)
		  setInput(transcript);
		};
		recognition.onerror = (event) => console.error("Voice recognition error:", event.error);
		// recognition.onend = () => console.log("Voice recognition ended.");
	
		recognition.start();
	  };
	

	const botBg = useColorModeValue("gray.200", "gray.600");
	const userBg = useColorModeValue("blue.400", "blue.700");
	const textColor = useColorModeValue("black", "white");

	return (
		<Flex direction="column" h="100%" w={"full"} p={4}>
			{/* Messages Display */}
			<Box flex={1} overflowY="auto" p={4} bg={useColorModeValue("gray.50", "gray.800")} borderRadius="lg" maxH="100%">
				<VStack spacing={3} align="stretch">
					{messages.map((msg, index) => (
						<HStack key={index} justify={msg.sender === "user" ? "flex-end" : "flex-start"}>
							<Box
								bg={msg.sender === "user" ? userBg : botBg}
								color={textColor}
								px={4}
								py={2}
								borderRadius="lg"
								w="100%"
							>
								{/* Render formatted HTML */}
								<div dangerouslySetInnerHTML={{ __html: msg.text }} />
							</Box>
						</HStack>
					))}
					<div ref={chatEndRef}></div>
				</VStack>
			</Box>

			{/* Input Box */}
			<Box bg={useColorModeValue("white", "gray.900")} p={3} borderRadius="full" boxShadow="md" mt={2}>
				<HStack w="full">
					<IconButton icon={<FaMicrophone />} aria-label="Voice Input" colorScheme="teal" variant="ghost" onClick={handleVoiceInput} />
					{/* <IconButton icon={<FaImage />} aria-label="Upload Image" colorScheme="blue" variant="ghost" /> */}
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Type a message..."
						flex={1}
					/>
					<IconButton icon={<FaPaperPlane />} onClick={handleSendMessage} aria-label="Send" colorScheme="green" />
					<IconButton icon={<FaTrash />} onClick={handleClearChat} aria-label="Clear Chat" colorScheme="red" variant="ghost" />
				</HStack>
			</Box>
		</Flex>
	);
}

export default ChatBox;
