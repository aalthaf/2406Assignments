/*
COMP 2406 (c) L.D. Nel 2018

Javascript to handle mouse dragging and release
to drag a string around the html canvas.
Keyboard arrow keys are used to move a moving box around.

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM elements are the canvas on which
where are drawing and a text field and button where the user can type data.

This example shows examples of using JQuery.
JQuery is a popular helper library that has useful methods,
especially for sendings asynchronous (AJAX) requests to the server
and catching the responses.

See the W3 Schools website to learn basic JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data
*/

//Use javascript array of objects to represent words and their locations
let words = []

let transpose = []

let notes= []


let wordBeingMoved

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas



function drawCanvas() {

  let context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '12pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'
  g = 50

  for (let i = 0; i < words.length; i++) {
    //let w = 0
    let data = words[i]
    //w = data.split(" ")

    //console.log(data.getCharAt(1))
    context.fillText(data, 50,g );
    context.strokeText(data,50,g )
    //console.log("printing")

      g = g+ 50
  }

  /*
  for (let j = 0; j < notes.length;j++){
    let n = notes[j]
    context.fillStyle = "orange"
    context.clearRect(n.x , n.y * 50 , n.x + 20 , n.y + 20)
    context.fillText(n.word , n.x , 50 + (n.y * 50) )
    context.strokeText(n.word , n.x , 50+ (n.y * 50))


  }
  */
  //canvas.clearRect()
  context.stroke()
}

function handleMouseDown(e) {

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  //var canvasX = e.clientX - rect.left
  //var canvasY = e.clientY - rect.top
  let canvasX = e.pageX - rect.left //use jQuery event object pageX and pageY
  let canvasY = e.pageY - rect.top
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word)
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    //document.addEventListener("mousemove", handleMouseMove, true)
    //document.addEventListener("mouseup", handleMouseUp, true)
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event // TODO:  stop any default
  // browser behaviour

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  console.log("mouse move")

  //get mouse location relative to canvas top left
  let rect = canvas.getBoundingClientRect()
  let canvasX = e.pageX - rect.left
  let canvasY = e.pageY - rect.top

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs
function handleTimer() {

  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

function handleTransposeUp() {

}

function handleTransposeDown() {
    for (let i = 0; i< words.length ; i++){



    }

}


function handleSubmitButton() {

  let userText = $('#userTextField').val(); //get text from user text input field
  const context = canvas.getContext('2d')// get context
  let textDiv = document.getElementById("text-area")

  //scanvas.clearRect(0,0,canvas.width, canvas.height);
  if (userText && userText != '') {



    //user text was not empty
    let userRequestObj = {
      text: userText
    } //make object to send to server
    let userRequestJSON = JSON.stringify(userRequestObj) //make JSON string
    $('#userTextField').val('') //clear the user text field

    //Prepare a POST message for the server and a call back function
    //to catch the server repsonse.
    //alert ("You typed: " + userText)
    $.post("userText", userRequestJSON, function(data, status) {
      console.log("data: " + data)

      console.log("typeof: " + typeof data)
      let responseObj = JSON.parse(data)
    //  console.log(responseObj)
      //console.log(responseObj.wordArray)
    //  movingString.word = responseObj.text
      //replace word array with new words if there are any
      if (responseObj.wordArray) {

        words = responseObj.wordArray
        //fill the text area with the current song
        for (let i=0; i < words.length ; i++){
          textDiv.innerHTML = textDiv.innerHTML + `<p> ${words[i]}</p>`

        }


        /*
        let ctx = canvas.getContext('2d');
        // find the notes and push them into the array containing width and the line
        let w = 0;
        for(let j = 0 ; j< words.length;j++){
            w=50;
            b = words[j].split(' ')
          //  console.log(b)
            for(let v =0;v<b.length;v++){
              w = w + ctx.measureText(b[v]).width + v * ctx.measureText(" ").width;
              console.log(w)
              if(b[v].indexOf('[') > -1){
                notes.push({word:b[v], x: w , y:j})
              }
            }

        }
        */
        //console.log(ts);
        drawCanvas();
      }

    })
  }else{
      $("#text-area").empty() // clear text area if nothing was submitted
      context.clearRect(0,0,canvas.width,canvas.height) // clear the canvas if nothing was submitted

  }

}


$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
//  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
//  $(document).keydown(handleKeyDown)
//  $(document).keyup(handleKeyUp)

  //timer = setInterval(handleTimer, 100)
  //clearTimeout(timer) //to stop




})
