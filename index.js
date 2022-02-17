class DHT {
  constructor(pin, type) {
    this.pin = pin;
    this.type = DHT.DHT11;
    if (type) {
      this.type = type;
    }
    this.humidity = -1;
    this.temperature = -1;
  }

  trim(bits) {
    if (bits) {
      // trim first ack signals
      while (bits[0] > 60 || bits[0] < 40) {
        bits.shift();
      }
      // trim unnecessary tail signals
      while (bits.length > 80) {
        bits.pop();
      }
    }
  }

  toBytes(bits) {
    var bytes = [0, 0, 0, 0, 0];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 8; j++) {
        if (bits[(i * 8 + j) * 2] > 40 && bits[(i * 8 + j) * 2] < 60) {
          if (bits[(i * 8 + j) * 2 + 1] > 50) {
            bytes[i] = bytes[i] | (1 << (7 - j));
          }
        }
      }
    }
    return bytes;
  }

  checksum(bytes) {
    return ((bytes[0] + bytes[1] + bytes[2] + bytes[3]) & 0xff) === bytes[4];
  }

  decode(bytes, type) {
    if (this.checksum(bytes) === true) {
      var data = [-1, -1];
      if (type === DHT.DHT11) {
        data[0] = bytes[0] + bytes[1] * 0.1;
        if ((bytes[3] & 0x80) === 0x80) {
          data[1] = -1 - bytes[2] + (bytes[3] & 0x0f) * 0.1;
        } else {
          data[1] = bytes[2] + (bytes[3] & 0x0f) * 0.1;
        }
      } else if (type === DHT.DHT12) {
        data[0] = bytes[0] + bytes[1] * 0.1;
        data[1] = (bytes[2] & 0x7f) + (bytes[3] & 0x0f) * 0.1;
        if ((bytes[3] & 0x80) === 0x80) {
          data[1] *= -1;
        }
      } else {
        // DHT21, DHT22
        data[0] = ((bytes[0] << 8) | bytes[1]) * 0.1;
        if ((bytes[2] & 0x80) === 0x80) {
          data[1] = (((bytes[2] & 0x7f) << 8) | bytes[3]) * -0.1;
        } else {
          data[1] = (((bytes[2] & 0x7f) << 8) | bytes[3]) * 0.1;
        }
      }
      return data;
    }
    return null;
  }

  read() {
    var bits = pulseRead(this.pin, 100, {
      timeout: 25000,
      startState: LOW,
      mode: INPUT,
      trigger: {
        startState: HIGH,
        interval: [10000, 18000],
      },
    });
    this.trim(bits);
    if (bits === null || bits.length !== 80) {
      return null;
    }
    // decodes
    var bytes = this.toBytes(bits);
    var data = this.decode(bytes, this.type);
    if (data) {
      this.humidity = data[0];
      this.temperature = data[1];
      return data;
    }
    return null;
  }
}

DHT.DHT11 = 0;
DHT.DHT12 = 1;
DHT.DHT21 = 2;
DHT.DHT22 = 3;

exports.DHT = DHT;
