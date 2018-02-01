var WINDOW_WIDTH;
var WINDOW_HEIGHT;
var RADIUS;
var MARGIN_TOP;
var MARGIN_LEFT ;

var curDate;
var curHour;
var curMinute;
var curSecond;

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){

  //屏幕自适应; 
  WINDOW_WIDTH = 300;
  WINDOW_HEIGHT = 150;
  MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
  MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

  console.log(WINDOW_WIDTH);
  console.log(WINDOW_HEIGHT);
  console.log(MARGIN_LEFT);
  console.log(RADIUS);
  console.log(MARGIN_TOP);


  var canvas = document.getElementById('canvas-clock');
  var context = canvas.getContext("2d");

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;
  curDate = new Date();
  curHour = curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours();
  curMinute = curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes();
  curSecond = curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds();
  setInterval(
    function(){
        render( context );
        update();
    },50
  );
}


function update() {

	var nextDate = new Date();
	var nextHour = nextDate.getHours() < 10 ? "0" + nextDate.getHours() : nextDate.getHours();
	var nextMinute = nextDate.getMinutes() < 10 ? "0" + nextDate.getMinutes() : nextDate.getMinutes();
	var nextSecond = nextDate.getSeconds() < 10 ? "0" + nextDate.getSeconds() : nextDate.getSeconds();
  
  if( nextSecond != curSecond ){
    if( parseInt(curHour/10) != parseInt(nextHour/10) ){
        addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHour/10) );
    }
    if( parseInt(curHour%10) != parseInt(nextHour%10) ){
        addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHour/10) );
    }

    if( parseInt(curMinute/10) != parseInt(nextMinute/10) ){
        addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinute/10) );
    }
    if( parseInt(curMinute%10) != parseInt(nextMinute%10) ){
        addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinute%10) );
    }

    if( parseInt(curSecond/10) != parseInt(nextSecond/10) ){
        addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSecond/10) );
    }
    if( parseInt(curSecond%10) != parseInt(nextSecond%10) ){
        addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSecond%10) );
    }

    curDate = nextDate;
    curHour = nextHour;
    curMinute = nextMinute;
    curSecond = nextSecond;
  }

  updateBalls();
}

function updateBalls(){
  for( var i = 0 ; i < balls.length ; i ++ ){

    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;

    if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
        balls[i].y = WINDOW_HEIGHT-RADIUS;
        balls[i].vy = - balls[i].vy*0.75;
    }
  }

// 优化 使页面上的小球数量少于300个
  var cnt = 0;
  for( var i = 0 ; i < balls.length ; i ++ ){
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
      balls[cnt++] = balls[i];
    }
  }
  while(balls.length > Math.min(300, cnt)) {
    balls.pop();
  }

}

function addBalls( x , y , num ){

  for( var i = 0  ; i < digit[num].length ; i ++ ) 
  {
    for( var j = 0  ; j < digit[num][i].length ; j ++ )
    {
      if( digit[num][i][j] == 1 ){
          var aBall = {
              x:x+j*2*(RADIUS+1)+(RADIUS+1),
              y:y+i*2*(RADIUS+1)+(RADIUS+1),
              g:1.5+Math.random(),
              vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
              vy:-5,
              color: colors[ Math.floor( Math.random()*colors.length ) ]
          }
          balls.push( aBall )
      }    	
    }	
  }
}

function render( cxt ){

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(curHour/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHour%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinute/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinute%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSecond/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(curSecond%10) , cxt);

    for( var i = 0 ; i < balls.length ; i ++ ){
      cxt.fillStyle=balls[i].color;
      cxt.beginPath();
      cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
      cxt.closePath();
      cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){
  cxt.fillStyle = "rgb(222,35,35)";

  for( var i = 0 ; i < digit[num].length ; i ++ ){
    for(var j = 0 ; j < digit[num][i].length ; j ++ ){
        if( digit[num][i][j] == 1 ){
          cxt.beginPath();
          cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
          cxt.closePath();
          cxt.fill();
        }          	
    }
  }
}

