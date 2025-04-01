import { useState, useEffect } from "react";
import { Box, Button, Input, Text, Flex, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {login as authLogin} from "../store/authSlice.js"

export default function OtpVerification() {

	const {email} = useParams()
	// console.log(email)

	const [error, seterror] = useState("")

	const dispatch = useDispatch()
	const navigate  = useNavigate()
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [timer, setTimer] = useState(60*10); // 2-minute countdown

	// Handle OTP input change
	const handleChange = (index, value) => {
		seterror("");
		if (isNaN(value)) return; // Only allow numbers
		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		// Move to the next input field
		if (value && index < 5) {
			document.getElementById(`otp-input-${index + 1}`).focus();
		}
	};


	const handleNext = async()=>{
		if(!(timer===0)){
			let ottp = ""
			otp.forEach((ele)=> ottp+=ele)
			const res = await fetch('http://localhost:8000/api/v1/users/verifyOTP',
				{
					method:"POST",
					headers:{
						"Content-type":"application/json"
					},
					body:JSON.stringify({otp:ottp,email:email}),
					credentials:'include'
				}
			)
			if(!res.ok){
				seterror("Some error occured")
				return
			}
			const data = await res.json();
			dispatch(authLogin(data.data));
			// console.log(data)
			if(data.message === "Verified Success")
			navigate('/')
		}
		else{
			seterror("Time lost retry again with new otp")

		}
	} 

	// Handle countdown timer
	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	useEffect(()=>{
		seterror("")
	},[])

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			height="100vh"
			bgGradient="linear(to-b, teal.300, teal.600)"
		>
			<Heading
				color="white"
				mb={4}
			>
				OTP Verification
			</Heading>
			<Text
				color="white"
				mb={2}
			>
				Enter the OTP sent to register Gmail
			</Text>

			<Text color={'red'}>
				{error}
			</Text>

			<Flex
				gap={2}
				mb={4}
			>
				{otp.map((value, index) => (
					<Input
						key={index}
						id={`otp-input-${index}`}
						type="text"
						maxLength="1"
						textAlign="center"
						fontSize="2xl"
						width="50px"
						height="50px"
						borderRadius="md"
						bg="white"
						onChange={(e) => handleChange(index, e.target.value)}
						value={value}
					/>
				))}
			</Flex>

			<Text
				color="white"
				mb={4}
			>
				{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
			</Text>

			<motion.div whileTap={{ scale: 0.9 }}>
				<Button
					colorScheme="teal"
					size="lg"
					borderRadius="full"
					isDisabled={otp.includes("")} // Disable if OTP is incomplete
					onClick={handleNext}
				>
					Next →
				</Button>
			</motion.div>
		</Flex>
	);
}
