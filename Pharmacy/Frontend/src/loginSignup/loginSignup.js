import React from "react";
import axios from "axios";
import * as Components from './loginSignupComponent';
import "../styles.css";

function App() {
    const [signIn, toggle] = React.useState(true);
    const [error, setError] = React.useState('');
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError('');  
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
            alert('Please fill out all fields.');
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, formData);
            console.log('Sign Up Success:', response.data);
            alert('Thank you for signing up. Please wait for a phone call or visit to your pharmacy to verify your account.');
            setError('');
        } catch (error) {
            console.error('Sign Up Error:', error.response.data);
            alert('Sign Up Failed. Email Already Exists!');
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            alert('Please enter both email and password to sign in.');
            return;
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                email: formData.email,
                password: formData.password
            });
            console.log('Sign In Success:', response.data);
            setError('');
        } catch (error) {
            alert('Failed to sign in. Check your credentials.');
            console.error('Sign In Error:', error.response.data);
        }
    };

    return (
        <Components.Container>
            {error && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
            {(
                <>
                    <Components.SignUpContainer signinIn={signIn}>
                        <Components.Form onSubmit={handleSignUp}>
                            <Components.Title>Create Pharmacy Account</Components.Title>
                            <Components.Input type='text' placeholder='Pharmacy Name' name="name" value={formData.name} onChange={handleInputChange} />
                            <Components.Input type='email' placeholder='Pharmacy Email' name="email" value={formData.email} onChange={handleInputChange} />
                            <Components.Input type='password' placeholder='Password' name="password" value={formData.password} onChange={handleInputChange} />
                            <Components.Input type='text' placeholder='Phone Number To Contact For Verification' name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                            <Components.Button type="submit">Sign Up as Pharmacy</Components.Button>
                        </Components.Form>
                    </Components.SignUpContainer>

                    <Components.SignInContainer signinIn={signIn}>
                        <Components.Form onSubmit={handleSignIn}>
                            <Components.Title>Sign In</Components.Title>
                            <Components.Input type='email' placeholder='Pharmacy Email' name="email" value={formData.email} onChange={handleInputChange} />
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
                                    To keep connected with us please login with your Pharmacy credentials
                                </Components.Paragraph>
                                <Components.GhostButton onClick={() => toggle(true)}>
                                    Sign In
                                </Components.GhostButton>
                            </Components.LeftOverlayPanel>

                            <Components.RightOverlayPanel signinIn={signIn}>
                                <Components.Title>Hello Pharmacy!</Components.Title>
                                <Components.Paragraph>
                                    Enter Pharmacy details and start the journey with us
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
