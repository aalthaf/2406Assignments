
//Server Code
const http = require("http"); //need to http
const fs = require("fs"); //need to read static files
const url = require("url"); //to parse url strings
const path = require("path") // path to get the songs from
const directoryPath = path.join(__dirname, 'songs')

const ROOT_DIR = "html"; //dir to serve static files from


const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain"
}

const get_mime = function(filename) {
  //Use file extension to determine the correct response MIME type
  for (let ext in MIME_TYPES) {
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
       return MIME_TYPES[ext]
    }
  }
  return MIME_TYPES["txt"]
}

http.createServer(function(request, response) {
    var urlObj = url.parse(request.url, true, false)
    console.log("\n============================")
    console.log("PATHNAME: " + urlObj.pathname)
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname)
    console.log("METHOD: " + request.method)

    var receivedData = ""

    //Event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    })



    //Event handler for the end of the message
    request.on("end", function() {
      console.log("received data: ", receivedData)
      console.log("type: ", typeof receivedData)

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {
        //Handle POST requests
        var dataObj = JSON.parse(receivedData)
        console.log("received data object: ", dataObj)
        console.log("type: ", typeof dataObj)
        //Here we can decide how to process the data object and what
        //object to send back to client.
        //FOR NOW EITHER JUST PASS BACK AN OBJECT
        //WITH "text" PROPERTY
        console.log("USER REQUEST: " + dataObj.text)



        //SOURCE url : https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
        fs.readdir(directoryPath,function(err,files){

          if(err){

            return console.log("error:  " + err)

          }

          files.forEach(function(file){

            if(file.substr(0,file.length - 4) == dataObj.text ){
              //to remove the .txt and compare the wanted file name
              var songLines =  fs.readFileSync('songs/'+file).toString().split("\n")
              var returnObj = {}

              returnObj.wordArray = songLines
              console.log("returning data object: ", returnObj)
              console.log("type: ", typeof returnObj)

              //object to return to client
              response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] })
              response.end(JSON.stringify(returnObj)) //send just the JSON object as plain text

            }

          });

        });
      }

      if (request.method == "GET") {
        //Handle GET requests
        //Treat GET requests as request for static file
        var filePath = ROOT_DIR + urlObj.pathname
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html"

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          //respond with file contents
          response.writeHead(200, { "Content-Type": get_mime(filePath) })
          response.end(data)
        })
      }
    })
  }).listen(3000)

console.log("Server Running at PORT 3000  CNTL-C to quit")
console.log("To Test:")
console.log("http://localhost:3000/Assignment1.html")
