const axios = require("axios");

async function AxiosKuCoinGetAllPrices_USD() {
  let crypto = await axios.get("https://api.kucoin.com/api/v1/prices", {
    headers: {
      Accept: "*",
    },
  });
  return crypto.data.data;
}

module.exports = AxiosKuCoinGetAllPrices_USD;
