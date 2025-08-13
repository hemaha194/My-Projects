// TraverseComponent.jsx
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';


const TraverseComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [traverseData, setTraverseData] = useState([]);
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    console.log("okkkkkkkkkkkkkk", text);
    const body = { "text": text };

    try {
      const response = await axios.post('http://localhost:8000/api/traverse/', body);
      setTraverseData(response.data);
      console.log("dataaaaaaaaaaaaa",response.data)
      navigate('/TraverseLearning', { state: response.data });
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    setIsOpen(false);
  };

  useEffect(()=>{
    axios.get(`http://localhost:8000/api/traverseData/`)
    .then(res=>{
        console.log(res.data)
        setTraverseData(res.data)
    })
  },[])

  const HandleClick = (id)=>{
    axios.get(`http://localhost:8000/api/traverseParticular/${id}/`)
    .then(res=>{
        console.log(res.data)
        navigate('/TraverseLearning', { state: res.data });
    })
  }

  const handleOptionsMenuToggle = (node) => {
    setIsDelete(node.id);
  };

  const DeleteTraverseNode = (id) => {
    // Display a confirmation dialog
    const userConfirmed = window.confirm("Are you sure you want to delete this node???");
  
    // Check if the user confirmed
    if (userConfirmed) {
      axios.delete(`http://localhost:8000/api/delete_traversenode/${id}/`)
        .then(res => {
          // Remove the deleted node and its related edges from the state
          setIsDelete(false)

          axios.get(`http://localhost:8000/api/traverseData/`)
          .then(res=>{
              console.log(res.data)
              setTraverseData(res.data)
          })

        .catch(error => {
          console.error('Error fetching flashcards:', error);
        });
        })
        .catch(error => {
          console.error("Error deleting node:", error);
        });
    } else {
      setIsDelete(false)
    }
  };


  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
      <h1>Suggested</h1>
        <Button
            className="btn-icon rounded-xl"
            variant="outlined"
            style={{ borderColor: 'grey' ,marginBottom:"15px",height:"40px",width:"170px",background:"green",margin:"10px"}}
            onClick={handleOpenModal}
          >
            <Typography variant="subtitle1" style={{ fontWeight: 'bold',color:"white" , textTransform: 'none',fontSize:"18px"}}>
            + New Traverse
            </Typography>
          </Button>
      </div>
      
      <Dialog open={isOpen} onClose={handleCloseModal}>
        <DialogTitle>I want to learn</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter text"
            type="text"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
          <Button onClick={handleCloseModal} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
        <div style={{width:"100%",height:"90%",display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            { traverseData.map(item =>(
                <div style={{border:"1px solid grey",width:"300px",height:"140px",margin:"18px",display:"flex"}}>
                    <div style={{width:"25%",height:"140px",background:"green"}}></div>
                    <div style={{width:"100%",height:"140px",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}} onClick={()=>{HandleClick(item.id)}}>{item.text}</div>
                    <div style={{ position: 'relative',marginRight:"3px"}}>
                            <i
                              className="fa-solid fa-ellipsis"
                              style={{ fontSize: '14px', cursor: 'pointer' }}
                              onClick={()=>{handleOptionsMenuToggle(item)}}
                            ></i>
                            {item.id === isDelete && (
                              <div style={{ position: 'absolute', top: '1px', right: 0, background: 'white', border: '1px solid #ccc' }}>
                                <div onClick={()=>{DeleteTraverseNode(item.id)}} style={{padding:"5px",fontSize:"12px"}}>Delete</div>
                              </div>
                            )}
                          </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default TraverseComponent;
