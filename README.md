# DHT

Kaluma library for DHT humidity and temperature sensor

# Wiring

Here is a wiring example for DHT11.

| Raspberry Pi Pico | DHT11 |
| ----------------- | ----- |
| 3V3               | VCC   |
| GND               | GND   |
| GP15              | DATA  |

![wiring](https://github.com/niklauslee/dht/blob/main/images/wiring.jpg?raw=true)

# Install

```sh
npm install https://github.com/niklauslee/dht
```

# Usage

Here is an example code:

```js
const pin = 15;
const {DHT} = require('dht');
const dht = new DHT(pin, DHT.DHT11);
let result = dht.read();
if (result) {
  console.log(result);
  console.log("Humidity: " + dht.humidity + " %");
  console.log("Temperature: " + dht.temperature + " C");
} else {
  console.log('Failed to read');
}
```

# API

## Class: DHT

### new DHT(pin, [type])

- **`pin`** `<number>` : The pin number which connected to the data pin of the DHT sensor.
- **`type`** `<number>`: DHT sensor type, the default is `DHT11` and `DHT12`, `DHT21` and `DHT22` could be used.

### dht.read()

- **Return** `<number[2]>`

It returns humidity and temperature numbers as an array of two numbers or `null` if failed to read data. The first number is humidity (%) and the second is temperature (℃).

### dht.humidity

- `<number>`

The humidity value which is red at the last call of the `dht.read()`. The unit of the humidity is percentage (%).

### dht.temperature

- `<number>`

The temperature value which is red at the last call of the `dht.read()`. The unit of the temperature is degrees celsius (℃). 

## DHT.DHT11

* `<number>` = `0`

## DHT.DHT12

* `<number>` = `1`

## DHT.DHT21

* `<number>` = `2`

## DHT.DHT22

* `<number>` = `3`
