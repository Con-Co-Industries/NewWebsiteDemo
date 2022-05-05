/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  const colors = {
    "green": "#4CAF50",
    "red" : "rgb(186, 93, 93)",
    "gray" : "rgb(93, 93, 93)"
  }

  let songContainer = [];
  let songName = [];
  let likedSongs = [];
  let dislikedSongs = [];

  const songAmnt = $(".allSongs").children().length;
  
  for (let i = 1; i < songAmnt+1; i++) { // for some unholy reason the songAmnt starts at 1 not 0
    songContainer.push(ObjectFactory('.song_container','#container'+i));
    songName.push($("#song"+i).text());
  };
  
  startup();
  
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// FUNCTIONS ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  function ObjectFactory($class, $id){ //PogChamp
    let element = {};
    element.class = $class;
    element.id = $id;
    return element;
  }

  function startup() {
    for (let i = 1; i < songAmnt+1; i++){
      let l = document.getElementById('like'+ i);
      let dl = document.getElementById('dislike'+ i);
      l.addEventListener('touchstart', handleTouch);
      dl.addEventListener('touchstart', handleTouch);
      console.log('Initialized ' + i);
    };
  }

  function handleTouch(evnt){
    evnt.preventDefault();
    let buttonID = this.id;
    console.log(buttonID);
    let buttonNum = buttonID.slice(buttonID.length - 1);
    console.log(buttonNum);
    if (buttonID.includes('dis')){
      songVoteDislike(buttonNum);
    }
    else{
      songVoteLike(buttonNum);
    }
  }

  function songVoteLike(song){

    postVote(song, 'yes');
    // console.log("Posted: {'topic': "+ songName[song] + ",");
    // console.log("'choice': 'yes'}");
    
    likedSongs.push(song);
    if (dislikedSongs.includes(song)){
      dislikedSongs.splice(song, 1);
    }
    colorSetter(song);    
  }

  function songVoteDislike(song){
    
    postVote(song, 'no');
    // console.log("Posted: {'topic': "+ songName[song] + ",");
    // console.log("'choice': 'no'}");
    
    dislikedSongs.push(song);
    if (likedSongs.includes(song)){
      likedSongs.splice(song, 1);
    }
    colorSetter(song);
  }

  function postVote(song, vote){
    const data = {
      'topic': songName[song],
      'choice': vote
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch('/api/weekly-vote/', options);
  }

  function colorSetter(song){
    if (likedSongs.includes(song)) {
      $(songContainer[song].id).css("border-color", colors.green);
    }
    else if (dislikedSongs.includes(song)){
      $(songContainer[song].id).css("border-color", colors.red);
    }
    else{ // if it hasn't been voted on, set the color manually
      return(false);
    }
    return(true);
  }
};
