// TraverseComponent.jsx
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Media = () => {
    const location = useLocation();
    const TraverseLearningData = location.state;
    const navigate = useNavigate();

    const Goback =()=>{
        navigate('/TraverseLearning');
    }

    window.addEventListener('message', (event) => {
        // Ensure the message is from an allowed origin (optional but recommended)
        if (event.origin === window.location.origin) {
          // Access the state sent from the parent window
          const receivedState = event.data.state;
      
          // Use the received state as needed
          console.log('Received State:', receivedState);
      
          // Handle the received state, e.g., update the component state
          // You can use the received state to make additional API requests or perform any necessary actions
        }
      });

  return (
    <>
    {/* <div><button onClick={Goback}>Back</button></div> */}
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100%"}}>
      <img src={TraverseLearningData} style={{height:"80%",width:"80%"}}/>
    </div>
    </>
  );
};

export default Media;
