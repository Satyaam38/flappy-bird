//board part objects
let board;
let boardwidth=360;
let boardheight=640;
let context;

//bird objects
let birdy=boardheight/2;
let birdx=boardwidth/8;
let birdheight = 24;
let birdwidth= 34;
let bird = {
    y : birdy,
    x : birdx,
    width : birdwidth,
    height : birdheight
}
//let birdimage;
let birdimages=[];
let birdimageindex=0;

//pipe object
let pipearray=[];
let pipewidth=64;
let pipelength=512;
let toppipeimage;
let bottonpipeimage;
let pipex=boardwidth;
let pipey=0;

//physics
let velocityx=-2;
let velocityy=0;
let gravity=0.3;

//gameover
let Gameover=false;

//score
let Score=0;

//sounds
let Wingsound = new Audio("./images/flappy_whoosh-43099.mp3")
let Endsound = new Audio("./images/flappy-bird-hit-sound-101soundboards.mp3")






//loading screen part
window.onload=function(){
    //board part
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");

    //bird part
    // context.fillStyle="birdimage";
    // context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //bird image
    // birdimage = new Image();
    // birdimage.src= "./images/flappybird.png";
    // birdimage.onload = function(){
    //     context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);
        
    // }
    for(let i=0;i<4;i++){
let birdimage = new Image();
birdimage.src = `./images/flappybird${i}.png`
birdimages.push(birdimage);

    }
    toppipeimage = new Image();
    toppipeimage.src = "./images/toppipe.png";
    bottonpipeimage = new Image();
    bottonpipeimage.src = "./images/bottompipe.png"

    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    setInterval(imageload,100);
    document.addEventListener("keydown",movebird);

}
function imageload(){
    birdimageindex++;
    birdimageindex%=4;
} 

//updation part
function update(){
    requestAnimationFrame(update);
    if(Gameover){
        return;
    }
    if(bird.y > boardheight){
        Gameover=true;
    }
    context.clearRect(0,0,board.width,board.height);
    //context.drawImage(birdimage,bird.x,bird.y,bird.width,bird.height);
    context.drawImage(birdimages[birdimageindex],bird.x,bird.y,bird.width,bird.height);
    velocityy+=gravity;
    bird.y+=velocityy;
    bird.y=Math.max(velocityy+bird.y,0);
    for(i=0;i<pipearray.length;i++){
        let pipe=pipearray[i];
        pipe.x+=velocityx;
        context.drawImage(pipe.image,pipe.x,pipe.y,pipe.width,pipe.length);
        if(detectcollision(bird,pipe)){
            Gameover=true;
        }
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            Score+=0.5;
            pipe.passed=true;
        }
    }
    while(pipearray.length>0 && pipearray[0].x < -pipewidth){
        pipearray.shift();
    }

    context.fillStyle="white";
    context.font="45px sans-serif";
    context.fillText(Score,5,45);
    if(Gameover){
        context.fillText("Game Over",5,90);
        Endsound.play();
    }
}


function placePipes(){
    if(Gameover){
        return;
    }
    let randompipey = pipey - pipelength/4 - Math.random()*(pipelength/2);
    let toppipe = {
        image : toppipeimage,
        x : pipex,
        y : randompipey,
        length : pipelength,
        width : pipewidth,
        passed : false,
    }
    pipearray.push(toppipe);
    let bottompipe = {
        image : bottonpipeimage,
        x : pipex,
        y : randompipey + 512 + 128,
        length : pipelength,
        width : pipewidth,
        passed : false,
    }
    pipearray.push(bottompipe);
}

function movebird(e){
    if(e.code == "Space"){
    velocityy = -4;
    //Wingsound.play();
    if(Gameover){
        bird.y=birdy;
        Gameover=false;
        pipearray=[];
        Score=0;
    }
}
}


function detectcollision(a,b){
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.length && a.y + a.height > b.y;
}