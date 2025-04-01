import React, { useState, useEffect } from "react";
import { Flex, Box, Text, Link } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

function Wikipedia() {
	const [results, setResults] = useState([]);

	const latestQuery = useSelector(state=>state.chatTopic.topics[state.chatTopic.topics.length -1]);

	useEffect(() => {
		if (!latestQuery) return;

		const fetchWikipediaResults = async () => {
			try {
				const response = await fetch(
					`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${latestQuery}`
				);
				const data = await response.json();

				if (data.query && data.query.search) {
					setResults(data.query.search);
				}
			} catch (error) {
				console.error("Error fetching Wikipedia data:", error);
			}
		};

		fetchWikipediaResults();
	}, [latestQuery]);

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
				<Box
					flex={1}
					p={4}
					h={'95vh'}
					overflowY="auto"
					bg={'gray.200'}
					borderRadius={'20px'}
					mx={4}
				>
					<Text
						fontSize="2xl"
						fontWeight="bold"
					>
						📖 Wikipedia Search
					</Text>
					<Text my={2}>
						Showing results for: <strong>{latestQuery}</strong>
					</Text>
					<Box>
						{results.length > 0 ? (
							results.map((article) => (
								<Box
									key={article.pageid}
									p={4}
									my={2}
									borderWidth={"1px"}
									borderRadius={"md"}
								>
									<Text
										fontSize="lg"
										fontWeight="bold"
									>
										{article.title}
									</Text>
									<Text
										dangerouslySetInnerHTML={{
											__html: article.snippet,
										}}
									></Text>
									<Link
										href={`https://en.wikipedia.org/?curid=${article.pageid}`}
										isExternal
										color="blue.500"
										mt={2}
									>
										Read More
									</Link>
								</Box>
							))
						) : (
							<Text>
								No Wikipedia articles found. Try asking
								something else.
							</Text>
						)}
					</Box>
				</Box>
			</Flex>
		</Flex>
	);
}

export default Wikipedia;
