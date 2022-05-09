/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  const songContainer = ObjectFactory('.song_container','#currentSongContainer');
  const songName = document.getElementById('currentSong').innerText;
  console.log(songName);
  const pause = ObjectFactory(null,'#pause');
  const play = ObjectFactory(null,'#play');
  const skip = ObjectFactory(null,'#skip');
  
  $(play.id).hide();

  $(pause.id).on('click', pauseSong);
  $(play.id).on('click', playSong);
  $(skip.id).on('click', skipSong);

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// FUNCTIONS ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  function ObjectFactory($class, $id){ //PogChamp
    let element = {};
    if ($class != null){
      element.class = $class;
    }
    element.id = $id;
    return element;
  }

  function pauseSong(){
    $(pause.id).hide();
    $(play.id).show();
    postCommand('pause');
    document.getElementById('currentSong').innerText = "Paused";
  }

  function playSong(){
    $(play.id).hide();
    $(pause.id).show();
    postCommand('play');
    document.getElementById('currentSong').innerText = songName;
  }

  function skipSong(){
    postCommand('skip');
    window.location.reload();
  }

  function postCommand(command){
    const data = {
      'command': command
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch('/api/control-song/', options);
  }
};
