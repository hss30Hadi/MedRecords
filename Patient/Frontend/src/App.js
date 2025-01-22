import React from "react";
import axios from "axios";
import * as Components from './Components';
import "./styles.css";

function App() {
    const [signIn, toggle] = React.useState(true);
    const [verification, setVerification] = React.useState(false); 
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        verificationCode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, formData);
            console.log('Sign Up Success:', response.data);
            setVerification(true);  
        } catch (error) {
            console.error('Sign Up Error:', error.response.data);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                email: formData.email,
                password: formData.password
            });
            console.log('Sign In Success:', response.data);
        } catch (error) {
            console.error('Sign In Error:', error.response.data);
        }
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify`, {
                email: formData.email,
                verificationCode: formData.verificationCode
            });
            console.log('Verification Success:', response.data);
            setVerification(false);  
            toggle(true);//moves back to sign in page
        } catch (error) {
            console.error('Verification Error:', error.response.data);
        }
    };

    return (
        <Components.Container>
            {verification ? (
                <Components.Form onSubmit={handleVerification}>
                    <Components.Title>Verify Your Account</Components.Title>
                    <Components.Input type='text' placeholder='Verification Code' name="verificationCode" value={formData.verificationCode} onChange={handleInputChange} />
                    <Components.Button type="submit">Verify</Components.Button>
                </Components.Form>
            ) : (
                <>
                    <Components.SignUpContainer signinIn={signIn}>
                        <Components.Form onSubmit={handleSignUp}>
                            <Components.Title>Create Account</Components.Title>
                            <Components.Input type='text' placeholder='Full Name' name="name" value={formData.name} onChange={handleInputChange} />
                            <Components.Input type='email' placeholder='Email' name="email" value={formData.email} onChange={handleInputChange} />
                            <Components.Input type='password' placeholder='Password' name="password" value={formData.password} onChange={handleInputChange} />
                            <Components.Button type="submit">Sign Up as Patient</Components.Button>
                        </Components.Form>
                    </Components.SignUpContainer>

                    <Components.SignInContainer signinIn={signIn}>
                        <Components.Form onSubmit={handleSignIn}>
                            <Components.Title>Sign In</Components.Title>
                            <Components.Input type='email' placeholder='Email' name="email" value={formData.email} onChange={handleInputChange} />
                            <Components.Input type='password' placeholder='Password' name="password" value={formData.password} onChange={handleInputChange} />
                            <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                            <Components.Button type="submit">Sign In</Components.Button>
                        </Components.Form>
                    </Components.SignInContainer>

                    <Components.OverlayContainer signinIn={signIn}>
                        <Components.Overlay signinIn={signIn}>
                            <Components.LeftOverlayPanel signinIn={signIn}>
                                <Components.Title>Welcome Back!</Components.Title>
                                <Components.Paragraph>
                                    To keep connected with us please login with your personal info
                                </Components.Paragraph>
                                <Components.GhostButton onClick={() => toggle(true)}>
                                    Sign In
                                </Components.GhostButton>
                            </Components.LeftOverlayPanel>

                            <Components.RightOverlayPanel signinIn={signIn}>
                                <Components.Title>Hello!</Components.Title>
                                <Components.Paragraph>
                                    Enter your personal details and start journey with us
                                </Components.Paragraph>
                                <Components.GhostButton onClick={() => toggle(false)}>
                                    Sign Up
                                </Components.GhostButton>
                            </Components.RightOverlayPanel>
                        </Components.Overlay>
                    </Components.OverlayContainer>
                </>
            )}
        </Components.Container>
    );
}

export default App;
