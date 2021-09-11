var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
// var LED = new Gpio(27, 'out'); //use GPIO pin 4, and specify that it is output
// var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms


var lampe = new Gpio(27, 'both'); //use GPIO pin 4, and specify that it is output


function lampeOnOff() {
  let verif = lampe.readSync()
  switch (verif) {
    case 0:
      lampe.writeSync(1);
      console.log("Lampe On")
      break;
    case 1:
      lampe.writeSync(0);
      console.log("Lampe Off")
      break;
      default : 
      console.log("Je ne trouve pas la lampe")
  }

}
console.log('maintenant je suis prêt à lancer lampeOnOff')

lampeOnOff()
