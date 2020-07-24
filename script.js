let lobbyChannel;
let roomId;
let isRoomCreator = false;
let board;
let human;
let ai;
let player1;
let player2;
let hintindex=0;
var levell=0;
let onlinePlayer='X';
let onlineOpponent='O';
let msgString = {opponentReady: false, turn:onlinePlayer, prevPos:-1};
const wins=[
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
]
const cells=document.querySelectorAll(".cell");

var pubnubGame = new PubNub({
        uuid: document.getElementById("UUID").value,
        publish_key: "pub-c-d20853da-f794-416c-a5e0-552e3db072f5",
        subscribe_key: "sub-c-2cd0494e-ccad-11ea-9c7f-8a446e84d7d1",
        ssl: true
    });
pubnubGame.addListener({
  message: function(event) {
    msgString = event.message;
    if(msgString.opponentReady===true && isRoomCreator === true){
        onlinePlayerStart();
    }
    if(msgString.prevPos != -1) { turn(msgString.prevPos, (msgString.turn === 'onlinePlayer')? onlineOpponent : onlinePlayer);
      document.getElementById("next").style.display="block";
    document.getElementById("next").innerText= "Turn:"+msgString.turn;}
  }
});
var isOpponent = false;

function onlinePlayerStart() {
    document.getElementById("button").style.marginLeft= "-180px";
   document.getElementById("friend").style.backgroundColor="#14b1ab";
   document.getElementById("cards").style.transform= "rotateY(180deg)"
document.querySelector(".endgame").style.display="none";
    board = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++)
    {   cells[i].removeEventListener("click", turnclick, false); 
        cells[i].innerText="";
        cells[i].style.removeProperty("background-color"); 
        cells[i].removeEventListener('click', turnclicks, false);
        cells[i].addEventListener('click', onlinePlayerClick, false);
    } 
}

function onlinePlayerClick(square){
    if(typeof board[square.target.id]=="number"){
    if(msgString.turn === 'onlinePlayer') {   
        turn(square.target.id, onlinePlayer);
        pubnubGame.publish({
        message: {
          opponentReady: false,
          turn: 'onlineOpponent',
          prevPos: square.target.id,
        },
        channel: lobbyChannel
      });
   }
}}

function botOptionShow() {
    document.getElementById("bot").style.backgroundColor= "#14b1ab";
    document.getElementById("onlinefriend").style.backgroundColor= "#f9d56e";
    document.getElementById("friend").style.backgroundColor= "#f9d56e";
    document.getElementById("LobbyFull").style.display="none";
    var y = document.getElementById("onlineOptions");
    y.style.display = "none";
    document.getElementById("l1").disabled=false;
    document.getElementById("l2").disabled=false;
     document.getElementById("l3").disabled=false;

    var x = document.getElementById("botOptions");
    x.style.display = "block";

    document.getElementById("left").style.marginTop= "-5px";
}

function onlineOptionShow() {
    document.getElementById("bot").style.backgroundColor= "#f9d56e";
    document.getElementById("onlinefriend").style.backgroundColor= "#14b1ab";
    document.getElementById("friend").style.backgroundColor= "#f9d56e";
    document.getElementById("l1").style.backgroundColor= "#f9d56e";
    document.getElementById("l2").style.backgroundColor= "#f9d56e";
    document.getElementById("l3").style.backgroundColor= "#f9d56e";
    var y = document.getElementById("botOptions");
    y.style.display = "none";
    document.getElementById("l1").disabled=true;
    document.getElementById("l2").disabled=true;
     document.getElementById("l3").disabled=true;
     document.getElementById("l3").style.backgroundColor="#f9d56e"
     document.getElementById("l2").style.backgroundColor="#f9d56e"
     document.getElementById("l1").style.backgroundColor="#f9d56e"
     levell=0;
    var x = document.getElementById("onlineOptions");
    x.style.display = "block";
    
    document.getElementById("left").style.marginTop= "-2px"; 
 
    document.getElementById("LobbyFull").style.display="none";
}

// Create a room channel
function onPressCreate() {
  
  roomId=Math.floor(Math.random() * 90000)+10000;
  lobbyChannel = 'tictactoelobby--' + roomId;
  document.getElementById("onPressJoin").style.display="none";
  document.getElementById("onPressCreate").style.display="block";
  document.getElementById("stringRoomId").style.display="block";
  document.getElementById("stringRoomId").innerText="Your Room Id is\n"+roomId+"\nWaiting for friend...";
 // console.log(pubnubGame.uuid);
  pubnubGame.subscribe({
    channels: [lobbyChannel],
    withPresence: true
  });
  isRoomCreator = true;
    document.getElementById("LobbyFull").style.display="none";
    document.getElementById("you").style.display="block";
    document.getElementById("you").innerText = "YOU:X";
    document.getElementById("next").style.display="block";
}

function onPressJoin(){
  document.getElementById("LobbyFull").style.display="none";
    document.getElementById("onPressCreate").style.display="none";
  document.getElementById("onPressJoin").style.display="block";  
}

function onSubmitJoin()
{
    roomId = document.getElementById("inputRoomId").value;
    lobbyChannel = 'tictactoelobby--' + roomId;
    pubnubGame.hereNow({
  channels: [lobbyChannel], 
}).then((response) => { 
    if(response.totalOccupancy < 2){
      pubnubGame.subscribe({
        channels: [lobbyChannel],
        withPresence: true
      });
        isRoomCreator = false;
        document.getElementById("you").style.display="block";
        document.getElementById("next").style.display="block";
         document.getElementById("you").innerText = "YOU:O";
        pubnubGame.publish({
        message: {
          opponentReady: true,
          turn: 'onlinePlayer',
          prevPos: -1,
        },
        channel: lobbyChannel
      });   
         document.getElementById("button").style.marginLeft= "-180px";
  // document.getElementById("friend").style.backgroundColor="#14b1ab";
   document.getElementById("cards").style.transform= "rotateY(180deg)"
         }
         else{
             document.getElementById("LobbyFull").style.display="block";
             document.getElementById("LobbyFull").innerText="Lobby is full...";
         } 
}).catch((error) => { 
  console.log(error);
});
onlineOpponentStart();
}
function onlineOpponentStart(){
   board = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++)
    {   cells[i].removeEventListener("click", turnclick, false); 
        cells[i].innerText="";
        cells[i].style.removeProperty("background-color"); 
        cells[i].removeEventListener('click', turnclicks, false);
        cells[i].addEventListener('click', onlineOpponentClick, false);
    }  
}

function onlineOpponentClick(square){
    if(typeof board[square.target.id]=="number"){
    if(msgString.turn === 'onlineOpponent') {   
        turn(square.target.id, onlineOpponent);
        pubnubGame.publish({
        message: {
          opponentReady: false,
          turn: 'onlinePlayer',
          prevPos: square.target.id,
        },
        channel: lobbyChannel
      });
   }
}}

startGame();

//Human_to_friend game code

function friend(){
    document.getElementById("LobbyFull").style.display="none";
    document.getElementById("button").style.marginLeft= "-180px";
   document.getElementById("friend").style.backgroundColor="#14b1ab";
   document.getElementById("cards").style.transform= "rotateY(180deg)"
   document.getElementById("bot").style.backgroundColor= "#f9d56e"
   document.getElementById("onlinefriend").style.backgroundColor= "#f9d56e";
   document.getElementById("l1").style.backgroundColor= "#f9d56e";
   document.getElementById("l2").style.backgroundColor= "#f9d56e";
   document.getElementById("l3").style.backgroundColor= "#f9d56e";
    document.getElementById("first").disabled=true;
   document.getElementById("second").disabled=true;
   document.getElementById("l1").disabled=true;
   document.getElementById("l2").disabled=true;
    document.getElementById("l3").disabled=true;

    player1='X'
    player2='O'
    document.querySelector(".endgame").style.display="none";
    board = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++)
    {   cells[i].removeEventListener("click", onlinePlayerClick, false);
        cells[i].removeEventListener("click", onlineOpponentClick, false); 
        cells[i].removeEventListener("click", turnclick, false); 
        cells[i].innerText="";
        cells[i].style.removeProperty("background-color"); 
        cells[i].addEventListener('click', turnclicks, false);
    } 
}
//turnclicks function for human to friend 
function turnclicks(square){
  
   if(typeof board[square.target.id]=="number"){
    var availSpot = emptySpot(board);
    if((availSpot.length)%2 != 0) {   
        turn(square.target.id, player1);
    }else {
        turn(square.target.id, player2);
    }  
   }
}

//Function for selecting 'X' or 'O' which is only applicable after selecting levels section
function selectSym(sym){
     document.getElementById("friend").style.backgroundColor="#f9d56e"; 
     document.getElementById("hint").style.visibility="visible";
     document.getElementById("hint").disabled=false;
     document.getElementById("button").style.marginLeft= "-210px";
        human = sym;
        ai = sym==='O' ? '✘' :'O';
    board = Array.from(Array(9).keys());   
if(levell!=0) {   document.getElementById("cards").style.transform= "rotateY(180deg)";   
    if(human=='O')
    {

      document.getElementById("second").style.backgroundColor="#14b1ab";    
      document.getElementById("first").style.backgroundColor="#f9d56e";
    }
    else{
        document.getElementById("first").style.backgroundColor="#14b1ab";
        document.getElementById("second").style.backgroundColor="#f9d56e";
    }   

    for(var i = 0; i < cells.length; i++)
    {   cells[i].removeEventListener("click", onlinePlayerClick, false);
        cells[i].removeEventListener("click", onlineOpponentClick, false); 
        cells[i].removeEventListener("click", turnclicks, false);
        cells[i].innerText="";
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener('click', turnclick, false)
    }
    document.getElementById("first").disabled=true;
    document.getElementById("second").disabled=true;
    document.getElementById("l1").disabled=true;
    document.getElementById("l2").disabled=true;
     document.getElementById("l3").disabled=true;


   if (ai === '✘') {
      turn(Math.floor(Math.random()*9), ai);
  }
}
   document.querySelector(".endgame").style.display="none";

  }

  //Function to start the game
function startGame() {
    document.querySelector(".endgame").style.display="none";
    board = Array.from(Array(9).keys());
    for(var i = 0; i < cells.length; i++)
    { 
        cells[i].innerText="";
        cells[i].style.removeProperty("background-color");
        cells[i].removeEventListener("click", onlinePlayerClick, false);
        cells[i].removeEventListener("click", onlineOpponentClick, false); 
        cells[i].removeEventListener("click", turnclicks, false)
        cells[i].removeEventListener('click', turnclick, false);

    }
     document.getElementById("l3").style.backgroundColor="#f9d56e"
     document.getElementById("l2").style.backgroundColor="#f9d56e"
     document.getElementById("l1").style.backgroundColor="#f9d56e"
     document.getElementById("second").style.backgroundColor="#f9d56e"
     document.getElementById("first").style.backgroundColor="#f9d56e"
     document.getElementById("friend").style.backgroundColor="#f9d56e"
     document.getElementById("bot").style.backgroundColor= "#f9d56e"
     document.getElementById("onlinefriend").style.backgroundColor= "#f9d56e";
     document.getElementById("friend").disabled=false;
       document.getElementById("first").disabled=false;
       document.getElementById("second").disabled=false;
       document.getElementById("l1").disabled=false;
       document.getElementById("l2").disabled=false;
        document.getElementById("l3").disabled=false;
        document.getElementById("hint").style.visibility="hidden";
        document.getElementById("left").style.marginTop= "136px";
        document.getElementById("botOptions").style.display = "none";
     document.getElementById("onlineOptions").style.display = "none";
     document.getElementById("stringRoomId").innerText='';
     document.getElementById("stringRoomId").style.display = "none";
     document.getElementById("LobbyFull").innerText='';
     document.getElementById("LobbyFull").style.display = "none";
     document.getElementById("onPressJoin").style.display = "none";
     document.getElementById("you").style.display = "none";
     document.getElementById("next").style.display = "none";
     document.getElementById("myAudio").pause();
    pubnubGame.unsubscribeAll();
     levell=0;
}
//Function to start a new game
function newGame(){
    
     document.getElementById("cards").style.transform= "rotateY(360deg)";
     document.getElementById("hint").style.backgroundImage = "url(bulb.png)";
     startGame();
     
}
//turnclick Function to take human input and return ai input in human vs ai part 
function turnclick(square) {
    document.getElementById(hintindex).style.backgroundColor = "black";
    document.getElementById("hint").style.backgroundImage = "url(bulb.png)";
    if(typeof board[square.target.id]=="number") {   
    turn(square.target.id, human)
    if(!checkWin(board, human) && !checkTie()) turn(bestSpot(levell), ai);}   
}
//turn function to access turns and check if game is won or not
function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(board, player)
    if(gameWon){ gameOver(gameWon)}
     else{checkTie();}    
}
//checkwin function checks if game is won or not
function checkWin(boards, player) {
    let plays = boards.reduce((a, e, i) => 
            (e === player)? a.concat(i):a , []);
    let gameWon = null;
    for (let [index, win] of wins.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }      
    }
    return gameWon;
}
//gameOver function is to check if game is over and pop out the result
var x = document.getElementById("myAudio");
function enableAutoplay() { 
  x.autoplay = true;
  
}
 
function disableAutoplay() { 
  x.autoplay = false;
 
} 
function gameOver(gameWon) {
    pubnubGame.unsubscribeAll();
    for (let index of wins[gameWon.index]) 
    {
        document.getElementById(index).style.backgroundColor = 
                gameWon.player == human ? "LightBlue" : "Salmon";
    }
    for(var i=0; i<cells.length; i++) {
    cells[i].removeEventListener("click", onlinePlayerClick, false);
        cells[i].removeEventListener("click", onlineOpponentClick, false); 
    cells[i].removeEventListener("click", turnclick, false);
    cells[i].removeEventListener("click", turnclicks, false);
    pubnubGame.unsubscribeAll();
    }
   if(gameWon.player==human || gameWon.player==ai){  
    declareWin(gameWon.player==human?"YOU WIN!":"YOU LOSE!"); 
    document.getElementById("hint").disabled=true;
      }
    else if(gameWon.player==onlinePlayer || gameWon.player == onlineOpponent){
        declareWin(gameWon.player==onlinePlayer?"X wins":"O Wins")
         }
    else{declareWin(gameWon.player==player1?"X Wins!":"O Wins!");
    document.getElementById("hint").disabled=true;
    }
   document.getElementById("myAudio").play()
}
//declareWin function checks if win is declared or not
function declareWin(who) {
        document.querySelector(".endgame").style.display="block";
        document.querySelector(".endgame .text").innerText=who;
}
//emptySpot function checks the empty spot available in the board 
function emptySpot() {
    return board.filter(s => typeof s=="number");
}
//levels function to access and style the input of difficulty of the game
function levels(count)
{  
    levell=count;
    document.getElementById("friend").style.backgroundColor="#f9d56e";
    if(count==1)
    {
        document.getElementById("l1").style.backgroundColor="#14b1ab"
     document.getElementById("l2").style.backgroundColor="#f9d56e"
      document.getElementById("l3").style.backgroundColor="#f9d56e";
    }
    else if(count==2)
    {
        document.getElementById("l1").style.backgroundColor="#f9d56e"
        document.getElementById("l2").style.backgroundColor="#14b1ab"
         document.getElementById("l3").style.backgroundColor="#f9d56e";
    }
    else if(count==3){
        document.getElementById("l1").style.backgroundColor="#f9d56e"
        document.getElementById("l2").style.backgroundColor="#f9d56e"
         document.getElementById("l3").style.backgroundColor="#14b1ab";
    }
}
//bestSpot function will return index of the board from ai side according to the levels
function bestSpot(count) {
    if(count==3) {
    return minimax(board, ai,3).index; }
    else if(count==1)
    {
        return minimax(board, ai,1).index;
    }
    else if(count==2)
    {
        return minimax(board,ai,2).index;
    }
}
//checkTie function will check if tie situation is happening in game or not
function checkTie()
{
    if(emptySpot().length==0)
    {
        for(var i=0; i<cells.length; i++)
        {
            cells[i].style.backgroundColor="LightGreen";
            cells[i].removeEventListener("click",turnclick,false);
            cells[i].removeEventListener("click",turnclicks,false);
            cells[i].removeEventListener("click", onlinePlayerClick, false);
        cells[i].removeEventListener("click", onlineOpponentClick, false); 
        }
        pubnubGame.unsubscribeAll();
        declareWin("Tie Game!")
        return true;
    }
    return false; 
     document.getElementById("myAudio").play()  
}
//minimax function takes the input of the user and assumes the optimal move of human and return the index for bestmove from ai side

//This function is for all levels. It declares that the ai plays optimally according to the level.
function minimax(newBoard, player,counts) {
    var availSpots = emptySpot(newBoard);
    
    if(checkWin(newBoard, human)) {
           return {score: -10};
     } else if(checkWin(newBoard, ai)) {
           return {score: 10};
     } else if(availSpots.length===0) {
           return {score: 0};
     }
     
     var moves=[];
     for(var i=0; i<availSpots.length; i++)
     {
        var move={};     
        move.index= newBoard[availSpots[i]];
        newBoard[availSpots[i]]=player;

     if(player==ai) {
        var result = minimax(newBoard, human);
        move.score = result.score;
        
     }else {
        var result=minimax(newBoard, ai);
        move.score=result.score;
        }
   newBoard[availSpots[i]]=move.index;
    if ((player === ai && move.score === 10) || (player === human && move.score === -10))
      return move;
    else 
      moves.push(move);
    
}
 var bestMove;
 if(player===ai) {
    var bestScore = -100000;
    for (var i = 0; i < moves.length; i++) {
        if(moves[i].score>bestScore) {
               bestScore=moves[i].score;
               bestMove=i;
        }
     }
 }else {
    var bestScore = 100000;
    for (var i = 0; i < moves.length; i++) {
        if(moves[i].score<bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
        }    
    }
 }
 var choosen;
 if(counts==1 ) {
 if(Math.random()*100<=20)
 {
     choosen=moves[bestMove];
 }
 else{
    if(moves[bestMove+1]) {
     
        choosen=moves[bestMove+1];
     }
     else if(moves[bestMove-1])
     {
         choosen=moves[bestMove-1];
     }
     else { choosen=moves[bestMove];}
     }
    }
    else if(counts==2){
        if(Math.random()*100<=70)
 {
     choosen=moves[bestMove];
 }
 else{
    if(moves[bestMove+1]) {
     
        choosen=moves[bestMove+1];
     }
     else if(moves[bestMove-1])
     {
         choosen=moves[bestMove-1];
     }
     else {
         choosen=moves[bestMove];
     }
     }
    }
    else {
        choosen=moves[bestMove];
    }
 
 
 return choosen;
}
//hint function is for highlighting suggestion of next move for human when playing against ai.
function hint(){
    if(emptySpot().length!=0 && !checkTie()) {
    document.getElementById("hint").style.backgroundImage = "url(bulbon.png)";
    if(emptySpot().length!=9) {
     hintindex= minimax(board, human, 3).index;
    } else {
        hintindex= Math.floor(Math.random()*9);
    }
    document.getElementById(hintindex).style.backgroundColor="#f4ce10";
    }
}
