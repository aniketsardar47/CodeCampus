import styled from 'styled-components';
import { Container, Center } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { login } from "@/api/auth";
import AuthContext from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "../Editor/showToaster";
import LoginLoader from '@/components/LoginLoader';

function Login() {
  const { login: setLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showpass,setShowpass] = useState(true);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login({ email, password });
      setLogin(data.token);
      
      if(data.role == "student" || data.role == "Student"){
        setLoading(false);
        navigate('/student',{replace: true});
      }
      else if(data.role == "teacher" || data.role == "Teacher"){
        setLoading(false);
        navigate('/teacher',{replace:true});
      }

    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      alert("Invalid Credentials");
    }
  };

  return (
    <Container maxWidth={'100vw'}>
      <Center h={'100vh'}>
      
      {loading? <LoginLoader/> :
      <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
      <div className="flex-column">
        <label>Email </label>
      </div>
      <div className="inputForm">
        <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
          <g id="Layer_3" data-name="Layer 3">
            <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
          </g>
        </svg>
        <input type="text" className="input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" />
      </div>
      <div className="flex-column">
        <label>Password </label>
      </div>
      <div className="inputForm" style={{padding:"10px"}}>
        <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
          <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
          <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
        </svg>
        <input  className="input" value={password}
            onChange={(e) => setPassword(e.target.value)} required type={showpass? "password" : "text"} placeholder="Enter your Password" />
        <svg
              onClick={() => setShowpass(!showpass)}
              className="eye-icon"
              height={20}
              
              viewBox="0 0 24 24"
              width={20}
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
            >
              {showpass ? (
                <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              ) : (
                <path d="M12 4.5c-7.72 0-11.71 7.01-11.97 7.5.26.49 4.25 7.5 11.97 7.5s11.71-7.01 11.97-7.5c-.26-.49-4.25-7.5-11.97-7.5zm0 13c-4.13 0-7.5-3.37-7.5-7.5s3.37-7.5 7.5-7.5 7.5 3.37 7.5 7.5-3.37 7.5-7.5 7.5zm0-13c-3.04 0-5.5 2.46-5.5 5.5s2.46 5.5 5.5 5.5 5.5-2.46 5.5-5.5-2.46-5.5-5.5-5.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              )}
            </svg>
      </div>
      <div className="flex-row">

        <span className="span">Forgot password?</span>
      </div>
      <button className="button-submit" type='submit'>Sign In</button>
      <p className="p">Don't have an account? <span className="span" onClick={()=>navigate('/signup')}>Sign Up</span></p>
    </form> 
    </StyledWrapper>
    }
      </Center>
    </Container>
  );
}


const StyledWrapper = styled.div`
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
    background-color: #1f1f1f;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }
    
    ::placeholder {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      color: #aaa;
      }
      
      .form button {
        align-self: flex-end;
        }
        
        .flex-column > label {
    color: #f1f1f1;
    font-weight: 600;
    }
    
    .inputForm {
      border: 1.5px solid #333;
      border-radius: 10px;
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      transition: 0.2s ease-in-out;
      background-color: #2b2b2b;
      }
      
      .input {
        margin-left: 10px;
        border-radius: 10px;
        border: none;
        width: 100%;
        height: 100%;
        background-color: #2b2b2b;
        color: #f1f1f1;
        }
        
        .input:focus {
          outline: none;
          }
          
          .inputForm:focus-within {
            border: 1.5px solid #2d79f3;
            }

            .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    }

    .flex-row > div > label {
    font-size: 14px;
    color: #f1f1f1;
    font-weight: 400;
    }
    
  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
    }

    .button-submit {
      margin: 20px 0 10px 0;
      background-color: #2d79f3;
      border: none;
      color: white;
      font-size: 15px;
      font-weight: 500;
      border-radius: 10px;
      height: 50px;
      width: 100%;
      cursor: pointer;
      }
      
      .p {
        text-align: center;
        color: #f1f1f1;
        font-size: 14px;
        margin: 5px 0;
        }
        
        .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #333;
    background-color: #2b2b2b;
    color: #f1f1f1;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    }
    
    .btn:hover {
      border: 1px solid #2d79f3;
      }`;
      
export default Login;
      