


<html>

<head>
    <title>Video Chat App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link href="main.css" rel="stylesheet">
</head>

<body>
    <div class="container-fluid">
        <div class="row h-10 w-100">
            <div class="col">
                <select id="filter" class="w-100 bg-dark text-light ml-2 mt-2 select font-weight-bold border">
                    <option value="none">Normal</option>
                    <option value="grayscale(100%)">B & W</option>
                    <option value="sepia(100%)">Old School</option>
                    <option value="contrast(150%)">Lumination</option>
                    <option value="blur(20px)">Hidden Mist</option>
                    <option value="invert(100%)">Dracula</option>
                    <option value="hue-rotate(180deg">X-men Beast</option>
                    <option value="saturate(25)">Super Saiyan God</option>
                </select>
            </div>
            <div class="col">
                <div class="float-right mt-3">
                    <input class="form-check-input" type="checkbox" id="theme">
                    <label class="form-check-label" for="theme">
                        Dark Theme
                    </label>
                </div>
            </div>
        </div>
        <div class="row h-90 w-100">
            <div class="col-12 col-sm-6 d-flex justify-content-center">
              <canvas id="canvas" class="embed-responsive-item"></canvas>
                <div class="embed-responsive embed-responsive-16by9">
                  <video class="embed-responsive-item" muted></video>
                </div>

            </div>
            <div class="col-12 col-sm-6 d-flex justify-content-center">
                <div id="peerDiv" class="embed-responsive embed-responsive-16by9">
                </div>
            </div>
        </div>
    </div>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="bundle.js"></script>

</body>

</html>
































context = document.getElementById('canvasInAPerfectWorld').getContext("2d");
var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', canvasWidth);
canvas.setAttribute('height', canvasHeight);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
	canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");
$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;

  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});
$('#canvas').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});
$('#canvas').mouseup(function(e){
  paint = false;
});
$('#canvas').mouseleave(function(e){
  paint = false;
});
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}
function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 5;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }
}
