/*
COMP 2406 (c) L.D. Nel 2018

Javascript to handle mouse dragging and release
to drag a string around the html canvas.
Keyboard arrow keys are used to move a moving box around.

Here we are doing all the work with javascript and jQuery. (none of the sentences
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

let sentences = []
//The sentence array wil be used to store the songs where each index contain one line of the song

let transpose1 = []
let transpose2 = []


//the words array will be used to keep track of where the words are in the canvas
let words = []

let wordBeingMoved

let deltaX, deltaY //location where mouse is pressed
const canvas = document.getElementById('canvas1'); //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {
  //locate the word near aCanvasX,aCanvasY



  let context = canvas.getContext('2d')

  for (let i = 0; i < words.length; i++) {
    if (Math.abs(words[i].x - aCanvasX) < context.measureText(words[i].word).width  &&
      Math.abs(words[i].y - aCanvasY) < 20) {
      //  console.log(words[i])
        return words[i]
      }
  //console.log(words[2].word.length)

  }
    return null
}

function putWordsinArray(){
    let context = canvas.getContext('2d')
    let tempWords = []
    for (let i = 0; i < sentences.length; i++){
      let lineWords = sentences[i].split(" ")
      console.log(lineWords)

      let w = 50 // width
      let g = 50 // height- increases by each line
      for (let j = 0; j < lineWords.length; j++){
        if(lineWords[j].indexOf("[") >= 0){
          //There will be four cases
          //1. Starts with "["
          // 2 . "[" is in the middle and word ends with "]"
          // 3 . "[" is in middle and word doesnt end with "]"
          // 4. The normal case where it is something like "[A]"
          if(lineWords[j].indexOf("[") !=0 && lineWords[j].indexOf("]") !=lineWords[j].length -1){
            //3rd case
            let frontBracket = lineWords[j].indexOf("[")
            let backBracket = lineWords[j].indexOf("]")
            let sub5 = lineWords[j].substr(0,frontBracket)
            let sub6 = lineWords[j].substr(frontBracket,backBracket- frontBracket+1)
            let sub7 = lineWords[j].substr(backBracket+1, lineWords[j].length - 1)
            tempWords.push({word:sub5 , x : w , y: 50 + 50*i})
            // Using context to measure A to put some space between
            w = w + context.measureText(sub5).width + 1.5* context.measureText("A").width
            tempWords.push({word:sub6,x:w,y:50+50*i})
            w = w + context.measureText(sub6).width+ 1.5* context.measureText("A").width
            tempWords.push({word:sub7,x:w,y:50+50*i})
            w = w + context.measureText(sub7).width+ 1.5* context.measureText("A").width
            continue
          }

          else if(lineWords[j].indexOf("]")!= lineWords[j].length - 1){
            // 3rd case
            let sub1 = lineWords[j].substr(0,lineWords[j].indexOf("]")+1);
            let sub2 = lineWords[j].substr(lineWords[j].indexOf("]") +1 , lineWords[j].length - 1)
            tempWords.push({word:sub1 , x : w , y: 50 + 50*i})
            w = w + context.measureText(sub1).width + 1.5* context.measureText("A").width
            tempWords.push({word:sub2,x:w,y:50+50*i})
            w = w + context.measureText(sub2).width+ 1.5* context.measureText("A").width
            continue

          }
          else if(lineWords[j].indexOf("[") !=0 && lineWords[j].indexOf("]") == lineWords[j].length -1 ){
            // 2nd case
            let sub3 = lineWords[j].substr(0, lineWords[j].indexOf("["))
            let sub4 = lineWords[j].substr(lineWords[j].indexOf("[") ,lineWords[j].indexOf("]")- lineWords[j].indexOf("[") + 1)
            tempWords.push({word:sub3 , x : w , y: 50 + 50*i})
            w = w + context.measureText(sub3).width
            tempWords.push({word:sub4,x:w,y:50+50*i})
            w = w + context.measureText(sub4).width
            continue
          }

          else{
            //4th case
            tempWords.push({ word: lineWords[j] , x: w , y: 50 + 50 * i})
          }

        }else{
          if(lineWords[j]!= " "){ // to get rid of random empty spaces
          tempWords.push({word:lineWords[j], x:w , y: 50 + 50*i})
          }
        }
        w = w + context.measureText(lineWords[j]).width + 3.5 * context.measureText("A").width
      }

    }
    console.log(tempWords)


    words = tempWords

}

function drawCanvas() {

  let context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '12pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'


  for (let i = 0; i < words.length; i++) {

     let data = words[i]
     if(data.word.startsWith("[")){
       context.fillStyle= 'orange'
       context.strokeStyle = 'orange'
     }else{
       context.fillStyle = 'cornflowerblue'
       context.strokeStyle = 'blue'
     }
     context.fillText(data.word, data.x, data.y);
     context.strokeText(data.word, data.x, data.y)

   }

  //console.log(words)
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
  console.log(wordBeingMoved.word)
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

function handleMouseUp(e) {
  console.log("mouse up")

  e.stopPropagation()

  //$("#canvas1").off(); //remove all event handlers from canvas
  //$("#canvas1").mousedown(handleMouseDown); //add mouse down handler

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
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


function handleTransposeUp() {

}

function handleTransposeDown() {
    for (let i = 0; i< sentences.length ; i++){



    }

}


function handleSubmitButton() {

  let userText = $('#userTextField').val(); //get text from user text input field
  const context = canvas.getContext('2d')// get context
  let textDiv = document.getElementById("text-area")

  $("#text-area").empty() // clear text area if nothing was submitted
  context.clearRect(0,0,canvas.width,canvas.height) // clear the canvas if nothing was submitted
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
      //replace sentence array with new sentences if there are any
      if (responseObj.wordArray) {

        sentences = responseObj.wordArray
        putWordsinArray();
        //fill the text area with the current song
        for (let i=0; i < sentences.length ; i++){
          textDiv.innerHTML = textDiv.innerHTML + `<p> ${sentences[i]}</p>`

        }
        drawCanvas();
      }

    })
  }

}


$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)
})
