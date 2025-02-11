import React,{useState,useEffect} from 'react';
import axios from 'axios';
import './Index.css'
function Index(){
    const [ismail,setNewMail] = useState("false");
    const [maildata,updateMailData] = useState({to_address:"",cc_address:"",subject:"",body:""});
    const [data,setData] = useState([]);
    const [isGetParticularMail,updateIsGetParticularMail] = useState("false");
    const [getParticularMailData,updateGetParticularMailData] = useState([]);

    function getData(){
        axios.get("http://127.0.0.1:8000/api/mail/").then(
            res=>{
                setData(res.data)
            }
        ).catch(error=>{console.error(error)})
    }

    useEffect(()=>{
        getData()
    },[])

    function sendMail(){
        axios.post("http://127.0.0.1:8000/api/mail/",maildata).then(
            res=>{
                if (res.data === "Invalid data"){
                    alert("Invalid data!!")
                }
                else{
                    alert("Mail sent successfully!!")
                    updateMailData(res.data)
                    setNewMail("false")
                    updateGetParticularMailData(res.data)
                    updateIsGetParticularMail("true")
                    getData()
                }
            }
            
        ).catch(error=>{console.error(error)})
    }

    function getMail(id){
        updateIsGetParticularMail("true")
        axios.get(`http://127.0.0.1:8000/api/mail/${id}/`).then(
            res=>{
                updateGetParticularMailData(res.data)
                getData()
            },
            setNewMail("false")
        ).catch(error=>{console.error(error)})
    }

    function deleteMail(id){
        axios.delete(`http://127.0.0.1:8000/api/mail/${id}/`).then(
            alert("Data deleted successfully!!"),
            getData(),
            setNewMail("false"),
            updateIsGetParticularMail("false"),

        ).catch(error=>{console.error(error)})
    }
    return(
    <div style={{height:'100vh',width:'100vw'}}>
        <div style={{height:'5%',width:'100%',background:"#0F6CBD",display:'flex',}}>
            <div style={{width:"15%",height:"100%",display:'flex',alignItems:"center"}}>
                <div style={{width:"20%",display:"flex",justifyContent:"center"}}><span class="material-symbols-outlined" style={{color:"white",fontSize:"30px"}}>apps</span></div>
                <div style={{width:"80%"}}><span style={{color:'white',fontWeight:'bolder',fontSize:"25px"}}>outlook</span></div>            
            </div>
            <div style={{width:"20%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                <input type='text' style={{width:"500px",height:"30px",borderRadius:"5px",padding:"6px",borderBlockStyle:"none",outline:"none",border:"none",boxShadow:"0 0 2px white"}} placeholder='search'/>
            </div>
            <div style={{width:"65%",height:"100%",display:"flex"}}>
                <div style={{width:"70%"}}></div>
                <div style={{width:"30%",display:"flex",justifyContent:"space-evenly"}}>
                    <span class="material-symbols-outlined icon">forum</span>
                    <span class="material-symbols-outlined icon">brightness_alert</span>
                    <span class="material-symbols-outlined icon">calendar_clock</span>
                    <span class="material-symbols-outlined icon">notifications</span>
                    <span class="material-symbols-outlined icon">settings</span>
                    <span class="material-symbols-outlined icon">emoji_objects</span>
                    <span class="material-symbols-outlined icon">account_circle</span>
                </div>
            </div>
            </div>
        <div style={{height:'95%',width:'100%',background:"#F5F5F5",display:"flex"}}>
            <div className="bar1" style={{width:"2.8%",height:"100%",background:"#EBEBEB",display:"flex",flexDirection:"column"}}>
                <span class="material-icons">drafts</span>
                <span class="material-icons ">calendar_month</span>
                <span class="material-icons">group</span>
                <span class="material-icons">groups</span>
                <span class="material-icons">check</span>
                <span class="material-icons">cloud</span>
                <span class="material-icons">grid_view</span>
            </div>
            <div style={{width:"97%",height:"100%"}}>
                <div className='bar2' style={{width:"100%",height:"5%",background:"#EBEBEB"}}>
                    <span class="material-icons" style={{fontSize:"30px"}}>menu</span>
                    <span>Home</span>
                    <span>View</span>
                    <span>Help</span>
                </div>
                <div className='bar2' style={{width:"100%",height:"5%",background:"white",display:"flex",alignItems:"center"}}>
                    <div className='btn btn-primary' style={{display:"flex",justifyContent:"center",alignItems:"center",height:"38px"}} onClick={()=>{setNewMail("true")}}><span class="material-symbols-outlined">mail </span>&nbsp;&nbsp;New mail</div>
                    <span class="material-symbols-outlined" style={{color:"gray"}}>delete </span>
                    <span class="material-symbols-outlined" style={{color:"green"}}>inventory_2 </span>
                    <span class="material-symbols-outlined" style={{color:"red"}}>gpp_maybe </span>
                    <span class="material-symbols-outlined" style={{color:"gray"}}>keep </span>
                    <span class="material-symbols-outlined" style={{color:"blue"}}>move_group </span>
                    <span class="material-symbols-outlined">| </span>
                    <span class="material-symbols-outlined" style={{color:"violet"}}>reply </span>
                    <span class="material-symbols-outlined" style={{color:"violet"}}>reply_all </span>
                    <span class="material-symbols-outlined" style={{color:"blue"}}>forward </span>
                    <span class="material-symbols-outlined">| </span>
                </div>
                <div style={{width:"100%",height:"90%",background:"#EBEBEB",display:"flex"}}>
                    <div style={{width:"10%",background:"#F0F0F0",display:"flex",flexDirection:"column"}}>
                        <div style={{margin:'8px'}}>
                            <span style={{fontSize:"17px",fontWeight:"bolder"}}>Favorites</span>
                            <div className="bar3" style={{display:"flex",flexDirection:"column",padding:"5px"}}>
                                <span><span class="material-symbols-outlined">inbox</span>&nbsp;&nbsp;<span>Inbox</span></span>
                                <span><span class="material-symbols-outlined">send</span>&nbsp;&nbsp;<span>Sent Items</span></span>
                                <span><span class="material-symbols-outlined">delete</span>&nbsp;&nbsp;<span>Deleted Items</span></span>
                            </div>
                            </div>
                        <div style={{margin:'8px'}}>
                            <span style={{fontSize:"17px",fontWeight:"bolder"}}>Folders</span>
                            <div className="bar3" style={{display:"flex",flexDirection:"column",padding:"5px"}}>
                                <span><span class="material-symbols-outlined">inbox</span>&nbsp;&nbsp;<span>Inbox</span></span>
                                <span><span class="material-symbols-outlined">edit_note</span>&nbsp;&nbsp;<span>Drafts</span></span>
                                <span><span class="material-symbols-outlined">send</span>&nbsp;&nbsp;<span>Sent Items</span></span>
                                <span><span class="material-symbols-outlined">delete</span>&nbsp;&nbsp;<span>Deleted Items</span></span>
                                <span><span class="material-symbols-outlined">folder_info</span>&nbsp;&nbsp;<span>Junk Email</span></span>
                                <span><span class="material-symbols-outlined">inventory_2</span>&nbsp;&nbsp;<span>Archive</span></span>
                                <span><span class="material-symbols-outlined">news</span>&nbsp;&nbsp;<span>Notes</span></span>
                                <span><span class="material-symbols-outlined">files</span>&nbsp;&nbsp;<span>Conversation</span></span>
                                <span><span class="material-symbols-outlined">files</span>&nbsp;&nbsp;<span>RSS Feeds</span></span>
                                <span><span class="material-symbols-outlined">document_search</span>&nbsp;&nbsp;<span>Search Folders</span></span>
                            </div>
                        </div>
                    </div>
                    <div className="mails" style={{width:"25%",height:"98%",margin:"5px",borderRadius:"5px",boxShadow:"0 0 10px rgba(112, 111, 111,0.3)"}}>
                        {/* Mails */}
                        {
                            data.map((item)=>{
                                return(
                                    <div onClick={()=>{getMail(item.id)}} style={{width:"97%",height:"10%",background:"white",margin:"5px",border:"10px",borderRadius:"2px",display:"flex"}}>
                                        <div style={{width:"15%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                                            <div style={{width:"80%",height:"70%",borderRadius:"50%",background:"rgba(14, 113, 241, 0.5)",display:"flex",justifyContent:"center",alignItems:"center"}}>{item.to_address[0]}</div>
                                        </div>
                                        <div style={{width:"85%",height:"100%",display:"flex",flexDirection:"column",padding:"7px"}}>
                                            <div style={{width:"100%",height:"40%",overflow:"hidden",fontSize:"18px",color:"rgba(15, 3, 3, 0.7)"}}>{item.subject}</div>
                                            <div style={{width:"100%",height:"60%",overflow:"hidden",fontSize:"13px",color:"rgba(124, 119, 119,0.9)"}}>{item.body}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{width:"75%",height:"100%",borderRadius:"10px"}}>
                        {/* Mail content */}
                        {ismail === "true" ? ( 
                            <div style={{width:"98%",height:"96%",background:"white",marginTop:"7px",borderRadius:"10px",boxShadow:"0 0 10px rgba(112, 111, 111,0.3)",display:"flex",flexDirection:"column",alignItems:"center"}}>
                                <div style={{width:"100%",height:"7%",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(112, 111, 111,0.3)"}}>
                                    <div style={{width:"50%",marginLeft:"10px"}}>
                                        <div className='btn btn-primary' style={{display:"flex",justifyContent:"center",alignItems:"center",height:"38px",width:"100px"}} onClick={()=>{sendMail()}}><span class="material-symbols-outlined">send </span>&nbsp;&nbsp;Send</div>
                                    </div>
                                    <div className='bar4' style={{width:"50%",display:"flex",flexDirection:'row-reverse',marginRight:"10px"}}>
                                        <span onClick={()=>{setNewMail("false")}}><span class="material-symbols-outlined">delete</span></span>
                                        <span><span class="material-symbols-outlined">open_in_new</span></span>
                                    </div>
                                </div>
                                <div style={{width:"98%",display:"flex",flexDirection:"column"}}>
                                    <div style={{marginTop:"2%"}}>
                                        <span style={{padding:"7px 20px",border:"1px solid rgba(112, 111, 111,0.2)",borderRadius:"3px",boxShadow:"0 0 5px white"}}>To</span>&nbsp;&nbsp;
                                        <input type='email' onChange={(e)=>{
                                            updateMailData({...maildata,to_address:e.target.value})
                                        }} style={{width:"94%",borderTop:"none",borderRight:"none",borderLeft:"none",borderBottom:"1px solid rgba(112, 111, 111,0.8)",outline:"none"}}/>
                                    </div>
                                    <div style={{marginTop:"2%"}}>
                                        <span style={{padding:"7px 18px",border:"1px solid rgba(112, 111, 111,0.2)",borderRadius:"3px",boxShadow:"0 0 5px white"}}>CC</span>&nbsp;&nbsp;
                                        <input type='email' onChange={(e)=>{
                                            updateMailData({...maildata,cc_address:e.target.value})
                                        }} style={{width:"94%",borderTop:"none",borderRight:"none",borderLeft:"none",borderBottom:"1px solid rgba(112, 111, 111,0.8)",outline:"none"}}/>
                                    </div>
                                    <div style={{marginTop:"2%"}}>
                                        <input type='text' onChange={(e)=>{
                                            updateMailData({...maildata,subject:e.target.value})
                                        }} style={{width:"99.5%",borderTop:"none",borderRight:"none",borderLeft:"none",borderBottom:"1px solid rgba(112, 111, 111,0.8)",outline:"none"}} placeholder='Add a subject'/>
                                    </div>
                                    <div style={{marginTop:"2%"}}>
                                        <textarea rows="20" cols="132" onChange={(e)=>{
                                            updateMailData({...maildata,body:e.target.value})
                                        }} style={{border:"none",outline:"none"}}/>
                                    </div>

                                </div>
                            </div>
                        ) : (
                                isGetParticularMail === "true" && getParticularMailData ? (
                                    <div style={{width:"98%",height:"98%",marginTop:"7px",borderRadius:"5px",boxShadow:"0 0 10px rgba(112, 111, 111,0.3)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                                        <div style={{width:"100%",height:"9%",margin:"5px",background:"white",borderRadius:"5px",padding:"15px",display:"flex",alignItems:"center",border:"1px solid rgba(112, 111, 111,0.5)"}}>
                                            <span style={{fontSize:"20px",fontWeight:"bolder"}}>{getParticularMailData.subject}</span>
                                        </div>
                                        <div style={{width:"100%",height:"91%",margin:"5px",background:"white",borderRadius:"5px",padding:"15px",display:"flex",flexDirection:"column",border:"1px solid rgba(112, 111, 111,0.5)"}}>
                                            {/* {getParticularMailData.body} */}
                                            <div style={{width:"100%",height:"10%",display:"flex",justifyContent:"space-between"}}>
                                                <div style={{width:"50%",height:"100%",display:"flex",alignItems:"center"}}>
                                                    <div style={{height:"100%",width:"11%",borderRadius:"50%",display:"flex",justifyContent:"center",alignItems:"center",background:"rgba(14, 113, 241, 0.5)",marginRight:"10px"}}>{getParticularMailData.to_address ? getParticularMailData.to_address[0]:"U"}</div>
                                                    <div style={{display:"flex",flexDirection:"column"}}>
                                                        <span style={{fontWeight:"bolder"}}>TO : {getParticularMailData.to_address}</span>
                                                        {getParticularMailData.cc_address ? 
                                                            <span style={{fontWeight:"bolder"}}>
                                                                CC : {getParticularMailData.cc_address}
                                                            </span>
                                                        :""}
                                                    </div>
                                                </div>
                                                <div style={{width:"50%",height:"100%",display:"flex",flexDirection:"row-reverse"}}>
                                                    <span class="material-symbols-outlined bar2" onClick={()=>{deleteMail(getParticularMailData.id)}}>delete</span>
                                                </div>
                                            </div>
                                            <div style={{width:"100%",height:"90%",whiteSpace:"pre-wrap",marginTop:"3%",padding:"2%"}}>{getParticularMailData.body}</div>
                                        </div>
                                    </div>
                                    
                                ) : (
                                    <div style={{width:"98%",height:"96%",background:"white",marginTop:"7px",borderRadius:"10px",boxShadow:"0 0 10px rgba(112, 111, 111,0.3)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                                        <div><span class="material-icons" style={{fontSize:"150px",color:"#05518b"}}>email</span></div>
                                        <div><span style={{color:"rgba(15, 3, 3, 0.7)",fontWeight:"bolder"}}>Select an item to read</span></div>
                                        <div><span style={{color:"rgba(124, 119, 119,0.9)"}}>Nothing is seleted</span></div>
                                    </div>
                                )  
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Index;