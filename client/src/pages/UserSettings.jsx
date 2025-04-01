import React from "react";
import {
	Flex,
	Box,
	Avatar,
	Text,
	Button,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	VStack,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {logout } from "../store/authSlice.js"
function UserSettings() {
	const user = useSelector(state=> state.authSlice.userData)
	const history = useSelector(state=> state.chatTopic.topics)
	const dispatch = useDispatch();
	const handleLogout = async()=>{
		try {
			const res = await fetch('http://localhost:8000/api/v1/users/logout',
				{
					method:"POST",
					credentials:"include"
				}
			)
			if(!res.ok){
				throw new Error("Getting problem while logging out")
			}
			dispatch(logout())
			
		} catch (error) {
			console.log(error)

		}
	}

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
				<Flex>
					<Box
						flex={1}
						p={4}
						mx={4}
						overflowY="auto"
					>
						<VStack
							spacing={4}
							align="start"
						>
							<Flex
								alignItems="center"
								gap={4}
							>
								<Avatar
									size="xl"
									name={user?.name}
									src={user?.avatar}
								/>
								<Box>
									<Text
										fontSize="lg"
										fontWeight="bold"
									>
										{user?.name}
									</Text>
									<Text color="gray.500">{user?.email}</Text>
								</Box>
							</Flex>

							<Tabs
								variant="soft-rounded"
								colorScheme="blue"
								width="100%"
							>
								<TabList>
									<Tab>About Me</Tab>
									<Tab>History</Tab>
									<Tab>Suggestions</Tab>
									<Tab>My Results</Tab>
								</TabList>
								<TabPanels>
									<TabPanel>
										<Text>
											{user?.bio || "No bio available."}
										</Text>
									</TabPanel>
									<TabPanel>
										{history?.map((ele)=>(<Text>
											{ele}
										</Text>))}
									</TabPanel>
									<TabPanel>
										<Text>
											AI-generated suggestions will be
											shown here.
										</Text>
									</TabPanel>
									<TabPanel>
										<Text>
											User test results will be listed
											here.
										</Text>
									</TabPanel>
								</TabPanels>
							</Tabs>
							<Button
								colorScheme="red"
								mt={4}
								onClick={handleLogout}
							>
								Logout
							</Button>
						</VStack>
					</Box>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default UserSettings;
