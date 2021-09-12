exports.getTempHumidity = (req, res, next) => {
  let ping = req.body.ping;
  let sensor = require("node-dht-sensor");
  if (ping === true) {
  let tempHumidity = [];
    sensor
      .read(22, 13, function (error, temperature, humidity) {
        if (!error) {
          console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
          tempHumidity = [temperature, humidity];
          return res.status(200).json(tempHumidity)
        } else {
          console.log("oupsy, le capteur est Broken Cheh !" + tempHumidity);
          error = "Avez-vous bien branché votre Capteur ? "
          return res.status(500).json(error)
        }
      })
  } else {
      console.log("next")
    next();
  }
};
