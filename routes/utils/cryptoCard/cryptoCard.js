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
    crypto === cryptoSymbol && (returnedPrice = crypto_USDPriceObject[crypto]);
  }
  let foundCrypto = await Crypto.findOne({ symbol: cryptoSymbol });
  if (foundCrypto) {
    let updatedCrypto = await foundCrypto.updateOne(
      { $set: { priceCurrent: returnedPrice } },
      { return: true }
    );
    return updatedCrypto;
  }
  return returnedPrice;
}

async function siteCryptoCardInfoUpdater(siteCryptoArray) {
  `/v1/cryptocurrency/info?symbol=${siteCryptoArray}`;
}

async function cryptoFavor(userFound, favored, cryptoFound) {
  if (favored) {
    await cryptoFound.updateOne(
      {
        $addToSet: { usersFavored: userFound._id },
      },
      { new: true }
    );
    await cryptoFound.updateOne(
      {
        $pull: { usersUnfavored: userFound._id },
      },
      { new: true }
    );
    await cryptoFound.save();

    await userFound.updateOne(
      {
        $addToSet: {
          favoringCryptos: cryptoFound._id,
        },
      },
      { new: true }
    );
    userFound.save();
  } else {
    await cryptoFound.updateOne(
      {
        $addToSet: { usersUnfavored: userFound._id },
      },
      { new: true }
    );
    if (cryptoFound.usersFavored.includes(userFound._id)) {
      await cryptoFound.updateOne(
        {
          $pull: { usersFavored: userFound._id },
        },
        { new: true, upsert: true }
      );
      await cryptoFound.save();
    }
    await userFound.updateOne(
      {
        $pull: {
          favoringCryptos: cryptoFound._id,
        },
      },
      { new: true }
    );
    userFound.save();
  }
}

module.exports = { cryptoCardCreator, cryptoCardPriceUpdater, cryptoFavor };
