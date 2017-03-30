var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
var width=canvas.width;
var height= canvas.height;
var game;
var colors = {
  blue:"#2B3E50",
  gray:"#546575",
  orange:"#DF691A",
  white:"#EBEBEB"
};
var sources={
  start:"img/click.png",
  again:"img/playagain.png"
};
var sprites = {};
var totalAssets = 0;
var loadedAssets = 0;
var images = [];

var mouseX;	//Mouse Position X coordinate Relative to Canvas
var mouseY;	//Mouse Position Y coordinate Relative to Canvas
var mouseClick = false;	//Mouse is pressed

document.onmousemove= function(mouse){
	var rect = canvas.getBoundingClientRect();
	mouseX= mouse.clientX-rect.left;
	mouseY= mouse.clientY-rect.top;
}
document.onmousedown = function(mouse){
		mouseClick=true;
}
document.onmouseup = function(mouse){
	mouseClick=false;
}



function food(){
  this.gridScale=10;
  this.position={
    x:~~((Math.random()*width)/this.gridScale),
    y: ~~((Math.random()*height)/this.gridScale)
  }
  this.update= function(){

  }
  this.draw = function(){
    ctx.fillStyle=colors.orange;
    ctx.fillRect(this.position.x*this.gridScale, this.position.y*this.gridScale,this.gridScale,this.gridScale);
  }
}

function snake() {
  this.acceptMovement=true;
  this.gridScale =10;
  this.speed ={
    x:0,
    y:1,
  }
  this.position = [
  {
    x:width/(this.gridScale*2),
    y:height/(this.gridScale*2)-5,
  },
  {
    x:(width/(this.gridScale*2)),
    y:height/(this.gridScale*2)-4,
  },
  {
    x:(width/(this.gridScale*2)),
    y:height/(this.gridScale*2)-3,
  },

  ];
  this.update = function(){
    this.position.shift();
    let last= this.position.length-1;
    this.position.push({
      x:this.position[last].x+this.speed.x,
      y:this.position[last].y+this.speed.y});
    this.acceptMovement=true;

  }
  this.getHead = function(){
    let head= this.position.length-1;
    return this.position[head];
  }
  this.changeSpeed = function(x,y){
    if((this.speed.x!=-x && this.speed.y!=-y)&& this.acceptMovement){
      this.speed.x = x;
      this.speed.y = y;
      this.acceptMovement=false;
    }
  }
  this.grow = function(){
    let last= this.position.length-1;
    this.position.push({
      x:this.position[last].x+this.speed.x,
      y:this.position[last].y+this.speed.y});
  }
  this.draw= function(){
    for(i in this.position){
      ctx.fillStyle=colors.white;
      let segment = this.position[i];
      ctx.fillRect(segment.x*this.gridScale, segment.y*this.gridScale,this.gridScale,this.gridScale);
    }
  }
}

function gameInit(){
  this.gridScale=10;
  this.score=0;
  this.timePassed = 0;
  this.lastUpdate = Date.now();
  this.snake = new snake();
  this.food = new food();
  this.GameActive=true;

  this.changeDirection= function(key) {
      switch (key) {
        case 37:
          this.snake.changeSpeed(-1,0);
          break;
        case 38:
          this.snake.changeSpeed(0,-1);
          break;
        case 39:
          this.snake.changeSpeed(1,0);
          break;
        case 40:
          this.snake.changeSpeed(0,1);
          break;
      }
  }
  this.checkFood=function(){
    if (this.snake.getHead().x== this.food.position.x && this.snake.getHead().y== this.food.position.y){
      this.food= new food();
      this.score++;
      this.snake.grow();
    }
  }
  this.checkBite=function(){
    let head = this.snake.getHead();
    let length = this.snake.position.length-1;
    for(let i =0; i<length;i++){
      let body= this.snake.position[i];
      if (head.x == body.x && head.y==body.y){
        return false;
      }
    }
    return true;
  }
  this.checkBorder = function(){
    let head = this.snake.getHead();
    if (head.x < 0 || head.x*this.gridScale>width-this.gridScale){
      return false;
    }
    if (head.y < 0 || head.y*this.gridScale>height-this.gridScale){
      return false;
    }
    return true;
  }

  this.update= function(){
    this.timePassed += (Date.now()-this.lastUpdate);
    this.lastUpdate = Date.now();
    if(this.timePassed>=(1000/12+(this.score*1.5))){
      this.timePassed=0;
      this.snake.update();
      this.checkFood();
      if(this.checkBorder() && this.checkBite()){
        this.GameActive = true;
      }
      else{
        this.GameActive = false;
      }
    }
  }

  this.draw = function(){
    ctx.fillStyle= colors.white;
    ctx.font="20px Georgia";
    ctx.fillText("Score: "+this.score,85,20);
    this.food.draw();
    this.snake.draw();
  }

}

startScreen = function(sprite){
  this.GameActive= false;
  this.sprite = sprite;
  this.click = false;
  this.position = {
    x: width/2-this.sprite.width/2,
    y: height/2-this.sprite.height/2
  }
  this.update = function(){
    let start= this.position;
    let size = {
      x: this.sprite.width,
      y: this.sprite.height
    }
    if((mouseX>= start.x && mouseX < start.x+size.x)&&(mouseY>= start.y && mouseY < start.y+size.y))
    {
      if(!this.click && mouseClick){
        this.click = true;
      }
      else if(this.click && !mouseClick){
      game= new gameInit();
      }
    }
  }
  this.draw = function(){
    ctx.drawImage(this.sprite,this.position.x,this.position.y);
  }
}

NewGame = function(){
  game = new startScreen(sprites.start);
  gameLoop();
}


function gameLoop(){
    if(game.GameActive){
      game.update();
      if(!game.GameActive){
        ctx.fillText("Game Over",70,140);
        game = new startScreen(sprites.again);
      }
      else{
      ctx.clearRect(0,0,width,height);
      game.draw();
      }
    }
    else {
      game.update();
      game.draw();
    }
  setTimeout(function(){
    requestAnimationFrame(gameLoop)
  }, 1000/60);
}
document.onkeydown = function(event) {
  if (event.keyCode>=37 && event.keyCode<=40 && game.GameActive){
    event.preventDefault();
    game.changeDirection(event.keyCode);
  }

}



imageLoader= function(sources){
	for(i  in sources){
		totalAssets++;
		var img = new Image();
		img.src= sources[i];
		sprites[i]=img;
		sprites[i].onload = function(){
			loadedAssets++;
		}
	}
	checkLoad();

}

checkLoad = function(){
	if(loadedAssets==totalAssets){
		NewGame();

	}
	else{
		setTimeout(function() {checkLoad();}, 50);
	}
}


imageLoader(sources);
