import React, { useEffect, useState } from 'react';

import {Link} from "react-router-dom";

function Room(props){

    const id = props.id;
    const {state,name,user,maxUser,width,height} = props.info;

    let StateColor = "";

    switch(state){
        case "wait":
            StateColor = "#76dc14";
            break;
        case "full":
        case "game":
            StateColor = "#F00";
            break;
        case "close":
            StateColor = "#FFF000";
            break;
        default:
            StateColor = "#FFF";
    }
    return(
        <div style={{boxShadow: "0 1px 2px #d2d4d7",width:500,height:80,borderRadius:10,backgroundColor:"#FFF",display:"flex",marginTop:20}} onClick={()=>window.location.href=`/game/${id}`}>
            <div style={{width:20,height:80,backgroundColor:StateColor,borderTopLeftRadius:10,borderBottomLeftRadius:10}}></div>
            <div style={{flex:1,fontSize:20,marginLeft:20,marginTop:10}}>{name}</div>
            <div style={{marginRight:20}}>
                <div style={{marginTop:10,fontSize:15,textAlign:"end"}} >{`${user}/${maxUser}`}</div>
                <div>{`${width}X${height}`}</div>
            </div>
        </div>
    )
}

function Home() {

    const [roomArray, setRoomArray] = useState([]);

    useEffect(()=>{
      fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(response => {
          console.log(response);
          setRoomArray(response);
        });
    },[]);
    return (
        <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>

            <div style={{fontSize:30,textAlign:"center",fontWeight:"bold",marginTop:60,marginBottom:60}}>P.L.A.Y</div>
            <div onClick={()=>{window.location.href = "room"}} style={{display:"flex",justifyContent:"center",alignItems:"center",boxShadow: "0 1px 2px #d2d4d7",width:500,height:80,borderRadius:10,backgroundColor:"#FFF"}}>
                <div style={{fontSize:20,fontWeight:"bold"}}>방 만들기</div>
            </div>
            <div>
                {roomArray.map((room,index)=>{return(<Room id={index} info={room}/>)})}
            </div>
        </div>  
    )
}

export default Home;