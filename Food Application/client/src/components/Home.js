import React, {  useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Food from "./food5.jpg"


function Home(){
    const [data,addData]=useState({r_name:'',r_description:'',r_type:'',r_created_at:'',r_img:''})

    function dataHandler(e){
        e.preventDefault()
        // console.log(data)
        axios.post("http://127.0.0.1:8000/recipe/api",data).then(
            res=>{
                console.log(res.data)
            alert("Data submited successfully...")
            addData({r_name:'',r_description:'',r_type:'',r_created_at:'',r_img:''})
            console.log(data)
        }
        ).catch(error=>console.error(error))
    }


    return(
        <div style={{backgroundImage:`url(${Food})`,backgroundSize:"cover",backgroundRepeat:"no-repeat"}}>
        <br/>
        <div className="container" style={{height:"1000px",width:"1000px"}} >
            <div className="mt-5 mb-1" style={{display:"flex",justifyContent:"end"}}>
                <Link to="viewList" className="btn btn-primary w-20" >View Recipes</Link>
            </div>
            <h1 className="text-center">Add Recipe<span className="material-symbols-outlined">sentiment_very_satisfied</span></h1>
            <div className="container mb-1 mt-3" style={{border:"0px solid grey",boxShadow:"0px 0px 5px grey"}}> 
            <form onSubmit={dataHandler}>
                <table style={{height:"80%",width:"100%",padding:"50",borderSpacing:"50" ,borderRadius:"15px",marginLeft:"100px"}} >
                    <br/>
                    <br/>
                    <tr>
                        <td><center><label>Recipe Name:</label></center></td>
                        <td><input type="text" className="form-control w-50" value={data.r_name} onChange={(e)=>{
                            addData({...data,r_name:e.target.value})
                        }}/></td>
                    </tr>
                    <br/>
                    <tr>
                        <td><center><label >Description :</label></center></td>
                        <td><textarea rows="5" className="form-control w-50" value={data.r_description} onChange={(e)=>{
                            addData({...data,r_description:e.target.value})
                        }}/></td>
                    </tr>
                    <br/>
                    <tr>
                        <td><center><label >Recipe Type :</label></center></td>
                        <td><select className="form-select w-50"  value={data.r_type} onChange={(e)=>{
                            addData({...data,r_type:e.target.value})
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
                        <td><input  type="date" className="form-control w-50" value={data.r_created_at} onChange={(e)=>{
                            addData({...data,r_created_at:e.target.value})
                        }}/></td>
                    </tr>
                    <br/>
                    <tr>
                        <td><center><label  >Recipe image :</label></center></td>
                        <td><input  type="text" className="form-control w-50" placeholder="input as image url"  value={data.r_img} onChange={(e)=>{
                            addData({...data,r_img:e.target.value})
                        }}/></td>
                    </tr>
                    <br/>
                </table>
                <br/>
                <center><input type="submit" className="btn btn-primary mb-4 w-25" /></center>
            </form>
            </div>
        </div>
        </div>
    )
}

export default Home;