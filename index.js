/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  
  // Game Item Objects
  var leftPaddle = FactoryPog('#leftPaddle');
  var rightPaddle = FactoryPog('#rightPaddle');
  var ball = FactoryPog('#ball');
  var board = FactoryPog('#board');
  var player1ScoreBox = FactoryPog('#player1ScoreBox');
  var player2ScoreBox = FactoryPog('#player2ScoreBox');
  var countdownBox = FactoryPog('#countdownBox');
  var countdownTime = 3;
  var running = false;
  var paused = false;
  var countdownTimer;
  var oldSpeedX;
  var oldSpeedY;
  

  // one-time setup
  resetBoard(); //see the actual function for explanation
  countdownBox.text = $(countdownBox.id).text("Press Space to Begin!"); 
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp); 
  
  
  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    //do all the repositioning and checks
    repositionGameItem(leftPaddle);
    repositionGameItem(rightPaddle);
    repositionGameItem(ball);
    wallCollision(leftPaddle, 'paddle');
    wallCollision(rightPaddle, 'paddle');
    wallCollision(ball, 'ball');
    paddleBallCollision(leftPaddle);
    paddleBallCollision(rightPaddle);
    
    //once we figure out where everything is, actually draw it on the board
    redrawGameItem(leftPaddle);
    redrawGameItem(rightPaddle);
    redrawGameItem(ball);
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if (event.key === 'w') { //when w is pressed, make player1's paddle's speedY -5
      console.log("player1 pressed up");
      leftPaddle.speedY = -5; 
    }
    if (event.key === 's') { //when s is pressed, make player1's paddle's speedY 5
      console.log("player1 pressed down");
      leftPaddle.speedY = 5; 
    }
    if (event.key === 'ArrowUp') { //when the up arrow is pressed, make player2's paddle's speedY -5
      console.log("player2 pressed up");
      rightPaddle.speedY = -5; 
    }
    if (event.key === 'ArrowDown') { //when the down arrow is pressed, make player2's paddle's speedY 5
      console.log("player2 pressed down");
      rightPaddle.speedY = 5; 
    }
    if (event.key === ' ') { //when the down arrow is pressed, make player2's paddle's speedY 5
      console.log("SpacePressed");
      if(!running){
        beginGaming();
      } else if (paused){
        resume();
      } else {
        pause();
      }
    }
  }

  function handleKeyUp(event){
    if (event.key === 'w') { //when w is released, make player1's paddle's speedY 0
      console.log("player1 released up");
      leftPaddle.speedY = 0; 
    }
    if (event.key === 's') { //when s is released, make player1's paddle's speedY 0
      console.log("player1 released down");
      leftPaddle.speedY = 0; 
    }
    if (event.key === 'ArrowUp') { //when the up arrow is released, make player2's paddle's speedY 0
      console.log("player2 released up");
      rightPaddle.speedY = 0; 
    }
    if (event.key === 'ArrowDown') { //when the down arrow is released, make player2's paddle's speedY 0
      console.log("player2 released down");
      rightPaddle.speedY = 0; 
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function beginGaming(){
      running = true; //NOTE: it'd technically make sense to have running start as true and set it to false but
      //{cont.} I think it's more intuitive that running is true if the game is running
      
      ball.speedY = 2.75; //since the speed in the FactoryPog is always automatically set to 0, 
      ball.speedX = 2.75; // {cont.} we need to set the speedX and speedY for the ball
      
      player1ScoreBox.text = $(player1ScoreBox.id).text(player1ScoreBox.score); //this just shows the scores
      player2ScoreBox.text = $(player2ScoreBox.id).text(player2ScoreBox.score);
      reset();
  }

  function pause(){
    paused = true; //set paused to true so next time we hit space we'll unpause
    countdownBox.text = $(countdownBox.id).text("Press Space To Resume"); //display Press Space To Resume
    clearInterval(interval); //stop the game
  }

  function resume(){
    paused = false; //set paused to false so next time we hit space we'll pause
    interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL); //restart the game
    countdownBox.text = $(countdownBox.id).text("Go!"); //display Go!
    
  }

  function repositionGameItem(obj) {
    obj.x += obj.speedX; // update the position of the obj along the x-axis
    obj.left = obj.x; //update the left and right properties of the object
    obj.right = obj.x + obj.width;
    obj.y += obj.speedY; // update the position of the obj along the y-axis
    obj.top = obj.y; //update the top and bottom properties of the object
    obj.bottom = obj.y + obj.height;
  }

  function redrawGameItem(obj) { //this is pretty self explanitory...
    $(obj.id).css("top", obj.y);
    $(obj.id).css("left", obj.x);
  }


  function wallCollision(obj, type){
    if (type === 'paddle') { //if the object is a paddle...
      if (obj.top < board.top){ //and the top of the paddle is above the top of the board
        obj.y = board.top; //reset the paddle's position to be touching the border
      } 
      else if (obj.bottom > board.bottom) { //do the same for the bottom
        obj.y = board.bottom - obj.height; 
      }
    } 
    else if (type === 'ball') { //if the object is the ball...
      if (obj.top < board.top){ //and the top of the ball is above the top of the board
        obj.top = board.top; //reset the ball's position to be touching the border
        obj.speedY = -obj.speedY; //and make the ball go the opposite way (on the y-axis)
      } 
      else if (obj.bottom > board.bottom) { //do the same for the bottom
        obj.y = board.bottom - obj.height; 
        obj.speedY = -obj.speedY; 
      } else if (obj.left < board.left){ //if the ball hits the left side
        increaseScore(player2ScoreBox); //run increaseScore for player 2 (since it's player1's side)
      } else if (obj.right > board.right){ //if the ball hits the right side
        increaseScore(player1ScoreBox); //run increaseScore for player 1 (since it's player2's side)
      }
    }
    else{ //if the object isn't the ball or a paddle
      console.log("There is literally no physical way to get here.") //there's no reason for putting this here except for the fact i thought it was funny lmao
    }
  }

  function increaseScore(player){
    player.score += 1; //increase the player's score by 1
    player.text = $(player.id).text(player.score); //print the new score
    if (player.score >= 11){ //if the player's score is above 11
      endGame(); //end the game
    }
    else { //if the player's score is below 11
      reset(); //run the reset function
    }
  }

  function reset(){
    ball.x = 210; //set the ball back to the middle
    ball.y = 210;

    //so this makes sure that the ball's net speed always increases
    if (ball.speedX > 0){ //if the ball's speedX is positive  
      ball.speedX += 0.25; //add .25
      
    } else { //if the ball's speedX is negative
      ball.speedX -= 0.25; //subtract .25
    } 
    if (ball.speedY > 0){ //this just does the same for the y axis
      ball.speedY += 0.25;
    } else {
      ball.speedY -= 0.25;
    } //I think there might be a way to avoid the if statements completely with Math.abs() but I couldn't figure it out D:
    
    //these if statements randomly choose a direction for the ball to move in based on num
    var num = Math.ceil(Math.random() * 4); //this gives a random number from 1-4
    if (num === 1) { 
      ball.speedX = -ball.speedX;
      ball.speedY = -ball.speedY;
    } else if (num === 2) {
      ball.speedX = -ball.speedX;
    } else if (num === 3) {
      ball.speedY = -ball.speedY;
    }

    oldSpeedX = ball.speedX; //this records what the ball's speed is
    oldSpeedY = ball.speedY;
    ball.speedX = 0; //this pauses the ball's speed
    ball.speedY = 0;     
    countdownTimer = setInterval(countdown, 500); //I have 0 training with intervals, so I just copied what
    //{cont.} you guys did with new func. and did some research to figure out how to make this work. I would
    //{cont.} like to note that for some reason, functions called in intervals can't acess local vars. I'm sure
    //{cont.} it's some scope/higher order function bs, but I'm too lazy to figure it out, so I just made
    //{cont.} oldSpeedX&Y and the countdownTimer global vars
  }

  function countdown(){
    countdownBox.score = countdownTime; //instead of adding another element to the factory, I decided to just use the score function for the countdown
    //note: countdownTime is automatically set to three when the site is loaded
    countdownBox.text = $(countdownBox.id).text(countdownBox.score); //display how many seconds until we start
    countdownTime -= 1;
    if (countdownTime < 0) { //when the countdown hits 0
      countdownBox.text = $(countdownBox.id).text("Go!"); //we show "Go!" instead of 0
      ball.speedX = oldSpeedX; //basically unpause the ball
      ball.speedY = oldSpeedY;
      clearInterval(countdownTimer); //stop the countdown interval
      countdownTime = 3; //reset the countdownTime to three for next time
    } //if you get bored check out line 316
  }


  function paddleBallCollision(paddle) {
    if (collisionCheck(paddle, ball)) { //if the collision check function returns true
      ball.speedX = -ball.speedX; //make the ball go the opposite way
      if (ball.right > paddle.left && ball.left < paddle.left){ //if the ball is colliding on the right of the paddle        
          ball.x = paddle.left - ball.width; //set the ball back to the appropriate border
        }        
      else if (ball.left < paddle.right && ball.right > paddle.right) { //if the ball is colliding on the left of the paddle
        ball.x = paddle.right; //set the ball back to the appropriate border
      }
    }
  }
    

  function collisionCheck(obj1, obj2) { //this function just returns true if two objects are colliding and returns false if they aren't
    if ((obj1.left < obj2.right) && (obj1.right > obj2.left) && (obj1.top < obj2.bottom) && (obj1.bottom > obj2.top)) {
      return true;
	  } else {
      return false
    }
  }
  

  function FactoryPog($id){ //PogChamp
    var element = {};
    element.id = $id;
    element.x = parseFloat($(element.id).css("left"));
    element.y = parseFloat($(element.id).css("top"));
    element.speedX = 0;
    element.speedY = 0;
    element.width = $(element.id).width();
    element.height = $(element.id).height();
    element.left = element.x; //to make the code more readable, I just added a left right up and down to everything 
    element.right = element.x + element.width;
    element.top = element.y;
    element.bottom = element.y + element.height;
    element.score = 0; //this is just for the scoreboxes and the countdownBox
    return element;
  }

  function resetBoard() { //since top is used for the collision checks, but everything is absolute,
    //{cont.} we need to reset the top and bottom of the board to 0 so the checks work, and I wanted to
    //{cont.} just make this function to avoid magic numbers in the collision function
    board.top = board.y - parseFloat($("#board").css("top"));
    board.bottom = (board.y + board.height) - parseFloat($("#board").css("top"));
  }
  
  function endGame() {
    // stop the interval timer
    clearInterval(countdownTimer); //stop the countdown timer
    clearInterval(interval); //stop the game
    var winner = player1ScoreBox.score === 11 ? 1 : 2; //if player1 has more than 11, they won, otherwise player2 won
    countdownBox.text = $(countdownBox.id).text("Game! Player " + winner + " wins!"); //display the winner
    var winnerColor = winner === 1 ? "orange" : "magenta";
    $("body").css("background-color", winnerColor);
    $("#countdownBox").css("color", winnerColor);
    

    // turn off event handlers
    $(document).off();
  }
  
}

//real quick, I'd just like to give a shoutout to my mom, because she was not only interested in my code,
//{cont.} but she actually gave me an idea on how to pause the game while the countdown was going on.
//{cont.} I didn't end up using it for the countdown, but her method (clear the newFrame interval) is how I 
//{cont.} ended up handeling the actual pausing of the game with spacebar.