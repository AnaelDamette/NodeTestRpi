exports.getTempHumidity = (req, res, next) => {
  let ping = req.body.ping;
  let sensor = require("node-dht-sensor");
  if (ping === true) {
    sensor
      .read(22, 13, function (error, temperature, humidity) {
        if (!error) {
          console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
          tempHumidity = [temperature, humidity];
        } else {
          console.log("oupsy, le capteur est Broken Cheh !" + tempHumidity);
        }
      })
      .then((tempHumidity) => res.status(200).json(tempHumidity))
      .catch((error) => res.status(500).json(error));
  } else {
      console.log("next")
    next();
  }
};
