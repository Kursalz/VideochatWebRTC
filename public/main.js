
let Peer = require('simple-peer')
let socket = io()
const video = document.querySelector('video')
const filter = document.querySelector('#filter')
const checkboxTheme = document.querySelector('#theme')
let client = {}
let currentFilter
var canvas = document.getElementById("canvas"); //get the canvas from the page
var context = canvas.getContext("2d");

function sendCanvas(){

  var canvasSend =  document.getElementById("canvas").toDataURL();
  socket.emit('emit_to_draw',canvasSend);
}


//get canvas
var canvas = document.getElementById("canvas"); //get the canvas from the page
var context = canvas.getContext("2d");
$(document).ready(function() {
  var flag, dot_flag = false,
	prevX, prevY, currX, currY = 0,
	color = 'black', thickness = 2;
  var $canvas = $('#canvas');
  var contex = $canvas[0].getContext('2d');
  sendCanvas();

  $canvas.on('mousemove mousedown mouseup mouseout', function(e) {
    prevX = currX;
    prevY = currY;
    currX = parseInt(e.clientX,10) - $canvas.offset().left;
    currY = parseInt(e.clientY,10) - $canvas.offset().top;
    if (e.type == 'mousedown') {
      flag = true;
    }
    if (e.type == 'mouseup' || e.type == 'mouseout') {
      flag = false;
    }
    if (e.type == 'mousemove') {
      if (flag) {
        contex.beginPath();
        contex.moveTo(prevX, prevY);
        contex.lineTo(currX, currY);
        contex.strokeStyle = color;
        contex.lineWidth = thickness;
        contex.stroke();
        contex.closePath();
      }
    }
  });

  $('.canvas-clear').on('click', function(e) {
    c_width = $canvas.width();
    c_height = $canvas.height();
    contex.clearRect(0, 0, c_width, c_height);
    $('#canvasimg').hide();
  });
});
  canvas = canvas.toDataURL();


//get stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {

        socket.emit('NewClient')
        video.srcObject = stream
        video.play()
        console.log("Canvas inviato")

        filter.addEventListener('change', (event) => {
            currentFilter = event.target.value
            video.style.filter = currentFilter
            SendFilter(currentFilter)
            event.preventDefault
        })


        function InitCanvas(){
          socket.on('emit_to_draw',function(drawCanvas){
            var myCanvas = document.createElementById('my_canvas_id');
            var ctx = myCanvas.getContext('2d');
            var img = new Image;
            img.onload = function(){
              ctx.drawImage(img,0,0); // Or at whatever offset you like
            };
            img.src = canvasSend
          })
        }


        //used to initialize a peer
        function InitPeer(type) {
            let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
            peer.on('stream', function (stream) {
                CreateVideo(stream)

            })

            //This isn't working in chrome; works perfectly in firefox.
            // peer.on('close', function () {
            //     document.getElementById("peerVideo").remove();
            //     peer.destroy()
            // })
            peer.on('data', function (data) {

                let decodedData = new TextDecoder('utf-8').decode(data)
                let peervideo = document.querySelector('#peerVideo')
                peervideo.style.filter = decodedData

            })
            return peer
        }

        //for peer of type init
        function MakePeer() {
            client.gotAnswer = false
            let peer = InitPeer('init')
            peer.on('signal', function (data) {
                if (!client.gotAnswer) {
                    socket.emit('Offer', data)
                }
            })
            client.peer = peer

        }

        //for peer of type not init
        function FrontAnswer(offer) {
            let peer = InitPeer('notInit')
            peer.on('signal', (data) => {
                socket.emit('Answer', data)
            })
            peer.signal(offer)
            client.peer = peer
        }

        function SignalAnswer(answer) {
            client.gotAnswer = true
            let peer = client.peer
            peer.signal(answer)
        }

        function CreateVideo(stream) {
            CreateDiv()

            let video = document.createElement('video')
            video.id = 'peerVideo'
            video.srcObject = stream
            video.setAttribute('class', 'embed-responsive-item')
            document.querySelector('#peerDiv').appendChild(video)
            video.play()
            //wait for 1 sec
            setTimeout(() => SendFilter(currentFilter), 1000)

            video.addEventListener('click', () => {
                if (video.volume != 0)
                    video.volume = 0
                else
                    video.volume = 1
            })
            InitCanvas()
            console.log("Canvas ricevuto")



        }



        function SessionActive() {
            document.write('Session Active. Please come back later')
        }

        function SendFilter(filter) {
            if (client.peer) {
                client.peer.send(filter)
            }
        }

        function RemovePeer() {
            document.getElementById("peerVideo").remove();
            document.getElementById("muteText").remove();
            if (client.peer) {
                client.peer.destroy()
            }
        }

        socket.on('BackOffer', FrontAnswer)
        socket.on('BackAnswer', SignalAnswer)
        socket.on('SessionActive', SessionActive)
        socket.on('CreatePeer', MakePeer)
        socket.on('Disconnect', RemovePeer)

    })
    .catch(err => document.write(err))

checkboxTheme.addEventListener('click', () => {  //mute video function
    if (checkboxTheme.checked == true) {
        document.body.style.backgroundColor = '#212529'
        if (document.querySelector('#muteText')) {
            document.querySelector('#muteText').style.color = "#fff"
        }

    }
    else {
        document.body.style.backgroundColor = '#fff'
        if (document.querySelector('#muteText')) {
            document.querySelector('#muteText').style.color = "#212529"
        }
    }
}
)

function CreateDiv() {
    let div = document.createElement('div')
    div.setAttribute('class', "centered")
    div.id = "muteText"
    div.innerHTML = "Click to Mute/Unmute"
    document.querySelector('#peerDiv').appendChild(div)
    if (checkboxTheme.checked == true)
        document.querySelector('#muteText').style.color = "#fff"
}
