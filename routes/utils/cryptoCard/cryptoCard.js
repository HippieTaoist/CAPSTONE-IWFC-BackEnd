const AxiosCoinMarketCap = require("../axios/AxiosCoinMarketCap");
const Crypto = require("../../cryptos/model/Crypto");
const { default: axios } = require("axios");

async function cryptoCardCreator(cryptoSymbol) {
  console.log("");
  console.log("");
  console.log("                cryptoCardCreator Called");
  console.log("");
  console.log("");
  try {
    let foundCrypto = await Crypto.find({
      nameSymbol: cryptoSymbol.toUpperCase(),
    });

    //    baseUrl: "https://pro-api.coinmarketcap.com",
    // timeout: 10000,
    // headers: {
    //   Accept: "*",
    //   "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY,
    // },
    let foundCryptoDetails = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=BTC",
      {
        headers: {
          Accept: "*",
          "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_API_KEY,
        },
      }
    );

    let cryptoData = foundCryptoDetails.data.data[cryptoSymbol];

    for (const crypto in cryptoData.data) {
      console.log(crypto);
    }

    // await AxiosCoinMarketCap.get(
    //   `/v1/cryptocurrency/info?symbol=BTC` //${cryptoSymbol.toUpperCase()}`
    // );

    // console.log(foundCrypto);
    // console.log(foundCryptoDetails);
    console.log(cryptoData);

    if (!foundCrypto) {
      return null;
    } else {
      // console.log(foundCryptoDetails.data);
      console.log(cryptoData);
      const [sentSymbol] = cryptoData;
      console.log(sentSymbol);
      let newCrypto = new Crypto({
        nameCrypto: cryptoData.name,
        nameSymbol: cryptoData.symbol,
        logoImgSrc: cryptoData.logo,
        website,
        priceCurrent,
        nameCreator: [foundUser._id],
        usersFavored: [foundUser._id],
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
