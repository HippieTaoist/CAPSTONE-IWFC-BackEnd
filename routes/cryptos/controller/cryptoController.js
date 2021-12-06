const Crypto = require("../model/Crypto");

const userDecodeAndFind = require("../../utils/userDecodeAndFind/userDecodeAndFind.js");
const errorHandler = require("../../utils/errorHandler/errorHandler");
const AxiosCoinMarketCap = require("../../utils/axios/AxiosCoinMarketCap.js");
const AxiosKuCoinGetAllPrices_USD = require("../../utils/axios/AxiosKuCoin");
const cryptoCardCreator = require("../../utils/cryptoCard/cryptoCard");

async function cryptosGet(req, res) {
  console.log("");
  console.log("");
  console.log("                cryptosGet Called");
  console.log("");
  console.log("");
  let { cryptoToGet } = req.body;

  console.log(cryptoToGet);

  try {
    let payload = await Crypto.find(
      cryptoToGet
        ? {
            nameSymbol: cryptoToGet.toUpperCase(),
          }
        : {}
    );
    //pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=bnb
    console.log(payload);
    console.log(payload.priceCurrent);
    console.log(payload.nameSymbol);

    // let CoinMarketCapAxios = AxiosCoinMarketCap(); // this API works as expected (only 300 calls a day)
    // console.log(CoinMarketCapAxios);
    let crypto_USDPriceArray = await AxiosKuCoinGetAllPrices_USD();

    console.log(crypto_USDPriceArray);

    res.json({
      message: "cryptoGet has gotten your crypto(s)",
      payload: payload,
      pricePayload: crypto_USDPriceArray,
    });
  } catch (error) {
    res.status(500).json({
      message: "Can't get cryptos right now",
      error: errorHandler(error),
    });
  }
}

async function cryptoCreate(req, res) {
  console.log("");
  console.log("");
  console.log("                cryptoCreate Called");
  console.log("");
  console.log("");

  const { logoImgSrc, nameCrypto, nameSymbol, priceCurrent, website } =
    req.body;

  console.log(req.body);

  // console.log(res.locals.dataDecoded);
  let foundUser = await userDecodeAndFind(res.locals.dataDecoded);
  // console.log(foundUser);
  let cryptoFound = await Crypto.findOne({
    nameSymbol: nameSymbol,
  });

  if (!cryptoFound) {
    const cryptoCreated = cryptoCardCreator(nameSymbol);

    res.json({
      message: "Crypto created successfully",
      payload: cryptoCreated,
    });
  } else {
    res.json({
      message: "Crypto Already Exists",
      payload: cryptoFound,
    });
  }
}

async function cryptoUpdate(req, res) {
  console.log("");
  console.log("");
  console.log("                cryptoUpdate Called");
  console.log("");
  console.log("");

  const {
    _id,
    nameCrypto,
    nameSymbol,
    logoImgSrc,
    priceCurrent,
    website,
    userFavored,
    userUnfavored,
  } = req.body;

  console.log(req.body);

  console.log(res.locals.dataDecoded);
  let userFound = await userDecodeAndFind(res.locals.dataDecoded);
  // console.log(userFound);

  let cryptoFound = await Crypto.findById(_id);
  // console.log(cryptoFound);

  try {
    if (cryptoFound && userFound) {
      console.log("We got both parties present cryptoFound and userFound");

      // future place to check on admin level for updating crypto
      // otherwise update priceCurrent, usersFavored, usersUnfavored, usersUnfavored
      if (priceCurrent) {
        console.log(`we have a Current Price of ${priceCurrent}`);

        cryptoFound.priceCurrent.set(priceCurrent);
      }

      // pull from both if double truth comes in.
      if (userFavored && userUnfavored) {
        cryptoFound.usersFavored.pull(userFound);
        cryptoFound.usersUnfavored.pull(userFound);
      } else {
        if (userFavored) {
          cryptoFound.usersFavored.addToSet(userFound);
          cryptoFound.usersUnfavored.pull(userFound);
        }
        if (userUnfavored) {
          cryptoFound.usersUnfavored.addToSet(userFound);
          cryptoFound.usersFavored.pull(userFound);
        }
      }

      let cryptoUpdated = await cryptoFound.save();
      console.log(cryptoUpdated);

      res.json({
        message: "Successfully updated",
        payload: cryptoUpdated,
      });
    } else
      res.status(404).json({
        message: "Issue with findin crypto. Check again or add new crypto.",
      });
  } catch (error) {
    res.status(500).json({
      message: "Error in Crypto Update",
      error: error.message,
    });
  }
}

async function cryptoDelete(req, res) {
  console.log("");
  console.log("");
  console.log("                cryptoDelete Called");
  console.log("");
  console.log("");

  // Only to used on admin level-tested on Thunderclient and all worked 11/21/21
  const { _id } = req.body;
  console.log(req.body);
  console.log(_id);
  console.log(res.locals.dataDecoded);
  let userFound = await userDecodeAndFind(res.locals.dataDecoded);

  console.log(userFound);

  console.log("about to delete crypto");
  let cryptoDeleted = await Crypto.deleteOne({
    _id: _id,
  });

  console.log(cryptoDeleted.deletedCount);

  switch (cryptoDeleted.deletedCount) {
    case 1:
      console.log(`You've deleted ${_id}`);
      res.json({
        message: `Successfully Deleted ${_id}`,
        itemsDeleted: cryptoDeleted.deletedCount,
      });
      break;
    case 0:
      console.log(
        `You have NOT deleted ${_id}, as it is not found. please check Symbol`
      );
      res.status(404).json({
        message: `You have NOT deleted ${_id}, as it is not found. Please check Symbol`,
        itemsDeleted: cryptoDeleted.deletedCount,
      });
      break;
    default:
      console.log("what am i doing here?");
      res.json({
        message: "I should never hit this.",
      });
      break;
  }
}

module.exports = {
  cryptosGet,
  cryptoCreate,
  cryptoUpdate,
  cryptoDelete,
};
