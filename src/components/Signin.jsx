import React, { useState } from "react";
import { Link } from "react-router";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";
import { googleProvider } from "../firebase";


export const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/')
        } catch (error) {
            setError(`Error: ${error}`) 
        }
    }

    const handleSignInWithGmail = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            navigate('/')
        } catch (error) {
            setError(`Error: ${error}`) 
        }
    }

    return(
        <div>
            <h1>Sign In Page</h1>
            <input type= "email" placeholder="email..." onChange={(e) => setEmail(e.target.value)} />
            <input type= "password" placeholder="password..." onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignIn}>Sign In</button>
            {'or'}
            <button onClick={handleSignInWithGmail}>Sign In with Gmail</button>
            {error && <p>{error}</p>}
            <p>Don't have account? <Link to="/Signup">Sign Up</Link></p>
        </div>
    )
}