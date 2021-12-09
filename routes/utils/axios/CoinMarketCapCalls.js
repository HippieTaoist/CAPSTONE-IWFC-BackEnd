const axios = require("axios");

async function AxiosCoinMarketCap() {
  let crypto = await AxiosCoinMarketCap.get(
    `/v1/cryptocurrency/info?symbol=${siteCryptoArray}`
  );
  console.log(crypto.data);
}

module.exports = AxiosCoinMarketCap;
