import React, { useEffect, useState } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const API_KEY = "AIzaSyB1HER_RkL-8-zBKyt93BaR5IlcQtSDGvk";
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const YouTube = () => {
	const [videos, setVideos] = useState([]);
	const latestQuery = useSelector(state=> {
		// console.log(state)
		return state.chatTopic?.topics[state.chatTopic.topics.length -1 ]
	});

	// console.log(latestQuery)

	useEffect(() => {
		if (!latestQuery) return;

		const fetchVideos = async () => {
			try {
				const response = await fetch(
					`${BASE_URL}?part=snippet&q=${latestQuery + "education"}&type=video&maxResults=6&key=${API_KEY}`
				);
				const data = await response.json();

				if (data.items) {
					setVideos(data.items);
				}
			} catch (error) {
				console.error("Error fetching YouTube videos:", error);
			}
		};

		fetchVideos();
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
				<Flex
					flexWrap="wrap"
					gap={4}
					p={4}
					justifyContent="center"
					width="100%"
					h={'100%'}
					bg="gray.100"
					borderRadius="lg"
					overflowY={'auto'}
					mx={4}
				>
					{videos.length > 0 ? (
						videos.map((video) => (
							<Box
								key={video.id.videoId}
								width="30%"
								bg="purple.200"
								borderRadius="md"
								p={3}
								h={'40%'}
								boxShadow="md"
								overflowY={'auto'}
							>
								<iframe
									width="100%"
									height="180"
									src={`https://www.youtube.com/embed/${video.id.videoId}`}
									title={video.snippet.title}
									frameBorder="0"
									allowFullScreen
								></iframe>
								<Text
									fontSize="sm"
									mt={2}
									textAlign="center"
								>
									{video.snippet.title}
								</Text>
							</Box>
						))
					) : (
						<Text>
							No videos found. Try searching for something else.
						</Text>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default YouTube;
