const pin = 15;
const { DHT } = require("./index");
const dht = new DHT(pin, DHT.DHT11);
let result = dht.read();
if (result) {
  console.log(result);
  console.log("Humidity: " + dht.humidity + " %");
  console.log("Temperature: " + dht.temperature + " C");
} else {
  console.log("Failed to read");
}
