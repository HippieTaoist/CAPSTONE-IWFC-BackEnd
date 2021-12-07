const axios = require("axios");

const AxiosCoinMarketCap = axios.create({
  baseUrl: "https://pro-api.coinmarketcap.com",
  timeout: 10000,
  headers: {
    Accept: "*",
    "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY,
  },
});

module.exports = AxiosCoinMarketCap;
