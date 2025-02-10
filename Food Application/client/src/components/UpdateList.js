import axios from "axios";
import {  useState ,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Food from "./food5.jpg"


function UpdateList(){
    const {id}=useParams()
    const navigate=useNavigate()
    const [data,setData]=useState({})

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/recipe/api/${id}`).then(res=>setData(res.data)).catch(error=>console.error(error))
    },[])

    function formHandler(e){
        e.preventDefault()
        axios.put(`http://127.0.0.1:8000/recipe/api/${id}`,data).then(
            alert("Updated the data successfully"),
            navigate("/viewList")
        )
    }

    function backToView(){
        navigate("/viewList")
    }

    return(
        <div style={{backgroundImage:`url(${Food})`,backgroundSize:"cover",backgroundRepeat:"no-repeat",padding:"100"}}>
        <br/>
        <div className="container" style={{width:"1000px"}}>
            <div>

                        <h1 className="text-center mt-2" style={{color:"white",fontWeight:"bolder"}}>Edit Menu </h1>
                        <div className="card" style={{width:"90",boxShadow:"0 0 2px grey"}}>
                            <div style={{display:"flex",justifyContent:"end"}}>
                                <span className="material-symbols-outlined btn btn-primary btn-sm" onClick={backToView}>arrow_back_ios</span>
                            </div>
                            <center><img src={data.r_img} className="card-img-top" alt="..." style={{width:"250px",height:"250px",borderRadius:"50%"}}/></center>
                            <div className="card-body">
                                <form onSubmit={formHandler}>
                                <table style={{height:"100%",width:"85%",marginLeft:"150px"}}>++
                                    <tr>
                                        <td><center><label >Image:</label></center></td>
                                        <td><input type="text" className="form-control w-50" value={data.r_img} onChange={(e)=>{
                                            setData({...data,r_img:e.target.value})
                                        }}/></td>
                                    </tr>
                                     <br/>
                                    <tr>
                                        <td><center><label >Recipe Name:</label></center></td>
                                        <td><input type="text" className="form-control w-50" value={data.r_name} onChange={(e)=>{
                                            setData({...data,r_name:e.target.value})
                                        }}/></td>
                                    </tr>
                                     <br/>
                                    <tr>
                                        <td><center><label >Description :</label></center></td>
                                        <td><textarea rows="5" className="form-control w-50" value={data.r_description} onChange={(e)=>{
                                            setData({...data,r_description:e.target.value})
                                        }}/></td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td><center><label >Recipe Type :</label></center></td>
                                        <td><select className="form-select w-50" value={data.r_type} onChange={(e)=>{
                                            setData({...data,r_type:e.target.value})
                                        }}>
                                            <option defaultValue value="none">choose type..</option>
                                            <option value="vegetarian">Vegetarian</option>
                                            <option value="non-vegetarian">Non-Vegetarian</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td><center><label >Created At :</label></center></td>
                                        <td><input  type="date" className="form-control w-50" value={data.r_created_at}/></td>
                                    </tr>
                                    <br/>
                                </table>
                                <center>
                                    <input type="submit" className="btn btn-primary mb-4 w-25"/>
                                </center>                  
                                </form>
                            </div>
                        </div>
            </div>
        </div>
        <br/>
        <br/>
        </div>
    )
}
export default UpdateList;