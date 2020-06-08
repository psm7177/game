import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import io from 'socket.io-client';

import './Game.css';
 

function Game(props) {

  const [state, setState] = useState("wait");

  const [boardArray,updateBoardArray] = useState([]);
  const [wordArray,updateWordArray] = useState([]);
  const [rank, updateRank] = useState([{name:"asdf",score:12}]);

  const [room,setRoom] = useState({state: "wait", width: 12, height: 12, name: "", user: 0, maxUser: 4});
  const [host,setHost] = useState(false);
  const [userList,updateUserList] = useState([]);
  const [selectedBox,setSelectedBox] = useState({x:-1,y:-1});
  const [socket,setSocket] = useState(io('http://localhost:3001',{autoConnect:false}));
  const [id,setID] = useState(null);

  const [modal,setModal] = useState("");
  //getBoard size;

  useEffect(()=>{
    socket.open();

    socket.on('connect',()=>{
      socket.emit("enterRoom",{
        id: props.match.params.id,
        name: "ㅇㅇ"
      });
    });
    socket.on('enterFail',(data)=>{
      window.alert(data.message);
      window.location.href = "/";
    })
    socket.on('enterUser',(data)=>{
      //message
      console.log(data);
      updateUserList(data.list);
    });
    socket.on('roomInfo',(data)=>{
      setRoom(data);
    })
    socket.on('setHost',(data)=>{
      setHost(data);
    })  
    socket.on('userID',(data)=>{
      setID(data);
    })

    socket.on("leaveUser",(data)=>{
      //message
      console.log(data);
      updateUserList(data.list);
    });
    socket.on("gameStart",(data)=>{
      setState("game");
      console.log(data);
      updateBoardArray(data.board);
      updateWordArray(data.word);
    });
    socket.on('gamescript',(data)=>{
      console.log(data);
      updateUserList(data.scorebook);
      switch(data.event){
        case "correct":
          updateWordArray(data.wordbook);

          //animation
          break;
        case "gameEnd":
          console.log(data.message.rank);
          updateRank(data.message.rank);

          setModal("active");
          //setState("wait");
          //screen change
          break;
      }
    })
  },[]);

  let onSelect = (x,y)=>{

    if(selectedBox.x == -1){
      setSelectedBox({x:x,y:y});
    }
    else{
      const deltaX = selectedBox.x - x;
      const deltaY = selectedBox.y - y;

      if(deltaX == 0 && deltaY == 0){

      } else if(deltaY == 0 || deltaX == 0) {
        console.log(`(${selectedBox.x},${selectedBox.y})->(${x},${y})`);
        socket.emit('gamescript',{userID:id,script:{event:"click",from:{x:selectedBox.x,y:selectedBox.y},to:{x:x,y:y}}});
      } else if(Math.abs(deltaY/deltaX) == 1){
        console.log(`(${selectedBox.x},${selectedBox.y})->(${x},${y})`);
        socket.emit('gamescript',{userID:id,script:{event:"click",from:{x:selectedBox.x,y:selectedBox.y},to:{x:x,y:y}}});
      }
      setSelectedBox({x:-1,y:-1});
    }
  }

  const onGameStart = () =>{
    socket.emit("gameStart",{
      id:props.match.params.id
    });
  }

  const onGameInit = () =>{
    setModal("");
    setState("wait");
    updateBoardArray([]);
    updateWordArray([]);
  }

  return (
    <div className="App">
      <div className="title">{room.name}</div>
      {(state=="wait"&&host)?<div className="start" onClick={onGameStart}>시작</div>:<div></div>/*방장만 띄우기*/}
      <div className="board">
        <div className="ScoreBoard">{userList.map((user)=>{
          if(user != null)
          return(
          <div className="user">
            <div className="name">{user.name}</div>
            <div className="score">{user.score}</div>
          </div>)
        })}</div>
        <div className="GameBoard" style={{width:room.width*30,height:room.height*30}}>{
        boardArray.map((column,x)=>
        {
          return (
          <div className="column">{
          column.map((value,y)=>
            <div className={`row ${(selectedBox.x == x && selectedBox.y == y)?"selected":""}`} onClick={()=>{onSelect(x,y)}}>
            <p>{value}</p>
            </div>)
            }
          </div>)
        })
        }
        </div>

        <div className="WordBoard">
          {wordArray.map((value)=>{
            return(<div class={`word ${(value.correct)?"correct":""}`}>{value.word}</div>)
          })}
        </div>
      </div>
      <div className={`modal ${modal}`} onClick={onGameInit}>
        <div className="pannel">
          <div className="pannel-title">게임 결과</div>
          <div className="rank">{rank.map((user,index)=>{
             return(<div className="rank-row">
               <div>{index+1}.</div>
               <div style={{flex:1,paddingLeft:20}}>{user.name}</div>
               <div>{user.score}</div>
               </div>)
          })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
