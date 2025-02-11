import axios from 'axios';
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import {  Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './index.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

import "primereact/resources/themes/lara-light-cyan/theme.css";



const AddNodeOnEdgeDrop = () => {
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [isedit, setisedit] = useState(false);
    const [position, setPosition] = useState({})
    const [title ,setTitle] = useState("")
    const [nodesData , setNodesData] = useState({})
    const [saveButton,setSaveButton] =useState(true)
    const [isOpen, setIsOpen] = useState(false);
    const [content ,setContent] = useState("");
    const [contentId ,setContentId] = useState(null);
    
    const [editingNodeId, setEditingNodeId] = useState(null);
    const [editedNodeData, setEditedNodeData] = useState({ label: "" });

    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [openFlashCard ,setOpenFlashCard] = useState(null)
    const [totalFlashCards ,setTotalFlashCards] = useState([])
    const [totalFilesData , setTotalFilesData] = useState([])
    const [flashcardUpdate ,setFlashcardUpdate] = useState(false)
    const [flashcardId ,setFlashcardId] = useState('')
    const [selectedFile,setSelectedFile] =useState('')

    const [isZoom ,setIsZoom] = useState(false)
    const [attachments ,setAttachments] = useState('')

    const toast = useRef(null);

    const navigate = useNavigate();

    const [isDelete, setIsDelete] = useState(false);
  
    const location = useLocation();
    const traverseData = location.state;

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
      setSelectedFile(e.target.files[0].name)
    };

  
    const getId = () => `node_${Math.random().toString(36).substr(2, 9)}`;
  
    const initialNodes = [
      {
        id: getId(),
        type: 'input',
        data: { label: 'Node' },
        position: { x: 0, y: 50 },
      },
    ];

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };

    const handleEditNode = (id) => {
      console.log("clickeddd",id)
      setEditingNodeId(id)
    };
  
    const handleSaveEdit = (e) => {
      if (e.key === 'Enter') {
        axios.put(`http://localhost:8000/api/nodes/${editingNodeId}/`, {
              label: e.target.value,
          })
        setEditingNodeId(null);
      }
     
    };

    const handleOpenModal = (node) => {
      setIsOpen(true);
      setTitle(node.label)
      setContentId(node.id)
      setContent(node.content)

      axios.get(`http://localhost:8000/api/totalflashcards/${node.id}/`)
      .then(res =>{
        setTotalFlashCards(res.data)
      })

      axios.get(`http://localhost:8000/api/files/${node.id}/`)
          .then(res=>{
            console.log("responseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee filesssssssssss",res.data)
            setTotalFilesData(res.data)
      })
    };

    const handleOpenFlashCard =()=>{
      setOpenFlashCard(true)
      setBack("")
      setFront("")
    }

    const handleCloseFlashcard =()=>{
      setOpenFlashCard(false)
      setFlashcardUpdate(false)
    }
  
    const handleCloseModal = () => {
      fetch(`http://localhost:8000/api/flashcard/${contentId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
        }),
      })
        setContentId(null)
        setIsOpen(false);
    };

    const createFlashCard = () => {
      axios
        .post(`http://localhost:8000/api/flashcards/${contentId}/`, {
          front: front,
          back: back,
        })
        .then((response) => {
          setFront('');
          setBack('');
          setOpenFlashCard(false);
    
          // Fetch and update flashcards for the current node
          axios.get(`http://localhost:8000/api/totalflashcards/${contentId}/`)
            .then(res => {
              console.log("responseeeeeeeeeeeeeeeeeeeeeee", res.data);
              setTotalFlashCards(res.data);
            })
            .catch(error => {
              console.error('Error fetching flashcards:', error);
            });
        })
        .catch((error) => {
          console.error('Error saving flashcard:', error);
        });
    };

    const HandleClick = (card)=>{
      setFlashcardId(card.id)
      axios.get(`http://localhost:8000/api/particularFlashcard/${card.id}/`)
      .then(res =>{
        setBack(res.data.back)
        setFront(res.data.front)
        setOpenFlashCard(true)
        setFlashcardUpdate(true)
      })
    }

    const UpdateFlashCard = () => {
      fetch(`http://localhost:8000/api/particularFlashcard/${flashcardId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          front: front,
          back: back,
        }),
      })
        .then(() => {
          setOpenFlashCard(false);
          setFlashcardUpdate(false);
    
          // Fetch and update flashcards for the current node immediately after updating a flashcard
          axios.get(`http://localhost:8000/api/totalflashcards/${contentId}/`)
            .then(res => {
              console.log("Updated flashcards:", res.data);
              setTotalFlashCards(res.data);
            })
            .catch(error => {
              console.error('Error fetching flashcards:', error);
            });
        })
        .catch((error) => {
          console.error('Error updating flashcard:', error);
        });
    };

    const handleOptionsMenuToggle = (node) => {
      setIsDelete(node.id);
    };

    const DeleteNode = (id) => {
      // Display a confirmation dialog
      const userConfirmed = window.confirm("Are you sure you want to delete this node?");
    
      // Check if the user confirmed
      if (userConfirmed) {
        axios.delete(`http://localhost:8000/api/delete_node/${id}/`)
          .then(res => {
            // Remove the deleted node and its related edges from the state
            setNodes((prevNodes) => prevNodes.filter(node => node.id !== id));
            setEdges((prevEdges) => prevEdges.filter(edge => edge.source !== id && edge.target !== id));
            setIsDelete(false)
          })
          .catch(error => {
            console.error("Error deleting node:", error);
          });
      } else {
        setIsDelete(false)
      }
    };

    const DeleteFlashcard = (id) => {
      // Display a confirmation dialog
      const userConfirmed = window.confirm("Are you sure you want to delete this node?");
    
      // Check if the user confirmed
      if (userConfirmed) {
        axios.delete(`http://localhost:8000/api/delete_flashcard/${id}/`)
          .then(res => {
            // Remove the deleted node and its related edges from the state
            setIsDelete(false)

            // Fetch and update flashcards for the current node immediately after updating a flashcard
            axios.get(`http://localhost:8000/api/totalflashcards/${contentId}/`)
            .then(res => {
              console.log("Updated flashcards:", res.data);
              setTotalFlashCards(res.data);
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

    const handleUpload = async () => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('contentId', contentId); // Add this line to include contentId
    
        await axios.post(`http://localhost:8000/api/uploadFile/${contentId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(res => {
          axios.get(`http://localhost:8000/api/files/${contentId}/`)
            .then(res => {
              setTotalFilesData(res.data);
              setSelectedFile('');
            });
        });
    
      } catch (error) {
        console.error('Error uploading file', error);
      }
    };
    

    const handleItemClick = (item) =>{
      // navigate('/media', { state: item.file.substring(7) });
      setIsZoom(true)
      setAttachments(item.file)
      
      
    }

    useEffect(() => {
      axios.get(`http://localhost:8000/api/traverse/${traverseData.id}/`)
        .then(res => {
          console.log("Responsed data", res.data);
          setNodesData(res.data);
          const defaultData = res.data
    
          if (defaultData && defaultData.nodes && defaultData.nodes.length > 0) {
            // Process nodes and edges here
            const mappedNodes = defaultData.nodes.map((node,index) => ({
              id: node.id.toString(),
              data: {
                label: (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    {editingNodeId === node.id ? (
                      <>
                      <div style={{ fontWeight: 'bolder', fontSize: '8px' }}><input type='text' defaultValue={node.label} onKeyDown={(e)=>{handleSaveEdit(e)}} style={{width:"90%"}}/></div>
                      <div style={{ fontSize: '5px' }}>{stripHtmlTags(node.content).length > 22 ? `${stripHtmlTags(node.content).slice(0, 22)}...Open` : stripHtmlTags(node.content)}</div>
                      </>
                    ):(
                      <>
                      {traverseData.text === node.label ? (
                        <>
                        <div style={{ fontWeight: 'bolder', fontSize: '15px' }} onClick={() => handleEditNode(node.id)}>{node.label.length>15 ? `${node.label.slice(0,15)}...` :node.label}</div>
                        </>
                      ) : (
                        <>
                        <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                          <div style={{ fontWeight: 'bolder', fontSize: '10px' }} onClick={() => handleEditNode(node.id)}>{node.label.length>15 ? `${node.label.slice(0,15)}...` :node.label}</div>
                          <div style={{ position: 'relative' }}>
                            <i
                              className="fa-solid fa-ellipsis-vertical"
                              style={{ fontSize: '8px', cursor: 'pointer' }}
                              onClick={()=>{handleOptionsMenuToggle(node)}}
                            ></i>
                            {node.id === isDelete && (
                              <div style={{ position: 'absolute', top: '1px', right: 0, background: 'white', border: '1px solid #ccc' }}>
                                <div onClick={()=>{DeleteNode(node.id)}} style={{padding:"3px",fontSize:"6px"}}>Delete</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: '8px' }} onClick={()=>{handleOpenModal(node)}}>{stripHtmlTags(node.content).length > 22 ? `${stripHtmlTags(node.content).slice(0, 22)}...Open` : stripHtmlTags(node.content)}</div>
                        </>
                      )}  
                      </>
                    )}
                  </div>
                ),
                editable: true,
              },
              position: { x: node.position_x, y: node.position_y },
            }));
    
            const mappedEdges = defaultData.edges.map(edge => ({
              id: edge.id.toString(), // ReactFlow requires id to be a string
              source: edge.source.toString(),
              target: edge.target.toString(),
              // animated: true, // You can customize this based on your edge structure
              label: edge.label, // You can customize this based on your edge structure
            }));
    
            setNodes(mappedNodes);
            setEdges(mappedEdges);
          } else {
            setNodes([
              {
                id: getId(),
                type: 'input',
                data: { label: traverseData.text },
                position: { x: 0, y: 50 },
              },
            ]);
          }
        });
    }, [traverseData, setNodes, setEdges,editingNodeId,contentId,isDelete]);
    
      
  
    const onConnect = useCallback(
      (params) => {
        // reset the start node on connections
        connectingNodeId.current = null;
        setEdges((eds) => addEdge(params, eds));
      },
      []
    );
  
    const handleUpdate = (id) => {
      console.log("clicked", id);
      setisedit(true);
      console.log("MMMMMMMMMMMMMMMMMMMMMMMMMM", isedit);
    };
  
    const isEqual = (obj1, obj2) => {
        if (obj1 === obj2) {
          return true;
        }
      
        if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
          return false;
        }
      
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
      
        if (keys1.length !== keys2.length) {
          return false;
        }
      
        for (const key of keys1) {
          if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) {
            return false;
          }
        }
      
        return true;
      };

      const onSave = async () => {
        try {
          // Fetch existing nodes from the server
          const existingNodesResponse = await axios.get(`http://localhost:8000/api/traverse/${traverseData.id}/`);
          const existingNodes = existingNodesResponse.data.nodes || [];
      
          // Identify nodes that already exist in the API response based on matching position_x and position_y
          const existingNodePositions = existingNodes.map(existingNode => ({
            position_x: existingNode.position_x,
            position_y: existingNode.position_y,
          }));
      
          // Filter out nodes that already exist in the API response
          const newNodes = nodes.filter(node => {
            const nodePosition = {
              position_x: node.position.x,
              position_y: node.position.y,
            };
            return !existingNodePositions.some(existingNodePosition =>
              isEqual(existingNodePosition, nodePosition)
            );
          });
      
          // Save initial nodes along with new nodes
          const allNodes = initialNodes.concat(newNodes);

          console.log("all nodessssssssssss",initialNodes,newNodes)

          // Save new nodes
          const nodesPromises = newNodes.map(async (node,index) => {
            console.log("nodeeeeeeeeeeeee",node)
            axios.get(`http://localhost:8000/api/traverse/${traverseData.id}/`)
            .then(res=>{
              const defaultData = res.data
              let label
              let content
              if (defaultData && defaultData.nodes && defaultData.nodes.length > 0){
                label=  node.data.label.props.children[1].props.children;
                content=  node.data.label.props.children[2].props.children;
              }
              else{
                if (index === 0) {
                  label = node.data.label;
                  content = node.data.label
                } else {
                  label = node.data.label.props.children[1].props.children;
                  content = node.data.label.props.children[2].props.children;
                }
              }
              
              const response = fetch('http://localhost:8000/api/nodes/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: node.id,
                traverse: traverseData.id,
                type: 'input',
                label:label,
                content:content,
                position_x: node.position.x,
                position_y: node.position.y,
              }),
            });
            // return response.json();
          });
          
          })
          const nodesData = await Promise.all(nodesPromises);
          console.log('Nodes saved successfully:', nodesData);
  
      
          // Save edges
          const edgesPromises = edges.map(async (edge) => {
            const response = await fetch('http://localhost:8000/api/edges/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(edge),
            });
            // return response.json();
          });
      
          const edgesData = await Promise.all(edgesPromises);
          console.log('Edges saved successfully:', edgesData);
        } catch (error) {
          console.error('Error saving changes:', error);
        }
      
        axios.get(`http://localhost:8000/api/traverse/${traverseData.id}/`)
          .then(res => {
            console.log("Responsed data", res.data);
          });
      };
      
      
  
    const onConnectStart = useCallback((_, { nodeId }) => {
      connectingNodeId.current = nodeId;
    }, []);
  
    const onConnectEnd = useCallback(
        async (event) => {
          if (!connectingNodeId.current) return;
      
          const targetIsPane = event.target.classList.contains('react-flow__pane');
      
          if (targetIsPane) {
            const id = getId();
            const position = screenToFlowPosition({
              x: event.clientX,
              y: event.clientY,
            });
      
            const newNode = {
              id: id,
              position,
              data: {
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {console.log(isedit, 'isedit')}
                    <div>Untitle</div>
                    <div style={{ fontSize: '5px' }}>Add content and media</div>
                  </div>
                ),
              },
              origin: [0.5, 0.0],
            };
      
            setNodes((nds) => nds.concat(newNode));
            setEdges((eds) => eds.concat({ traverse: traverseData.id, id, source: connectingNodeId.current, target: id }));
          }
        },
        [screenToFlowPosition, connectingNodeId, isedit, handleUpdate, setNodes, setEdges, title]
      );
      
      const formats= [
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'link','image'
      ];

      const renderFile = (filePath) => {
        const fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1);
      
        if (fileExtension === 'mp3' || fileExtension === 'wav') {
          return <audio controls src={filePath.substring(7)} style={{height:"100%",width:"100%"}} />;
        } else if (fileExtension === 'mp4') {
          return <video controls src={filePath.substring(7)} style={{height:"100%",width:"100%"}} />;
        } else {
          return <img src={filePath.substring(7)} style={{height:"100%",width:"100%"}} />;
        }
      };

      const handleCloseZoom =()=>{
        setIsZoom(false)
      }
      
      
  
    return (
      <div className="wrapper" ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh' }}>
        {saveButton && (
          <Button
          className="btn-icon rounded-xl"
          variant="outlined"
          style={{ borderColor: 'grey' ,marginBottom:"15px",height:"40px",width:"170px",background:"#9a7ce6",margin:"15px"}}
          onClick={onSave}
        >
          <Typography variant="subtitle1" style={{ fontWeight: 'bold',color:"white" , textTransform: 'none'}}>
            Save
          </Typography>
        </Button>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          fitView
          fitViewOptions={{ padding: 2 }}
          nodeOrigin={[0.5, 0]}
        />
        <Dialog open={isOpen} onClose={handleCloseModal} PaperProps={{ style: { maxWidth: '750px', width: '100%', height: '80%' ,borderRadius:"8px"} }}>
        <DialogContent style={{ maxWidth: '850px' }}>
          {/* <div style={{height:"10px",width:"1500px",background:"blue",marginTop:"-20px"}}></div> */}
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{fontWeight: 'bold',fontSize:"25px"}}>{title}</div>
            <div><i className="fa-solid fa-xmark" style={{fontSize:"22px",cursor:"pointer"}} onClick={handleCloseModal}></i></div>
          </div>
          <br/>
          <hr/>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <Button
              className="btn-icon rounded-xl"
              variant="outlined"
              style={{ borderColor: 'grey' ,marginBottom:"15px",height:"30px",width:"170px"}}
              onClick={(e)=>{handleOpenFlashCard()}}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 'bold',color:"black" , textTransform: 'none'}}>
                + New Flashcard
              </Typography>
            </Button>
            <div>
              <div style={{display:"flex"}}>
                <div><input type="file" onChange={handleFileChange} accept="image/*,audio/*,video/*" style={{marginTop:"6px",width:"82px"}} /></div>
                <div><Button
                    className="btn-icon rounded-xl"
                    variant="outlined"
                    style={{ borderColor: 'grey' ,marginBottom:"15px",height:"30px",width:"50px"}}
                    onClick={handleUpload}
                  >
                    <i class="fa-solid fa-upload"></i>
                </Button></div>
              </div>
              <div style={{marginTop:"1px"}}>{selectedFile && (
                <>
                {selectedFile}
                </>
              )}</div>
              {/* <div className="card flex justify-content-center">
                <Toast ref={toast}></Toast>
                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={handleUpload} />
              </div> */}
            </div>

          </div>
          <ReactQuill
            className="me-3"
            style={{
              minHeight: '100px',
              height:"300px",
              width: '680px',
              borderRadius: '5px',
              border: '1px solid #ced4da', // Optional: Add border for better visibility
              overflow:"hidden",
              marginBottom:"40px"
            }}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike','blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link','image'],
                ['clean'],['youtube-link'],
              ],
            }}
            formats={formats}
            value={content}
            onChange={(value) => setContent(value)}
            theme='snow'
          />

        <div >
            <div>{`Media files (${totalFilesData.length})`}</div>
            <hr/>
            <div style={{width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            { totalFilesData.map(item =>(
                <div style={{border:"1px solid grey",width:"200px",height:"80px",margin:"10px",display:"flex",flexDirection:"column"}}>
                    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}} onClick={()=>{handleItemClick(item)}} >{renderFile(item.file)}</div>
                </div>
            ))}
            </div>
        </div>

          <div >
            <div>{`Flashcards (${totalFlashCards.length})`}</div>
            <hr/>
            <div style={{width:"100%",display:"flex",flexDirection:"row",flexWrap:"wrap"}}>
            { totalFlashCards.map(item =>(
                <div style={{border:"1px solid grey",width:"200px",height:"80px",margin:"10px",display:"flex",flexDirection:"column"}}>
                    <div style={{width:"100%",height:"4px",background:"#784be8"}}></div>
                    <div style={{ position: 'relative',display:"flex",justifyContent:"flex-end" }}>
                            <i
                              className="fa-solid fa-ellipsis-vertical"
                              style={{ fontSize: '14px', cursor: 'pointer' }}
                              onClick={()=>{handleOptionsMenuToggle(item)}}
                            ></i>
                            {item.id === isDelete && (
                              <div style={{ position: 'absolute', top: '1px', right: 0, background: 'white', border: '1px solid #ccc' }}>
                                <div onClick={()=>{DeleteFlashcard(item.id)}} style={{padding:"5px",fontSize:"12px"}}>Delete</div>
                              </div>
                            )}
                          </div>
                    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}} onClick={()=>{HandleClick(item)}}>{stripHtmlTags(item.front).length > 22 ? `${stripHtmlTags(item.front).slice(0, 22)}...` : stripHtmlTags(item.front)}</div>
                </div>
            ))}
        </div>
        </div>

        </DialogContent>
      </Dialog>



      <Dialog open={openFlashCard} onClose={handleCloseFlashcard}>
        <DialogContent style={{ maxWidth: '850px' }}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{fontWeight: 'bold'}}>New Flashcard</div>
            <div><i className="fa-solid fa-xmark" onClick={handleCloseFlashcard}></i></div>
          </div>
          <br/>
          <hr/>
          <div style={{marginBottom:"8px"}}>
            <div>Front</div>
            <ReactQuill
              className="me-3"
              style={{
                // minHeight: '200px',
                height:"100px",
                width: '500px',
                borderRadius: '8px',
                border: '1px solid #ced4da', // Optional: Add border for better visibility
                overflow:'hidden'
              }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  ['clean'],
                ],
              }}
              value={front}
              onChange={(value) => setFront(value)}
              theme='snow'
            />
          </div>

          <div style={{marginBottom:"15px"}}>
            <div>Back</div>
            <ReactQuill
              className="me-3"
              style={{
                // minHeight: '200px',
                height:"200px",
                width: '500px',
                borderRadius: '8px',
                border: '1px solid #ced4da', // Optional: Add border for better visibility
                overflow:'hidden'
              }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  ['clean'],
                ],
              }}
              value={back}
              onChange={(value)=>{setBack(value)}}
              theme='snow'
            />
          </div>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            {flashcardUpdate ? (
              <>
               <Button
              className="btn-icon rounded-xl"
              variant="outlined"
              style={{ borderColor: 'grey' ,marginBottom:"15px",height:"40px",width:"170px",background:"black"}}
              onClick={UpdateFlashCard}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 'bold',color:"white" , textTransform: 'none'}}>
                Save
              </Typography>
            </Button>
              </>
            ) : (
              <>
              <Button
              className="btn-icon rounded-xl"
              variant="outlined"
              style={{ borderColor: 'grey' ,marginBottom:"15px",height:"40px",width:"170px",background:"black"}}
              onClick={createFlashCard}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 'bold',color:"white" , textTransform: 'none'}}>
                Create Flashcard
              </Typography>
            </Button>
              </>
            )}
            
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isZoom} onClose={handleCloseZoom}>
        <DialogContent style={{ maxWidth: '600px' ,height:"700px",display:"flex",justifyContent:"center",alignItems:"center"}}>
        {renderFile(attachments)}
        </DialogContent>
      </Dialog>
      
      </div>
    );
  };
  
  export default () => (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  );
  
