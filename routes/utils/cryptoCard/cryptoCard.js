const AxiosCoinMarketCap = require("../axios/AxiosCoinMarketCap");
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

      let newCrypto = new Crypto({
        cmcId: id,
        name,
        symbol,
        category,
        logo,
        priceCurrent: 0,
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

  for (const crypto in crypto_USDPriceObject) {
    console.log(`${crypto}: ${crypto_USDPriceObject[crypto]}`);
  }
}

async function cryptoCardInfoUpdater(siteCryptoArray) {
  `/v1/cryptocurrency/info?symbol=${siteCryptoArray}`;
}

module.exports = cryptoCardCreator;
