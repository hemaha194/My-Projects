import React, { useCallback, useState,useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import video from './video.mp4'
import { Button } from 'react-bootstrap';

const Layout = () => {
    const [videoFile, setVideoFile] = useState('');
    const [audioFile, setAudioFile] = useState('');
    const [audioVideoInfo,setAudioVideoInfo] = useState('')
    const [bgMusicUrl,setBgMusicUrl] = useState('')
    const [audioUrl,setAudioUrl] = useState('')

    const [Vduration, setVideoDuration] = useState(null);
    const [combinedMusicFile, setCombinedMusicFile] = useState(null);
    const [trimmedVideoId, setTrimmedVideoId] = useState(null);
    const [finalVideo,setFinalVideo] = useState(null);
    const [combinedMusicId , setCombinedMusicId] = useState(null);
    const [bgMusicData, setBgMusicData] = useState(null)


    const handleMetadata = (event) => {
      // Access the duration property from the video element
      const videoDuration = event.target.duration;
      setVideoDuration(videoDuration);
    };
    


    const handleFileChange = (event) => {
        const file=event.target.files[0]

        if (file) {
          // Create a URL for the selected file
          const videoUrl = URL.createObjectURL(file);
    
          // Create a temporary video element to get metadata
          const tempVideo = document.createElement('video');
    
          // Listen for the onLoadedMetadata event
          tempVideo.addEventListener('loadedmetadata', handleMetadata);
    
          // Set the source of the temporary video element
          tempVideo.src = videoUrl;
    
          // Trigger loading of metadata
          tempVideo.load();
        }

        setVideoFile(file);
      };

      const handleMusicFile = (event) => {
        const file=event.target.files[0]

        if (file) {
          // Create a URL for the selected file
          const audioUrl = URL.createObjectURL(file);
    
          // Create a temporary video element to get metadata
          const tempaudio = document.createElement('video');
    
          // Listen for the onLoadedMetadata event
          tempaudio.addEventListener('loadedmetadata', handleMetadata);
    
          // Set the source of the temporary video element
          tempaudio.src = audioUrl;
    
          // Trigger loading of metadata
          tempaudio.load();
        }

        setAudioFile(file);
      };
    

    const handleAudioExtraction = async () => {
        try {
          const formData = new FormData();
          formData.append('file', videoFile);
    
          const response = await axios.post('http://localhost:8000/api/videos/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then(res=>{
            const vid=res.data.id
            axios.get(`http://localhost:8000/api/videos/${vid}/`)
            .then(resp=>{
            setAudioVideoInfo(resp.data)
            setAudioUrl(resp.data.id)
            console.log(resp,"MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
            setTrimmedVideoId(res.data.id)

        })

          });
    
        } catch (error) {
          console.error('Error extracting audio:', error);
        }
    };

    const handleBgMusic = async () => {
      try {
        const formData = new FormData();
        formData.append('bgmusic', audioFile);
  
        const response = await axios.post('http://localhost:8000/api/bgMusic/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then(res=>{
          const bgURL=res.data.id
          const bgData = res.data.bgmusic.substring(8)
          setBgMusicData(bgData)

          console.log("bg dataaaaaaaaaaaaaaaaaaa",bgData)
          // setBgMusicUrl(res.data.bgmusic)
          const response = fetch('http://localhost:8000/api/combine-audio/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audioUrl, bgURL }),
          })
          .then(response => response.json())   //for getting response data 
          .then(data => {
            const combinedAudioId = data.combined_audio_id
            axios.get(`http://localhost:8000/api/combinedAudio/${combinedAudioId}/`).then(
              (res)=>{
                const combinedMusicFile = res.data.combinedMusic.substring(15)
                console.log(res.data,"HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
                setCombinedMusicFile(combinedMusicFile)
                const response = fetch('http://localhost:8000/api/finalVideo/', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: JSON.stringify({ trimmedVideoId, combinedAudioId }),
                })
                .then(response => response.json())  
                .then((res)=>{
                  setCombinedMusicId(res.combined_media_id)
                  axios.get(`http://localhost:8000/api/finalVideo/${res.combined_media_id}/`)
                  .then((res)=>{
                      console.log("re22222222",res)
                      const fvideoData = res.data.combined_video.substring(11)
                      console.log(fvideoData)
                      setFinalVideo(fvideoData)
                  })
                });

              }
            )

          }
            )
        });
  
      } catch (error) {
        console.error('Error extracting audio:', error);
      }
  };


  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/finalVideo/${combinedMusicId}/`,
        {
          responseType: 'arraybuffer', // Use arraybuffer to handle binary data
        }
      );
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'video/mp4' });
  
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'downloaded_video.mp4'; // Replace with the desired file name
  
      // Append the link to the document
      document.body.appendChild(link);
  
      // Trigger a click on the link to start the download
      link.click();
  
      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading video:', error.message);
    }
  };
  

    const generateInitialNodes =() =>{
        const initialNodes = [
            {
              id: 'horizontal-1',
              sourcePosition: 'right',
              type: 'input',
              data: { label: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div><b style={{fontSize:"10px"}}>Input Video</b></div>
                  {/* <hr style={{border:"1px solid rgba(255, 0, 114, 0.3)",width:"100%"}}/> */}
                  <input type="file" onChange={handleFileChange} style={{fontSize:"5px",marginTop: '7px'}}/>
                  <br/>
                    {videoFile && (
                        <>
                        {/* <div style={{fontSize:"6px",color:'GrayText',display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>{videoFile.name}</div> */}
                        <button onClick={handleAudioExtraction} style={{fontSize:"6px",marginTop: '7px'}}>Extract Here</button>
                        {/* <Button className="btn-icon btn-icon-start ms-1" type="button" onClick={handleAudioExtraction}>
                        <h5>
                          <b>Extract Here</b>
                        </h5>
                      </Button> */}
                        </>
                    )}
              </div> },
              position: { x: 0, y: 50 },
              style: {
                border: '1px solid #FF0072', // Set border style and color
                borderRadius: '8px', // Set border radius
                boxShadow: '0px 0px 8px rgba(255, 0, 114, 0.3)'
              },
            },
            {
              id: 'horizontal-11',
              sourcePosition: 'right',
              type: 'input',
              data: { label: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <b>Background music</b>
                  {/* <hr style={{border:"1px solid rgba(255, 0, 114, 0.3)",width:"100%"}}/> */}
                  <input type="file" onChange={handleMusicFile} style={{fontSize:"5px",marginTop: '7px'}}/>
                  <br/>
                  {/* {console.log("JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ",audioFile)} */}
                    {audioFile && (
                        <>
                        <audio src={bgMusicData} style={{height:"10px",width:"120px"}} controls/>
                        <button onClick={handleBgMusic} style={{fontSize:"6px",marginTop: '7px'}}>Add BgMusic</button>
                        </>
                    )}
              </div> },
              position: { x: 0, y: 300 },
              style: {
                border: '1px solid #FF0072', // Set border style and color
                borderRadius: '8px', // Set border radius
                boxShadow: '0px 0px 8px rgba(255, 0, 114, 0.3)'
              },
            },
            {
              id: 'horizontal-2',
              sourcePosition: 'right',
              targetPosition: 'left',
              data: { label: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <b>Trimmed Video</b>
                  {/* <hr style={{border:"1px solid rgba(255, 0, 114, 0.3)",width:"100%"}}/> */}
                  <div style={{fontSize:"7px",marginTop: '10px',display: 'flex'}}>
                    <span style={{fontSize:"7px"}}>Trim:&nbsp;</span>
                    <span style={{fontSize:"6px"}}>{audioVideoInfo.extracted_video}</span>
                  </div> 
                  <p style={{color:'GrayText',fontSize:"7px"}}>Duration = {Math.floor(Vduration)} sec </p>
                  {audioVideoInfo.extracted_video && (
                    
                    <video src={audioVideoInfo.extracted_video} style={{height:"100px",width:"170px"}} controls/>
                    
                  )}
              </div> },
              position: { x: 250, y: -40 },
              style: {
                border: '1px solid #FF0072', // Set border style and color
                borderRadius: '8px', // Set border radius
                boxShadow: '0px 0px 8px rgba(255, 0, 114, 0.3)',
                width:190
              },
            },
            {
              id: 'horizontal-3',
              sourcePosition: 'right',
              targetPosition: 'left',
              data: { label: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <b>Trimmed audio</b>
                  {/* <hr style={{border:"1px solid rgba(255, 0, 114, 0.3)",width:"100%"}}/> */}
                  <div style={{fontSize:"7px",marginTop: '10px',display:"flex"}}>
                    <span>Atrim:</span>&nbsp;
                    <span style={{fontSize:"6px"}}>{audioVideoInfo.audio}</span>
                  </div> 
                  <p style={{color:'GrayText',fontSize:"7px"}}>Duration = {Math.floor(Vduration)} sec </p>
                  {audioVideoInfo.audio && (
                    <>
                    <audio src={audioVideoInfo.audio} style={{height:"10px",width:"170px"}} controls/>
                    </>
                  )}
              </div> },
              position: { x: 250, y: 160 },
              style: {
                border: '1px solid #FF0072', // Set border style and color
                borderRadius: '8px', // Set border radius
                boxShadow: '0px 0px 8px rgba(255, 0, 114, 0.3)',
                width:190
              },
            },
            {
              id: 'horizontal-4',
              sourcePosition: 'right',
              targetPosition: 'left',
              data: { label: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <b>Audio + background music</b>
                  {/* <hr style={{border:"1px solid rgba(255, 0, 114, 0.3)",width:"100%"}}/> */}
                  <div style={{display:"flex",fontSize:"7px",marginTop: '7px'}}>
                    <p style={{fontSize:"7px"}}>Amix:</p>&nbsp;
                    <span style={{fontSize:"6px",marginTop:"6px"}}>{combinedMusicFile}</span>
                    </div><br/>
                  {combinedMusicFile && (
                    <>
                    <audio src={combinedMusicFile} style={{height:"10px",width:"130px",fontSize:"10px"}} controls/>
                    </>
                  )}
                  {/* <div style={{color:'GrayText',fontSize:"7px",display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                  <span>inputs =</span><br/>
                  <span>duration =</span><br/>
                  <span>dropout_transition =</span><br/>
                  <span>weights =</span><br/>
                  <span>normalize =</span>
                  </div> */}
              </div> },
              position: { x: 490, y: 300 },
              style: {
                border: '1px solid #FF0072', // Set border style and color
                borderRadius: '8px', // Set border radius
                boxShadow: '0px 0px 8px rgba(255, 0, 114, 0.3)'
              },
            },
            {
              id: 'horizontal-5',
              sourcePosition: 'right',
              targetPosition: 'left',
              data: { label: <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <b>Final video</b>
                  {/* <hr style={{border:"1px solid rgba(255, 0, 114, 0.3)",width:"100%"}}/> */}
                  {/* <span style={{fontSize:"6px",marginTop: '7px'}}>{finalVideo}</span><br/> */}
                  {finalVideo && (
                    <>
                    <video src={finalVideo} style={{height:"170px",width:"180px"}} controls/>
                    </>
                  )}
                  {/* {finalVideo && (
                  <button onClick={handleDownload} style={{ marginTop: '5px', fontSize: '8px' }}>
                      Download Final Video
                  </button>
            )} */}
              </div> },
              position: { x: 550, y: 0 },
              style: {
                border: '1px solid #FF0072', // Set border style and color
                borderRadius: '8px', // Set border radius
                boxShadow: '0px 0px 8px rgba(255, 0, 114, 0.3)',
                width:200,
              },
            },
          ];
        return initialNodes
    }

    const generateEdges = ()=>{
        const initialEdges = [
            {
              id: 'horizontal-e1-2',
              source: 'horizontal-1',
              type: 'smoothstep',
              target: 'horizontal-2',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#FF0072',
              },
              style: {
                stroke: '#FF0072',
              },
            },
            {
              id: 'horizontal-e1-3',
              source: 'horizontal-1',
              type: 'smoothstep',
              target: 'horizontal-3',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#FF0072',
              },
              style: {
                stroke: '#FF0072',
              },
            },
            {
              id: 'horizontal-e11-4',
              source: 'horizontal-11',
              type: 'smoothstep',
              target: 'horizontal-4',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#FF0072',
              },
              style: {
                stroke: '#FF0072',
              },
            },
            {
              id: 'horizontal-e3-4',
              source: 'horizontal-3',
              // type: 'smoothstep',
              target: 'horizontal-4',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#FF0072',
              },
              style: {
                stroke: '#FF0072',
              },
            },
            {
              id: 'horizontal-e2-5',
              source: 'horizontal-2',
              // type: 'smoothstep',
              target: 'horizontal-5',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#FF0072',
              },
              style: {
                stroke: '#FF0072',
              },
            },
            {
              id: 'horizontal-e4-5',
              source: 'horizontal-4',
              // type: 'smoothstep',
              target: 'horizontal-5',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#FF0072',
              },
              style: {
                stroke: '#FF0072',
              },
            },
          ];

        return initialEdges;
    }

    const [nodes, setNodeData, onNodesChange] = useNodesState(generateInitialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(generateEdges);
    const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

    useEffect(() => {
        // Update the node data when videoFile changes
        setNodeData(generateInitialNodes());
      }, [videoFile,audioVideoInfo.audio,audioFile,combinedMusicFile,finalVideo,bgMusicData]);

    return (
      <>
        <div style={{fontSize:"2rem",fontWeight:"bolder",textAlign:"center",color:"#FF0072"}}><u>FFMPEG</u></div>
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
            ></ReactFlow>
        </div>
      </>
    );
};

export default Layout;
