/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  
  let song_container = [];
  let like_buttons = [];
  let dislike_buttons = [];
  let current_button = 0;
  let previous_button = null;
  let votedSongs = [];
  
  for (let i = 0; i < 4; i++) {
    song_container.push(ObjectFactory('.song_container','#song'+i));
    like_buttons.push(ObjectFactory('.like_bttn','#like'+i));  
    dislike_buttons.push(ObjectFactory('.dislike_bttn','#dislike'+i));  
  };
  
  function ObjectFactory($class, $id){ //PogChamp
    let element = {};
    element.class = $class;
    element.id = $id;
    element.x = parseFloat($(element.id).css("left"));
    element.y = parseFloat($(element.id).css("top"));
    element.width = $(element.id).width();
    element.height = $(element.id).height();
    element.left = element.x; //to make the code more readable, I just added a left right up and down to everything 
    element.right = element.x - element.width;
    element.top = element.y;
    element.bottom = element.y + element.height;
    return element;
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  showCurrentButton(current_button, previous_button);
  $(document).on('keydown', handleKeyDown);
  //$(document).on('keyup', handleKeyUp);
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if (event.key === 'ArrowUp') {
      console.log("Pressed up");
      previous_button = current_button;
      current_button -= 2;
      if (current_button < 0){
        current_button = 7;
      };
      showCurrentButton(current_button, previous_button); 
    };
    if (event.key === 'ArrowDown') {
      console.log("Pressed down");
      previous_button = current_button;
      current_button += 2;
      if (current_button > 7){
        current_button = 0;
      };
      showCurrentButton(current_button, previous_button);
    };
    if (event.key === 'ArrowRight') {
      console.log("Pressed right");
      previous_button = current_button;
      current_button += 1;
      if (current_button > 7){
        current_button = 0;
      };
      showCurrentButton(current_button, previous_button); 
    };
    if (event.key === 'ArrowLeft') {
      console.log("Pressed left");
      previous_button = current_button;
      current_button -= 1;
      if (current_button < 0){
        current_button = 7;
      };
      showCurrentButton(current_button, previous_button);
    };
    if (event.key === ' ') {
      console.log("SpacePressed");
      if (verifyNewVote(current_button) === false){
        vote(current_button);
      }
      else{
        alert("You already voted on this song, pick another");
      };
    };
  };

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function showCurrentButton(button, prevButton){
    
    if (button % 2 === 0){ // like buttons are always going to be even
      console.log("Hovering a like button");
      lIndex = button / 2; // we have to divide the button's value by 2 so it matches
      //{cont.} the index in the like_buttons list
      $(like_buttons[lIndex].id).css("border-color", "blue");
      $(like_buttons[lIndex].id).css("border-width", "5px");
    }
    else { // if it's not a like button then it's a dislike button
      console.log("Hovering a dislike button");
      dIndex = (button - 1) / 2; // we have to subtract 1 from the button's value then
      //{cont.} divide it by 2 so it matches the index in the dislike_buttons list
      $(dislike_buttons[dIndex].id).css("border-color", "blue");
      $(dislike_buttons[dIndex].id).css("border-width", "5px");
    };

    if (prevButton != null){ 
      if (prevButton % 2 === 0){ // if a like button was previously selected
        lIndex = prevButton / 2;
        $(like_buttons[lIndex].id).css("border-color", "black");
        $(like_buttons[lIndex].id).css("border-width", "2px");
      }
      else { // if a dislike button was previously selected
        dIndex = (prevButton - 1) / 2;
        $(dislike_buttons[dIndex].id).css("border-color", "black");
        $(dislike_buttons[dIndex].id).css("border-width", "2px");
      };
    };
  };

  function verifyNewVote(button){
    let songID;

    if (button % 2 == 0){
      songID = button/2;
    }
    else{
      songID = (button - 1)/2;
    };
    return(votedSongs.includes(songID));
  }

  function vote(button){
    let songID;

    if (button % 2 == 0){
      songID = button/2;
      alert("Song Liked!")
    }
    else{
      songID = (button - 1)/2;
      alert("Song Disiked!")
    };

    votedSongs.push(songID);
  };

  function trueVote(button){
    let songID;

    if (button % 2 == 0){
      songID = button/2;
      const data = {ID: songID, like: true};
    }
    else{
      songID = (button - 1)/2;
      const data = {ID: songID, like: false};
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch('/api', options);

    votedSongs.push(songID);
  };

  // function handleKeyUp(event){
  //   if (event.key === 'ArrowUp') { //when the up arrow is released, make player2's paddle's speedY 0
  //     console.log("player2 released up");
  //     rightPaddle.speedY = 0; 
  //   }
  //   if (event.key === 'ArrowDown') { //when the down arrow is released, make player2's paddle's speedY 0
  //     console.log("player2 released down");
  //     rightPaddle.speedY = 0; 
  //   }
  // }
//   function beginGaming(){
//       running = true; //NOTE: it'd technically make sense to have running start as true and set it to false but
//       //{cont.} I think it's more intuitive that running is true if the game is running
      
//       ball.speedY = 2.75; //since the speed in the FactoryPog is always automatically set to 0, 
//       ball.speedX = 2.75; // {cont.} we need to set the speedX and speedY for the ball
      
//       player1ScoreBox.text = $(player1ScoreBox.id).text(player1ScoreBox.score); //this just shows the scores
//       player2ScoreBox.text = $(player2ScoreBox.id).text(player2ScoreBox.score);
//       reset();
//   }

//   function pause(){
//     paused = true; //set paused to true so next time we hit space we'll unpause
//     countdownBox.text = $(countdownBox.id).text("Press Space To Resume"); //display Press Space To Resume
//     clearInterval(interval); //stop the game
//   }

//   function resume(){
//     paused = false; //set paused to false so next time we hit space we'll pause
//     interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL); //restart the game
//     countdownBox.text = $(countdownBox.id).text("Go!"); //display Go!
    
//   }

//   function repositionGameItem(obj) {
//     obj.x += obj.speedX; // update the position of the obj along the x-axis
//     obj.left = obj.x; //update the left and right properties of the object
//     obj.right = obj.x + obj.width;
//     obj.y += obj.speedY; // update the position of the obj along the y-axis
//     obj.top = obj.y; //update the top and bottom properties of the object
//     obj.bottom = obj.y + obj.height;
//   }

//   function redrawGameItem(obj) { //this is pretty self explanitory...
//     $(obj.id).css("top", obj.y);
//     $(obj.id).css("left", obj.x);
//   }


//   function wallCollision(obj, type){
//     if (type === 'paddle') { //if the object is a paddle...
//       if (obj.top < board.top){ //and the top of the paddle is above the top of the board
//         obj.y = board.top; //reset the paddle's position to be touching the border
//       } 
//       else if (obj.bottom > board.bottom) { //do the same for the bottom
//         obj.y = board.bottom - obj.height; 
//       }
//     } 
//     else if (type === 'ball') { //if the object is the ball...
//       if (obj.top < board.top){ //and the top of the ball is above the top of the board
//         obj.top = board.top; //reset the ball's position to be touching the border
//         obj.speedY = -obj.speedY; //and make the ball go the opposite way (on the y-axis)
//       } 
//       else if (obj.bottom > board.bottom) { //do the same for the bottom
//         obj.y = board.bottom - obj.height; 
//         obj.speedY = -obj.speedY; 
//       } else if (obj.left < board.left){ //if the ball hits the left side
//         increaseScore(player2ScoreBox); //run increaseScore for player 2 (since it's player1's side)
//       } else if (obj.right > board.right){ //if the ball hits the right side
//         increaseScore(player1ScoreBox); //run increaseScore for player 1 (since it's player2's side)
//       }
//     }
//     else{ //if the object isn't the ball or a paddle
//       console.log("There is literally no physical way to get here.") //there's no reason for putting this here except for the fact i thought it was funny lmao
//     }
//   }

//   function increaseScore(player){
//     player.score += 1; //increase the player's score by 1
//     player.text = $(player.id).text(player.score); //print the new score
//     if (player.score >= 11){ //if the player's score is above 11
//       endGame(); //end the game
//     }
//     else { //if the player's score is below 11
//       reset(); //run the reset function
//     }
//   }

//   function reset(){
//     ball.x = 210; //set the ball back to the middle
//     ball.y = 210;

//     //so this makes sure that the ball's net speed always increases
//     if (ball.speedX > 0){ //if the ball's speedX is positive  
//       ball.speedX += 0.25; //add .25
      
//     } else { //if the ball's speedX is negative
//       ball.speedX -= 0.25; //subtract .25
//     } 
//     if (ball.speedY > 0){ //this just does the same for the y axis
//       ball.speedY += 0.25;
//     } else {
//       ball.speedY -= 0.25;
//     } //I think there might be a way to avoid the if statements completely with Math.abs() but I couldn't figure it out D:
    
//     //these if statements randomly choose a direction for the ball to move in based on num
//     var num = Math.ceil(Math.random() * 4); //this gives a random number from 1-4
//     if (num === 1) { 
//       ball.speedX = -ball.speedX;
//       ball.speedY = -ball.speedY;
//     } else if (num === 2) {
//       ball.speedX = -ball.speedX;
//     } else if (num === 3) {
//       ball.speedY = -ball.speedY;
//     }

//     oldSpeedX = ball.speedX; //this records what the ball's speed is
//     oldSpeedY = ball.speedY;
//     ball.speedX = 0; //this pauses the ball's speed
//     ball.speedY = 0;     
//     countdownTimer = setInterval(countdown, 500); //I have 0 training with intervals, so I just copied what
//     //{cont.} you guys did with new func. and did some research to figure out how to make this work. I would
//     //{cont.} like to note that for some reason, functions called in intervals can't acess local vars. I'm sure
//     //{cont.} it's some scope/higher order function bs, but I'm too lazy to figure it out, so I just made
//     //{cont.} oldSpeedX&Y and the countdownTimer global vars
//   }

//   function countdown(){
//     countdownBox.score = countdownTime; //instead of adding another element to the factory, I decided to just use the score function for the countdown
//     //note: countdownTime is automatically set to three when the site is loaded
//     countdownBox.text = $(countdownBox.id).text(countdownBox.score); //display how many seconds until we start
//     countdownTime -= 1;
//     if (countdownTime < 0) { //when the countdown hits 0
//       countdownBox.text = $(countdownBox.id).text("Go!"); //we show "Go!" instead of 0
//       ball.speedX = oldSpeedX; //basically unpause the ball
//       ball.speedY = oldSpeedY;
//       clearInterval(countdownTimer); //stop the countdown interval
//       countdownTime = 3; //reset the countdownTime to three for next time
//     } //if you get bored check out line 316
//   }


//   function paddleBallCollision(paddle) {
//     if (collisionCheck(paddle, ball)) { //if the collision check function returns true
//       ball.speedX = -ball.speedX; //make the ball go the opposite way
//       if (ball.right > paddle.left && ball.left < paddle.left){ //if the ball is colliding on the right of the paddle        
//           ball.x = paddle.left - ball.width; //set the ball back to the appropriate border
//         }        
//       else if (ball.left < paddle.right && ball.right > paddle.right) { //if the ball is colliding on the left of the paddle
//         ball.x = paddle.right; //set the ball back to the appropriate border
//       }
//     }
//   }
    

//   function collisionCheck(obj1, obj2) { //this function just returns true if two objects are colliding and returns false if they aren't
//     if ((obj1.left < obj2.right) && (obj1.right > obj2.left) && (obj1.top < obj2.bottom) && (obj1.bottom > obj2.top)) {
//       return true;
// 	  } else {
//       return false
//     }
//   }
  

  

//   function resetBoard() { //since top is used for the collision checks, but everything is absolute,
//     //{cont.} we need to reset the top and bottom of the board to 0 so the checks work, and I wanted to
//     //{cont.} just make this function to avoid magic numbers in the collision function
//     board.top = board.y - parseFloat($("#all_contents").css("top"));
//     board.bottom = (board.y + board.height) - parseFloat($("#board").css("top"));
//   }
  
//   function endGame() {
//     // stop the interval timer
//     clearInterval(countdownTimer); //stop the countdown timer
//     clearInterval(interval); //stop the game
//     var winner = player1ScoreBox.score === 11 ? 1 : 2; //if player1 has more than 11, they won, otherwise player2 won
//     countdownBox.text = $(countdownBox.id).text("Game! Player " + winner + " wins!"); //display the winner
//     var winnerColor = winner === 1 ? "orange" : "magenta";
//     $("body").css("background-color", winnerColor);
//     $("#countdownBox").css("color", winnerColor);
    

//     // turn off event handlers
//     $(document).off();
//   }
  
}

//real quick, I'd just like to give a shoutout to my mom, because she was not only interested in my code,
//{cont.} but she actually gave me an idea on how to pause the game while the countdown was going on.
//{cont.} I didn't end up using it for the countdown, but her method (clear the newFrame interval) is how I 
//{cont.} ended up handeling the actual pausing of the game with spacebar.