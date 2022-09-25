var body = document.getElementById("myBody");
var canvas = document.getElementById("myCanvas");

var ctx = canvas.getContext("2d");

var img = new Image();
img.src = "imagenes/GFG35.png";

img.onload = function() {
   ctx.drawImage(img, 0, 0);
}

//let imgcv = cv.imread(canvas);
//console.log(imgcv);
//cv.imshow(canvasOutput, img);
//img.delete();

if (cv.getBuildInformation)
{
   console.log(cv.getBuildInformation());
   onloadCallback();
}
else
{
   // WASM
   cv['onRuntimeInitialized']=()=>{
      //console.log(cv.getBuildInformation());
      let imgcv = cv.imread(canvas, 1);
      console.log(imgcv);
      console.log(imgcv.shape);
   }
}