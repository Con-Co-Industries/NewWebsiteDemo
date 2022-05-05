/* global $, sessionStorage */
$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  // Constants
  const colors = {
    "green": "#4CAF50",
    "red" : "rgb(186, 93, 93)",
    "gray" : "rgb(93, 93, 93)"
  }
  const pressed = {'like': false, 'dislike': false};
  const checkInputSecs = 15; // how many seconds the program waits before checking for input
  const songAmnt = $(".allSongs").children().length;

  // Variables
  let unlocked;
  let userID;
  let userIDInputs = [];
  let newIDInputs = [];
  let songContainer = [];
  let songName = [];
  let votedSongs = [];
  let currentSong = 0;
  let previousSong = null;
  let recivedAnInput = false; 

  for (let i = 0; i < songAmnt; i++) { // for some unholy reason the forloop counter starts at 1 not 0
    songContainer.push(ObjectFactory('.song_container','#container'+i));
    songName.push($("#song"+i).text());
  };

  const baseHeight = document.getElementById("container0").offsetTop;
  
  function ObjectFactory($class, $id){ //PogChamp
    let element = {};
    element.class = $class;
    element.id = $id;
    element.height = $(element.id).height();
    return element;
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  if (localStorage.getItem("newID") != null){
    userID = localStorage.getItem("newID");
    unlockPage();
  }
  else{
    lockPage();
  }
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);
  
  //Called in response to events.
  function handleKeyDown(event) {
    recivedAnInput = true; // if a key is pressed, then set to true so page doesn't relog
    if (event.key === 'ArrowUp') { // scroll up 1 song
      console.log("Pressed up");
      if (unlocked){
        previousSong = currentSong;
        currentSong -= 1;
        if (currentSong < 0){
          currentSong = songContainer.length - 1;
        };
        showSelectedSong(currentSong, previousSong);
      };
    }
    else if (event.key === 'ArrowDown') { // scroll down 1 song
      console.log("Pressed down");
      if (unlocked){
        previousSong = currentSong;
        currentSong += 1;
        if (currentSong >= songContainer.length){
          currentSong = 0;
        };
        showSelectedSong(currentSong, previousSong);
      };
    }
    else if (event.key === 'ArrowRight') { // like
      console.log("Pressed right");
      if (unlocked){// && !(likedSongs.includes(currentSong)||dislikedSongs.includes(currentSong))){
        if (pressed.dislike){ //if pressed.dislike is true while like is being pressed then reload the page
          pageReloader()
        }
        else{ //otherwise tell the program like has been pressed
          pressed.like = true;
        }

        likeSong(currentSong);
      };
    }
    else if (event.key === 'ArrowLeft') { // dislike
      console.log("Pressed left");
      if (unlocked){// && !(likedSongs.includes(currentSong)||dislikedSongs.includes(currentSong))){
        if (pressed.like){ //if pressed.like is true while dislike is being pressed then reload the page
          pageReloader()
        }
        else{ //otherwise tell the program dislike has been pressed
          pressed.dislike = true;
        }

        dislikeSong(currentSong);
      };
    }
    else if (event.key === 'Enter'){
      if (!unlocked){
        unlockPage();
      }
      else{ // a new id has been swiped, reload the page
        for (let i = 0; i < newIDInputs.length; i++){
          console.log(newIDInputs[i])
        }
        pageReloader();
      }      
    }
    else{
      if (!unlocked){// Changed to allow for all characters
        console.log(event.key);
        userIDInputs.push(event.key);
      }
      else{
        newIDInputs.push(event.key);
      }
    };
  };

  function handleKeyUp(event) {
    if (event.key === 'ArrowRight') { // like
      console.log("Released right");
      if (unlocked){
        pressed.like = false;
      };
    }
    else if (event.key === 'ArrowLeft') { // dislike
      console.log("Released right");
      if (unlocked){
        pressed.dislike = false;
      };
    };
  };




  function idleReloadChecker(){
    if (!recivedAnInput){ // reload the page if an input was not received
      pageReloader();
    }
    else{ // reset the var, saying that we haven't gotten an input
      recivedAnInput = false;
      return;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function showSelectedSong(song, prevSong){
    setScroll(song);
    let colorHandled = colorSetter(song);
    if (!colorHandled){
      $(songContainer[song].id).css("border-color", "blue");
    }
    $(songContainer[song].id).css("border-width", "5px");

    if (prevSong != null){ // if prevSong isn't null
      let prevColorHandled = colorSetter(prevSong);
      if (!prevColorHandled){
        $(songContainer[prevSong].id).css("border-color", colors.gray);
      }
      $(songContainer[prevSong].id).css("border-width", "2px");
    }
  };

  function setScroll(container){
    let y = document.getElementById("container"+container).offsetTop;
    console.log("Current Height of current song container: "+y);

    window.scrollTo(0, (y - baseHeight));
  }

  function lockPage(){
    unlocked = false;
    $("h2").hide();
    $("h4").hide();
    $(".song_container").css({"filter": "blur(2px)", "opacity": "0.6"});
    window.scrollTo(0,0);
    //css("filter", "blur(2px)").fadeTo(1,0.6);
  }

  function unlockPage(){
    unlocked = true;
    if (userIDInputs.length > 0){
      userID = userIDInputs.join("");
    }
    
    console.info(userID)
    //document.querySelector("h1").innerHTML = "Thanks for logging in!";
    $("h1").hide();
    $("h2").show();
    $("h4").show();

    $(".song_container").css({"filter": "blur(0px)", "opacity": "1.0"});
    showSelectedSong(currentSong, previousSong);
    window.scrollTo(0,0);

    let milliseconds = checkInputSecs * 1000;
    setInterval(idleReloadChecker, milliseconds);
  }

  function likeSong(song){

    postVote(song, 'yes');
    // console.log("Posted: {'id': " + userID + ",");
    // console.log("'topic': "+ songName[song] + ",");
    // console.log("'choice': 'yes'}");
    
    votedSongs[song]="like";
    colorSetter(song);    
  }

  function dislikeSong(song){
    
    postVote(song, 'no');
    // console.log("Posted: {'id': " + userID + ",");
    // console.log("'topic': "+ songName[song] + ",");
    // console.log("'choice': 'no'}");
    
    votedSongs[song]="dislike";
    colorSetter(song);
  }

  function postVote(song, vote){
    const data = {
      'id': userID,
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
    if (votedSongs[song]==="like") {
      $(songContainer[song].id).css("border-color", colors.green);
    }
    else if (votedSongs[song]==="dislike"){
      $(songContainer[song].id).css("border-color", colors.red);
    }
    else{ // if it hasn't been voted on, set the color manually
      return(false);
    }
    return(true);
  }

  function pageReloader(){
    if (newIDInputs.length > 0){
      localStorage.setItem("newID", newIDInputs.join(""));
    }
    else{
      localStorage.clear();
    }
    window.scrollTo(0, 0);
    window.location.reload();
  }
};