import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ViewList.css";
import {Dialog} from "primereact/dialog"
function ViewList(){
    const [data,getData]=useState([])
    const [filterValue,filterUpdate]=useState("")
    const [visible,setVisible]=useState(false)
    const [sdata,storedata]=useState({})

    useEffect(()=>{
        if(filterValue==="thisWeek"){
            axios.get(`http://127.0.0.1:8000/recipe/api/${filterValue}`).then(
                response=>{
                    getData(response.data)
                }
            )
        }
        else if(filterValue==="lastWeek"){
            axios.get(`http://127.0.0.1:8000/recipe/api/${filterValue}`).then(
                response=>{
                    getData(response.data)
                }
            )
        }
        else if(filterValue==="all"){
            axios.get("http://127.0.0.1:8000/recipe/api").then(
            res=>{
                // console.log(res.data)
                getData(res.data)
            }
        )
        }
        else{
            axios.get("http://127.0.0.1:8000/recipe/api").then(
            res=>{
                // console.log(res.data)
                getData(res.data)
            }
        )
        }
        
    },[filterValue])

    function deleteHandler(id){
        const confirm=window.confirm("Are you sure want to delete....")
        if(confirm){
            axios.delete("http://127.0.0.1:8000/recipe/api/"+id).then(
                alert("Field deleted successfully"),
                axios.get("http://127.0.0.1:8000/recipe/api").then(res=>getData(res.data)).catch(error=>console.error(error))
            ).catch(error=>console.error(error))
        }
    }

    function openDialog(){
        setVisible(true)
    }
    function closeDialog(){
        setVisible(false)
    }

    function viewData(id){
        axios.get(`http://127.0.0.1:8000/recipe/api/${id}`).then(
            res=>storedata(res.data)
        )
    }
    
    return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
            <h2 className="text-center"><span className="material-symbols-outlined" style={{color:"red"}}>restaurant</span> View Recipes Here <span className="material-symbols-outlined" style={{color:"red"}}>restaurant</span></h2>
            <div style={{display:"flex",justifyContent:"space-between",width:"82%"}}>
                <select className="form-control w-25" onChange={(e)=>{
                   filterUpdate(e.target.value) 
                //    console.log(filterValue)
                }}>
                    <option selected>Filter here..</option>
                    <option value="thisWeek">This Week</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="all">All</option>
                </select>
                <Link to="/" className="btn btn-primary w-20">Add Item +</Link>
            </div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginLeft:"60px"}}>
            <div  style={{display:"flex",flexDirection:"row",flexWrap:"wrap",width:"90%"}}>
                {
                    data.map((item)=>{
                        return(
                            <div className="card m-3 image-Container" style={{width: "23rem"}}>
                                <div>
                                    <div className="menu" style={{display:"flex",justifyContent:"end"}}>
                                        <div className="dots"><span className="material-symbols-outlined">more_vert</span></div>
                                            <ul className="dropdown">
                                                <li><Link to={`/editList/${item.id}`}>Edit</Link></li>
                                                <li><Link onClick={()=>{
                                                    deleteHandler(item.id)
                                                }}>Delete</Link></li>
                                            </ul>
                                    </div>
                                    <img src={item.r_img} className="card-img-top" alt="figure not found" style={{height:"250px"}}></img>
                                </div>
                                <div class="card-body">
                                    <h4>{item.r_name}</h4>
                                    <div style={{height:"150px",overflow:"hidden",marginBottom:"2px"}}><p>{item.r_description}</p></div>
                                    <p><span style={{color:"rgba(31, 29, 29, 0.733)"}}>{item.r_type}</span></p>
                                    <div style={{display:"flex",justifyContent:"end"}}><button className="btn btn-primary btn-sm" onClick={()=>{
                                        openDialog()
                                        viewData(item.id)
                                    }}>View</button></div>
                                    <Dialog visible={visible} style={{ width: '50vw' }} onHide={closeDialog}>
                                        <div className="container" style={{border:"1px solid grey"}}>
                                            <br/>
                                            <center><img src={sdata.r_img} style={{height:"150px",width:"250px",borderRadius:"20%"}}/></center><br/>
                                            <br/>
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col">Name </div><div className="col">{sdata.r_name}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">Description </div><div className="col">{sdata.r_description}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">Type of dish</div><div className="col">{sdata.r_type}</div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">Created at</div><div className="col">{sdata.r_created_at}</div>
                                                </div>
                                            </div>
                                            <br/>
                                        </div>
                                    </Dialog>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            </div>
        </div>
    )
}
export default ViewList;