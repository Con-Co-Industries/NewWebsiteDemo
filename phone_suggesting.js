/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){

  const debugging = false; //set this to false when you actually want to post info

  //document.getElementById("submitButton").addEventListener("click", beginSubmission);
  $('#submitButton').on('click', beginSubmission);
  
  // FUNCTIONS

  function beginSubmission(){
    let url = document.getElementById('linkInput').value;
    console.log("user url: " + url);
    if (url.includes('youtu')) {
      postSuggestion(url);
    }
    else{
      document.getElementsByTagName('h4')[0].innerHTML = "That isn't a valid youtube link, please try again.";
      setTimeout(reset, 1500); //reset after 1.5 seconds
    }
  }

  function postSuggestion(link){
    const data = {
      'url': link,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    if (!debugging) { //this is just for testing, when you're ready to post set debugging to false
      fetch('/api/suggest-song/', options);
    }
    else{
      console.log(options.body);
    }    
    document.getElementsByTagName('h4')[0].innerHTML = "Your song has been submitted!";
    setTimeout(reset, 2000);
  }

  function reset(){
    document.getElementsByTagName('h4')[0].innerHTML = "Paste your youtube link below, then press Submit.";
    document.getElementById('linkInput').value = "";
  }
};
