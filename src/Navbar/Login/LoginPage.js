import React, { useState } from 'react';
import "./login.css";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { app, auth, provider } from "../../firebaseConfig";
import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import earth from "../../Mask\ group.png"
import logo from "../logo.png";
import { FcGoogle } from "react-icons/fc";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
} from "firebase/firestore";

import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai"
import { border } from '@mui/system';

export default function Login({ setLoginModalFunc, setRegisterModalFunc, setIsLoggedinVal, setisSocLogin }) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [passwordType, setPasswordType] = useState("password")

    const togglePassword = () => {
        if(passwordType === "password") {
            setPasswordType("text");
        } else {
            setPasswordType("password");
        }
    }

    const [name, setName] = useState("");

    const setItems = (name, email, profilePic) => {
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("profilePic", profilePic);

    }

    const db = getFirestore(app);
    const signInWithGoogle = async (event) => {

        event.preventDefault();
        try {
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                alert("Not registered");
            }
            else {
                setItems(user.displayName, user.email, user.photoURL);
                setIsLoggedinVal(true);
                setLoginModalFunc(false);
                setisSocLogin(false);
            }

        } catch (err) {
            console.error(err);
            setIsLoggedinVal(false);
            setisSocLogin(false);
            setLoginModalFunc(false);
        }
    };

    const signInwithEmail = async (event) => {

        if (email == "" || password == "") {
            return;
        }
        event.preventDefault();

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            const user = res.user;
            setLoginModalFunc(false);
            setItems(user.displayName, user.email, user.photoURL);
            setIsLoggedinVal(true);
            setisSocLogin(true);
            window.location.reload();

        } catch (err) {
            console.error(err);
            alert("Invalid Credentials")
            setIsLoggedinVal(false);
            setisSocLogin(false);
            setLoginModalFunc(false);
        }
    };

    return (

        <div id="simpleModal" className="Modal" >
            <img className="logo" src={logo} />
            <div id="earthdiv" >
            <img src={earth} id="earth"></img>
            </div>
            
            <div>
                <ul id="LoginNavbar">
                    <li class="loginnav-item" onClick={()=>{setLoginModalFunc(false)}}><Link to="/" style={{background: "transparent"}}>HOME</Link></li>
                    <li class="loginnav-item" onClick={()=>{setLoginModalFunc(false)}}><Link to="/About" style={{background:"transparent"}}>ABOUT</Link></li>
                    <li class="loginnav-item" onClick={()=>{setLoginModalFunc(false)}}><Link to="/FAQs" style={{background:"transparent"}}>FAQs</Link></li>
                </ul>
            </div>

            <div id="Newacc">
                WANT TO MAKE A NEW ACCOUNT?
                <div></div><button id="regbtn"onClick={() => { setRegisterModalFunc(true); setLoginModalFunc(false) }}>REGISTER</button>
            </div>

            <div className='modal-content' id="modalContent">
                <div className='modal-header' id="ModalHeader">
                    <div id="login_heading">WELCOME BACK !</div>
                    <div className="closebtn" onClick={() => { setLoginModalFunc(false) }}>&times;</div>
                </div>

                <div className="modal-body" id="ModalBody">
                    <form id="LRform" action="">
                    <div className="textbox" >
                            <FaUserAlt />
                            <input placeholder="Name" type="text" value={name} onChange={(e) => { setName(e.target.value) }} required></input>
                        </div>
                        <div className="textbox" >
                            <MdAlternateEmail />
                            <input placeholder="E-mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required></input>
                        </div>
                        <div className="textbox">
                            <FaLock />
                            <input type={passwordType} placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} required></input>

                            <div className="input-group-btn">
                                <a onClick={togglePassword} style={{background: "transparent", border: "none"}}>
                                { passwordType==="password"? <AiFillEyeInvisible /> : <AiFillEye /> }
                            </a>
                            </div>

                        </div>
                        <span className="shadow-lg rounded" id="Google" onClick={signInWithGoogle}><FcGoogle /> Sign In with Google</span>
                        <button id="submitbtn" onClick={signInwithEmail}>LOGIN</button>
                        <div id="forgot">Don't remember your password? <a href='/' style={{color: "#9747FF"}}>Forgot Password</a></div>
                    </form>

                </div>
            </div>
        </div>
    )
}