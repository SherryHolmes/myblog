
function CurentTime() {
  var now = new Date(); 
  var hh = now.getHours();            //时  
  var mm = now.getMinutes();          //分  
  var clock;

  if (hh < 10)
    clock = "0" + hh + ":";
  else 
    clock = hh + ":";
  if (mm < 10) 
    clock += '0';
  clock += mm;
  return (clock);
}
 

$(function() {
  var clock;
  clock = CurentTime();
  $('.current-clock').html(clock);
  var timer = window.setInterval(function(){
    clock = CurentTime();
    $('.current-clock').html(clock);
  }, 1000);

});