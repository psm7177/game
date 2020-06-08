import React, { useRef } from 'react';
import './Room.css';
function Room(){

    const name = useRef(null);

    const makeRoom = () =>{
        var data = {name: name.current.value};

        fetch('http://localhost:3001/room', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .then(response => {
              window.location.href = `/game/${response.id}`;
            })
          .catch(error => console.error('Error:', error));
    }

    return(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{fontSize:30, fontWeight:'bold',marginTop:60,marginBottom:60}}>방 만들기</div>
            <div style={{display:"flex",flexDirection:"column"}}>
                <div className="inputBox"> 
                    <div>방 이름</div><input ref={name}/>
                </div>
            </div>
            <div className="button" onClick={makeRoom}>생성</div>
        </div>
    )
}

export default Room;