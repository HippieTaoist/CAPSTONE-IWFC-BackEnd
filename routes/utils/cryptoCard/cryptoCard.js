const AxiosCoinMarketCap = require("../axios/AxiosCoinMarketCap");
const AxiosKuCoinGetAllPrices_USD = require("../axios/AxiosKuCoin");
const Crypto = require("../../cryptos/model/Crypto");
const axios = require("axios");

async function cryptoCardCreator(cryptoSymbol) {
  console.log("");
  console.log("");
  console.log("                cryptoCardCreator Called");
  console.log("");
  console.log("");

  let uppercaseSymbol = cryptoSymbol.toUpperCase();
  try {
    let foundCrypto = await Crypto.findOne({
      symbol: uppercaseSymbol,
    });

    console.log(foundCrypto);

    if (foundCrypto) {
      return foundCrypto;
    } else {
      let foundCryptoDetails = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${uppercaseSymbol}`,
        {
          headers: {
            Accept: "*",
            "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY,
          },
        }
      );

      console.log(foundCryptoDetails.data.data[uppercaseSymbol]);

      let {
        id,
        name,
        symbol,
        category,
        logo,
        slug,
        logoImgSrc,
        subreddit,
        tags,
        tagNames,
        urls,
      } = foundCryptoDetails.data.data[uppercaseSymbol];

      let currentPrice = await cryptoCardPriceUpdater(uppercaseSymbol);
      console.log("CP", currentPrice);

      let newCrypto = new Crypto({
        cmcId: id,
        name,
        symbol,
        category,
        logo,
        priceCurrent: currentPrice,
        slug,
        logo,
        subreddit,
        tags,
        tagNames,
        urls,
      });
      let cryptoSaved = await newCrypto.save();
      return cryptoSaved;
    }
  } catch (error) {
    console.log(error);
  }
}

async function cryptoCardPriceUpdater(cryptoSymbol) {
  let crypto_USDPriceObject = await AxiosKuCoinGetAllPrices_USD();
  let returnedPrice;
  for (const crypto in crypto_USDPriceObject) {
    // console.log(`${crypto}: ${crypto_USDPriceObject[crypto]}`);
    crypto === cryptoSymbol && (returnedPrice = crypto_USDPriceObject[crypto]);
  }
  console.log(`${cryptoSymbol} has a current price of ${returnedPrice}`);
  return returnedPrice;
}

async function siteCryptoCardInfoUpdater(siteCryptoArray) {
  `/v1/cryptocurrency/info?symbol=${siteCryptoArray}`;
}

module.exports = { cryptoCardCreator, cryptoCardPriceUpdater };
