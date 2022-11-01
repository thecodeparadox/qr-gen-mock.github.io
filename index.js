const default_qr = 'https://spng.pngfind.com/pngs/s/31-314537_scan-qr-code-comments-scan-qr-code-icon.png';

function mecardFormat(input) {
  input = input.replace(/\\/g, '\\\\');
  input = input.replace(/"/g, '\\"');
  input = input.replace(/;/g, '\\;');
  input = input.replace(/,/g, '\\,');
  input = input.replace(/:/g, '\\:');
  return input;
}

document.addEventListener('alpine:init', () => {
  //
  // URL
  //
  Alpine.data('url', () => ({
    url: '',
    code: '',
    qr_image: default_qr,
    create() {
      const self = this;
      if (!this.url) {
        alert('url required');
        this.qr_image = default_qr;
        return;
      }
      this.code = this.url + '';

      QRCode.toDataURL(
        this.code,
        {
          errorCorrectionLevel: 'H',
          maskPattern: '7',
          type: 'image/jpeg',
          rendererOpts: {
            quality: 1,
          },
        },
        function (err, url) {
          if (err) {
            console.error('SMS QR Generation Error', err);
            return;
          }

          self.qr_image = url;
        },
      );
    },
  }));

  //
  // SMS
  //
  Alpine.data('sms', () => ({
    tel: '',
    text: '',
    code: '',
    qr_image: default_qr,
    create() {
      const self = this;
      if (!this.tel) {
        this.qr_image = default_qr;
        return;
      }
      this.code = `SMSTO:${this.tel}`;
      if (this.text) {
        this.code += `:${this.text}`;
      }

      QRCode.toDataURL(
        this.code,
        {
          errorCorrectionLevel: 'H',
          maskPattern: '7',
          type: 'image/jpeg',
          rendererOpts: {
            quality: 1,
          },
        },
        function (err, url) {
          if (err) {
            console.error('SMS QR Generation Error', err);
            return;
          }

          self.qr_image = url;
        },
      );
    },
  }));

  //
  // Wifi
  //
  Alpine.data('wifi', () => ({
    ssid: '',
    password: '',
    encryption: 'WPA',
    is_hidden: false,
    qr_image: default_qr,
    create() {
      const self = this;

      if (!this.ssid || !this.password) {
        this.qr_image = default_qr;
        alert('ssid and password required');
        return;
      }

      const ssid = mecardFormat(this.ssid);
      const password = mecardFormat(this.password);

      this.code = `WIFI:S:${ssid};P:${password}`;

      if (this.encryption !== '') {
        this.code += `;T:${this.encryption}`;
      }

      if (this.is_hidden) {
        this.code += `;H:${this.is_hidden}`;
      }

      this.code += ';;';

      console.log('hidden', this.is_hidden, this.encryption, this.code);
      QRCode.toDataURL(
        this.code,
        {
          errorCorrectionLevel: 'H',
          maskPattern: '7',
          type: 'image/jpeg',
          rendererOpts: {
            quality: 1,
          },
        },
        function (err, url) {
          if (err) {
            console.error('SMS QR Generation Error', err);
            return;
          }

          self.qr_image = url;
          // console.log('data url', url);
        },
      );
    },
  }));
});
