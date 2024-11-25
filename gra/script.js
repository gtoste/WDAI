let hearts = 3;
let heart_width = 75;
let score = 0;
let scoreText = "00000";
let mousex = 0;
let mousey = 0;
let zombies = [];
let scale = 1;

const base_image = new Image();
const full_heart = new Image();
const empty_heart = new Image();
const aim = new Image();
const zombie = new Image();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d')
let width = window.innerWidth;
let height = window.innerHeight;

var audio = new Audio('./gfx/sad-music.mp3');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}


class Zombie{
    constructor() {
      this.x = 1440;
      this.y = getRandomInt(300,663);
      this.speed = getRandomInt(1,6);
      this.hearts = 3;
      this.scale = getRandomInt(1,3);
      this.counter = 0;
    }

    isInRange(x,y, sc){
        return (x >= this.x*sc && x <= this.x*sc + 100*sc*this.scale) && (y >= this.y*sc && y <= this.y*sc + 312*sc*this.scale/2)
    }

    drawZombie(context,sc,index){
        this.counter += this.speed;
        if(this.counter >= 240) this.counter=0;
        let animation = Math.floor(this.counter / 24);
        this.x -= this.speed;
        if(this.x <= 0){
            hearts -= 1;
            zombies.splice(index,1);
        }
        context.drawImage(zombie, animation*200, 0, 200, 312, 
        this.x * sc, this.y * sc, 100*sc*this.scale, 312*sc*this.scale/2)
    }
}

function addzombie(){
    zombies.push(new Zombie());
}

function init() {   
    document.addEventListener("mousemove", mouseMoveHandler, false);
    document.addEventListener("click", shoot, false);
    base_image.src = "./gfx/board-bg.jpg";
    full_heart.src = "./gfx/full_heart.png";
    empty_heart.src = "./gfx/empty_heart.png";
    aim.src = "./gfx/aim.png";
    zombie.src = "./gfx/walkingdead.png";
    window.requestAnimationFrame(draw);
}

function shoot(e){
    
    let x = null;
    let y = null;
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      x = relativeX;
    }
    if (e.clientY > 0 && e.clientY < canvas.height) {
    y = e.clientY;
    }

    if(!play) {
        if(x >= (1540/2-100)*scale && x <= (1540/2-100)*scale + 200*scale && y >= (963/2-50)*scale && y <= (963/2-50)*scale + 100*scale){
            play = true;
            hearts = 3;
            score = 5;
            scoreText = score.pad(5);
            audio.pause();
            audio.currentTime = 0;
        }else{
            return;
        }
    }; 

    if(x != null && y != null){
        let to_delete = null;
        for(let i = 0; i < zombies.length; i++){
            if(zombies[i].isInRange(x,y,scale)) {
                score += 20;
                to_delete = i;
            }
        }
        if(to_delete == null){
            score -= 5;
        }else{
            zombies.splice(to_delete, 1);
        }
        scoreText = score.pad(5)
    }
}


function resizeCanvas(){
    width = window.innerWidth;
    height = window.innerHeight;
    if(width > height * (1.6)){
        width = height * (1.6)
    }else{
        height = width * (0.625)
    }
    canvas.width = width;
    canvas.height = height;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      mousex = relativeX;
    }
    if (e.clientY > 0 && e.clientY < canvas.height) {
        mousey = e.clientY;
      }
  }
  

function drawHearts(context, scale){
    if (hearts < 1){
        context.drawImage(empty_heart, 50 * scale, 50 * scale, heart_width * scale, heart_width * scale);
    }else{
        context.drawImage(full_heart, 50 * scale, 50 * scale, heart_width * scale, heart_width * scale);
    }

    if (hearts < 2){
        context.drawImage(empty_heart, (heart_width + 60) * scale, 50 * scale, heart_width * scale, heart_width * scale);
    }else{
        context.drawImage(full_heart, (heart_width + 60) * scale, 50 * scale, heart_width * scale, heart_width * scale);
    }

    if (hearts < 3){
        context.drawImage(empty_heart, (2 * heart_width + 70) * scale, 50 * scale, heart_width * scale, heart_width * scale);
    }else{
        context.drawImage(full_heart, (2 * heart_width + 70) * scale, 50 * scale, heart_width * scale, heart_width * scale);
    }
}

function drawScore(context, scale){
    context.font = "bold "+ 70*scale + "px Arial"
    context.fillStyle = "white";
    context.fillText(scoreText, 1300*scale, 100*scale);
}

function drawMouse(context, scale){
    context.drawImage(aim, mousex-(300*scale/2), mousey-(300*scale/2), 300*scale, 300*scale);
}

function drawZombies(context, scale){
    for(let i = 0; i < zombies.length; i++){
        zombies[i].drawZombie(context, scale, i);
    }
}

let play = false;
function draw(){
    if(getRandomInt(0,120) === 60 && play){
        addzombie();
    }
    resizeCanvas();
    scale = width/1540;
    context.clearRect(0, 0, width, height);
    context.drawImage(base_image, 0, 0, width, height);
    drawScore(context, scale);
    drawHearts(context, scale);
    drawZombies(context, scale);
    drawMouse(context, scale);

    if(hearts <= 0 || !play){
        
        if(hearts <=0 ){
            audio.play();
        }
        play = false;
        zombies = [];
        context.beginPath();
        context.rect((1540/2-100)*scale,(963/2-50)*scale, 200*scale, 100*scale);
        context.fillStyle = 'rgba(245,40,145,0.8)';
        context.fill();

        context.lineWidth = 2;
        context.strokeStyle = '#000000';
        context.stroke();
        context.closePath();
        context.font = 40*scale + 'pt Kremlin Pro Web';
        context.fillStyle = '#000000';
        context.fillText('Start', (1540/2-100)*scale + 200*scale / 5, (963/2-50)*scale + 64*scale);
    }

    window.requestAnimationFrame(draw);
}

init();
