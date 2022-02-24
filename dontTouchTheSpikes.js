const canvas = document.getElementById("gamecanvas");
const ctx = canvas.getContext("2d");
let frames = 0;

const scoreImage = new Image();
scoreImage.src = "img/points.png";
const topSpikes = new Image();
topSpikes.src = "img/spikes.png"

const birdImage1 = new Image();
birdImage1.src = "img/bird1.png";
const birdImage2 = new Image();
birdImage2.src = "img/bird2.png";

const candyImage = new Image();
candyImage.src = "img/candy.png"
const dttsString = new Image();
dttsString.src = "img/dttsString.png";
const StringBEST = new Image();
StringBEST.src = "img/StringBEST.png";

const spikeImage = new Image();
spikeImage.src = "img/spike.png";

const hitString = new Image();
hitString.src = "img/HitString.png";

const flapSound = new Audio();
flapSound.src = "sounds/flap.wav";

const spikesSound = new Audio();
spikesSound.src = "sounds/spikes.wav";

const loseSound = new Audio();
loseSound.src = "sounds/lose1.wav";


const spike = {
    w: 69,
    h: 116,
    leftX: 0,
    temoLeft: 0,
    tempRight: canvas.width,
    leftY: 60, //60 min 320 max
    positions: [],
    numberOfSpikes : 3,
    startLeftX : -20,

    update : function(){
        this.temoLeft=0;
        this.tempRight = canvas.width;
        this.positions = [];
        spikesSound.play();
        for(let i = 0 ; i < this.numberOfSpikes ; i ++){
            let x = Math.floor(Math.random()*320) + 60;

            if(i != 0)
                if(Math.sqrt( Math.pow(this.positions[i-1],2) - Math.pow(x,2)) < 116/3.35 )
                    x = this.positions[i-1] + this.h/3.35;
            this.positions.push(x);
        }

    },

    draw : function(){
       for(let i = 0 ; i < this.numberOfSpikes ; i++){
           let p = this.positions[i];

            if(bird.direction == directoins.right){  
                if(this.tempRight != canvas.width-22)
                    this.tempRight-= 0.5;
                ctx.drawImage(spikeImage,0,0,this.w,this.h,this.tempRight,this.positions[i],this.w/3.35, this.h/3.35);
            }
            else if(bird.direction == directoins.left){
                if(this.temoLeft != -22)
                    this.temoLeft-=0.5;
                ctx.save();
                ctx.translate(this.leftX,this.positions[i]);
                ctx.scale(-1,1);
                ctx.drawImage(spikeImage,0,0,this.w,this.h,this.temoLeft,0,this.w/3.35, this.h/3.35);
                ctx.restore();
            }
        }
    }

}

const candy = {
    w : 119,
    h : 70,
    x : canvas.width/2 - 45,
    y : canvas.height/2 + 30,
    endX : canvas.width/2 - 45,
    endY : canvas.height/2 + 30,



    draw : function(){
        ctx.drawImage(candyImage,0,0,this.w,this.h,this.x,this.y,this.w/3.35, this.h/3.35);
    },

    gameOverDraw : function(){
        ctx.fillStyle = "#ff8207";
        ctx.lineWidth = 5;
        ctx.font = "bold 30px Teko";

        if(bird.score < 10) 
            ctx.fillText(bird.candyScore, this.endX+45, this.endY+23+45);
        else if(bird.score >= 100)
         ctx.fillText(bird.candyScore, this.endX+45-20, this.endY+23+45);
        else if(bird.score >= 10)
            ctx.fillText(bird.candyScore, this.endX+45-10, this.endY+23+45);

        ctx.drawImage(candyImage,0,0,this.w,this.h,this.endX,this.endY+50,this.w/3.5, this.h/3.5);

    }
}

const spikes = {
    w:1080,
    h:218,
    topX: 0,
    topY: 0,
    botX: 1080/3.35,
    botY:canvas.height-70,
    draw : function(){
        ctx.drawImage(topSpikes,0,0,this.w,this.h,this.topX,this.topY,this.w/3.35, this.h/3.35);
        ctx.save();
        ctx.translate(0,0);
        ctx.rotate(180*Math.PI/180);
        ctx.drawImage(topSpikes,0,0,this.w,this.h,-this.botX,-this.botY,this.w/3.35, this.h/3.35);
        ctx.restore();
    }
}

const directoins = {
    stop : 0,
    left : 1,
    right : 2,
}

const bird = {
    frames : 0,
    animation : [],

    w:156,
    h:101,
    x: canvas.width/2 - 20,
    y: canvas.height/2 - 50,
    score: 0,
    bestScore: 0,
    gamesPlayed: 0,
    candyScore: 0,
    speed: 0,
    jump: 3.5,
    gravity: 0.1,
    dx: 3,
    gora : 1,
    currentImage : birdImage2,
    direction: directoins.right,

    temp : function(k){
        switch (k) {
            case 87:
                 this.y-= 5;
                break;
            case 65:
                 this.x-= 5;
                break;
            case 68:
                 this.x+= 5;
                break;
            case 83:
                 this.y+=5;
                break;
            default:
                break;
           
        }
    },

    flap : function(){
        this.speed = 0;
        this.speed += this.jump;
        this.currentImage = birdImage2;
        //console.log(this.speed);
    },

    birdStartScreen : function(){
        
        this.y += (this.gora == 1) ? 0.38 : -0.38;
        if(this.gora)
            if(Math.floor(this.y) >= canvas.height/2 - 50+10){
                this.gora = -1;
                this.currentImage = birdImage2;
            }
        else
            if(this.y <= canvas.height/2 - 50-10){
                this.gora = 1;
                this.currentImage = birdImage1;
            }
    },

    drawHitbox : function(p){
        ctx.fillStyle = "red";
     
        ctx.fillRect(0,p+spike.h/3.35,4,-4);
        ctx.fillRect(0,p,4,4);
        ctx.fillRect(0 + spike.w/3.35,p+spike.h/3.35/2,4,-4);

        ctx.fillRect(canvas.width,p+spike.h/3.35,4,-4);
        ctx.fillRect(canvas.width,p,4,4);
        ctx.fillRect(canvas.width + spike.w/3.35,p+spike.h/3.35/2,4,-4);

        ctx.fillStyle = "green";

        ctx.fillRect(bird.x+bird.w/3.35-11,bird.y,4,4);
        ctx.fillRect(bird.x+bird.w/3.35-11,bird.y+bird.h/3.35,4,-4);
        ctx.fillRect(bird.x+6,bird.y+bird.h/3.35,4,-4);
        ctx.fillRect(bird.x+6,bird.y,4,4);

    },

    didCollideWithSpike : function(p){
        //kolizja z bocznymi
        /*  
        if(bird.direction == directoins.left)
                if(bird.x <= spike.w/3.35-10 && bird.y >= p && bird.y <= p + spike.h/3.35)
                    return true;
            
            if(bird.direction == directoins.right)
                if(bird.x >= canvas.width - (spike.w-10) && bird.y >= p && bird.y <= p + spike.h/3.35)
                    return true;
        */
            
        //kolizja gora dol
            if(bird.y+8 < spikes.topY+spikes.h/3.35)
                return true;
            if(bird.y+27 > spikes.botY-spikes.h/3.35)
                return true;

       
       // this.drawHitbox(p);

        if(this.direction == directoins.right){
            var x1 = canvas.width;
            var y1 = p+spike.h/3.35;
            var x2 = canvas.width;
            var y2 = p;
            var x3 = canvas.width- spike.w/3.35;
            var y3 = p+spike.h/3.35/2;
         }
         if(this.direction == directoins.left){
            var x1 = 0;
            var y1 = p+spike.h/3.35;
            var x2 = 0
            var y2 = p;
            var x3 = 0 + spike.w/3.35;
            var y3 = p + spike.h/3.35/2;
        }

        for(let i = 0 ; i < bird.h/3.35;i++ ){
            if(this.direction == directoins.right)
                if(this.isInTriangle(bird.x+bird.w/3.35-11,bird.y+i,x1,y1,x2,y2,x3,y3))
                    return true;
            
           if(this.direction == directoins.left)
                if(this.isInTriangle(bird.x+6,bird.y+i,x1,y1,x2,y2,x3,y3))
                    return true;         
    
        }
    },

    area : function(x1,y1,x2,y2,x3,y3){
        return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
    },
    
    isInTriangle : function(pX,pY,x1,y1,x2,y2,x3,y3){
    
        let A = this.area (x1, y1, x2, y2, x3, y3);
        let A1 = this.area (pX, pY, x2, y2, x3, y3);     
        let A2 = this.area (x1, y1, pX, pY, x3, y3);
        let A3 = this.area (x1, y1, x2, y2, pX, pY);         
        return (A == A1 + A2 + A3);
    },

    birdPosition : function(){
        this.speed -= this.gravity;
        this.y -= this.speed;

        if(this.speed <= 0)
            this.currentImage = birdImage1;

        this.x += (this.direction == directoins.right) ? this.dx : -this.dx; 
    },

    checkBirdWithWall : function(){
        if(this.direction == directoins.right)
            if(Math.floor(this.x)  >= 320-Math.floor(this.w/3.35)){
                this.direction = directoins.left;
                this.score++;
                spike.update();

                if(this.score % 5 === 0 && this.score !== 0)
                    spike.numberOfSpikes++;
        }

        if(this.direction == directoins.left)
            if(Math.floor(this.x)  <= 0){
                this.direction = directoins.right;
                this.score++;
                spike.update();
            }

            
    },

    update : function(){

        if(states.current == states.gameOver){
            if(bird.y >= canvas.height){
                bird.y = canvas.height;
                return;
            }
            this.speed-=0.35;
            this.checkBirdWithWall();
            this.birdPosition();
            

            return;
        }

        if(states.current == states.ready)
            this.birdStartScreen();

        else if(states.current == states.game){
            for(let i = 0 ; i < spike.numberOfSpikes; i++)
                if(this.didCollideWithSpike(spike.positions[i])){
                    states.current = states.gameOver;
                    loseSound.play();
                    if(this.score > this.bestScore)
                        this.bestScore = this.score;
                }
           
        this.birdPosition();
        this.checkBirdWithWall();
        }
    },

    draw : function(){   
        if(this.direction == directoins.right)
            ctx.drawImage(this.currentImage,0,0,this.w,this.h,this.x,this.y,this.w/3.35, this.h/3.35);
        else if(this.direction == directoins.left){
            ctx.save();
            ctx.translate(this.x,this.y);
            ctx.scale(-1,1);
            ctx.drawImage(this.currentImage,0,0,this.w,this.h,0-45,0,this.w/3.35, this.h/3.35);
            ctx.restore();
        }

    }
}

const scoreMsg = {
    h: 520,
    w: 824,
    x: canvas.width/2-(412/4),
    y: canvas.height/2-(275/2),


    draw : function(){
        ctx.drawImage(scoreImage,0,0,this.w,this.h+50,this.x,this.y,this.w/4, this.h/4);
        
        //zdobyte punkty
        ctx.fillStyle = "white";
        ctx.lineWidth = 5;
        ctx.font = "bold 40px Teko";

        if(bird.score < 10) 
            ctx.fillText(bird.score, canvas.width/2-10, canvas.height/2-100);
        else if(bird.score >= 100)
            ctx.fillText(bird.score, canvas.width/2-30, canvas.height/2-100);
        else if(bird.score >= 10)
            ctx.fillText(bird.score, canvas.width/2-20, canvas.height/2-100);

    }
}

const states = {
    current: 1,
    ready: 1,
    game: 2,
    gameOver: 3,
}

function gameStates(){
    switch (states.current) {
        case states.ready:
            states.current = states.game;
            bird.gamesPlayed++;
            spike.update();
            break;
        case states.game:
            bird.flap();
            flapSound.play();
            break;
        case states.gameOver:        

            states.current = states.ready;
            bird.score = 0;
            bird.speed = 0;
            bird.x =  canvas.width/2 - 20;
            bird.y =  canvas.height/2 - 50;
            bird.direction = directoins.right;
            spike.positions = [];
            spike.numberOfSpikes = 3;
         break;
    }
}



document.addEventListener("click", function(e){
    gameStates();
});

function drawTopAndBot(){
    ctx.fillStyle = '#808080';
    let height = 70;
    ctx.fillRect(0,canvas.height-height,canvas.width,height );

}

function drawTriangle(){
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(75,50);
    ctx.lineTo(100,75);
    ctx.lineTo(100,25);
    ctx.fill();
}

function drawCircle(){

    let circle = new Path2D();  
    circle.arc(canvas.width/2, canvas.height/2-40, 65, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill(circle); 
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.stroke(circle);  

    ctx.fillStyle = "#ebebeb";
    ctx.lineWidth = 5;
    ctx.font = "bold 60px Teko";

    if(bird.score < 10)
        ctx.fillText(bird.score, canvas.width/2-15, canvas.height/2-20);
    else if(bird.score >= 100)
        ctx.fillText(bird.score, canvas.width/2-45, canvas.height/2-20);
    else if(bird.score >= 10)
        ctx.fillText(bird.score, canvas.width/2-30, canvas.height/2-20);
}

function drawStart(){
    if(states.current == states.ready){
        let topX = 873;
        let topY = 240;
        ctx.font = "bold 25px Teko";
        let botX = 614;
        let botY = 155;


        ctx.drawImage(dttsString,0,0,topX,topY,30,70,topX/3.35, topY/3.35);
        ctx.drawImage(StringBEST,0,0,botX,botY,70,290,botX/3.35, botY/3.35);
        ctx.drawImage(hitString,0,0,111,57,105,150,111, 57);

        ctx.fillText(bird.bestScore, 237, 310);
        ctx.fillText(bird.gamesPlayed, 257, 337);


    }
}

function draw(){
    ctx.fillStyle = "#ebebeb";
    ctx.fillRect(0,0,canvas.width, canvas.height);
   
    drawCircle();
    
    drawTopAndBot();
    drawStart();
    spikes.draw();
    spike.draw(); 
    bird.draw();
    if(states.current == states.game){
   
   }
     if(states.current == states.gameOver){
      
        //candy.gameOverDraw();
        scoreMsg.draw();
        let botX = 614;
        let botY = 155;
        ctx.font = "bold 25px Teko";
        ctx.fillStyle = "#808080";

        ctx.drawImage(StringBEST,0,0,botX,botY,70,290,botX/3.35, botY/3.35);
        ctx.fillText(bird.bestScore, 237, 310);
        ctx.fillText(bird.gamesPlayed, 257, 337);
     }
}

function update(){
    bird.update();
    
    window.onkeydown = function(event) {
        var k = event.which || event.keyCode;  // This adds compatibilty across all browsers
        if(k === 32)
            gameStates();
    }

}

function loop(){
    draw();
    update();
    frames++;
    requestAnimationFrame(loop);
}

loop();