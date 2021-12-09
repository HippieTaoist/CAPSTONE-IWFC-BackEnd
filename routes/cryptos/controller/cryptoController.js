const Crypto = require("../model/Crypto");

const userDecodeAndFind = require("../../utils/userDecodeAndFind/userDecodeAndFind.js");
const errorHandler = require("../../utils/errorHandler/errorHandler");
const AxiosCoinMarketCap = require("../../utils/axios/AxiosCoinMarketCap.js");
const AxiosKuCoinGetAllPrices_USD = require("../../utils/axios/AxiosKuCoin");
const {
  cryptoCardCreator,
  cryptoCardPriceUpdater,
  cryptoFavor,
} = require("../../utils/cryptoCard/cryptoCard");

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

    let updatePayload = await payload.map(async (crypto) => {
      console.log(crypto.symbol);
      console.log(crypto.priceCurrent);
      let updatedPrice = await cryptoCardPriceUpdater(crypto.symbol);

      console.log("42", updatedPrice.priceCurrent, crypto.priceCurrent);
      return crypto;
    });

    payload = await Crypto.find(
      cryptoToGet
        ? {
            nameSymbol: cryptoToGet.toUpperCase(),
          }
        : {}
    );

    Promise.all(updatePayload).then((value) => {
      console.log("46", value.priceCurrent);
    });
    let crypto_USDPriceArray = await AxiosKuCoinGetAllPrices_USD();

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

  const { nameSymbol } = req.body;

  console.log(req.body);

  // console.log(res.locals.dataDecoded);
  let foundUser = await userDecodeAndFind(res.locals.dataDecoded);
  // console.log(foundUser);
  let cryptoFound = await Crypto.findOne({
    symbol: nameSymbol.toUpperCase(),
  });
  console.log(cryptoFound);
  if (!cryptoFound) {
    const cryptoCreated = await cryptoCardCreator(nameSymbol);

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
  console.log("                cryptoUpdate Called");
  const { _id, favored } = req.body;
  console.log(req.body);
  let userFound = await userDecodeAndFind(res.locals.dataDecoded);
  let cryptoFound = await Crypto.findById(_id);
  console.log(cryptoFound ? "We Found the Crypto" : "Not Crypto Found");
  try {
    if (cryptoFound && userFound) {
      let newPrice = await cryptoCardPriceUpdater(cryptoFound.symbol);
      console.log(newPrice);
      // await cryptoFound.updateOne(
      //   { $set: { priceCurrent: newPrice } },
      //   { new: true }
      //   );
      console.log(
        `${cryptoFound.symbol} has a current price of $${cryptoFound.priceCurrent}`
      );
      await cryptoFavor(userFound, favored, cryptoFound);
      let favoredCrypto = await Crypto.findById(cryptoFound._id);
      console.log(favoredCrypto.usersFavored, "Favored Users");
      console.log(favoredCrypto.usersUnfavored, "Unfavored Users");
      res.json({
        message: "Success",
        payload: favoredCrypto,
      });
    } else
      res.status(404).json({
        message:
          "Issue with finding crypto. Check again or contact support to add new crypto.",
      });
  } catch (error) {
    res.status(500).json({
      message: "Error in Crypto Update",
      error: error.message,
    });
  }
}

async function cryptoDelete(req, res) {
  console.log("                cryptoDelete Called");
  const { _id, userLevel } = req.body;
  try {
    let userFound = await userDecodeAndFind(res.locals.dataDecoded);
    if (userLevel === "Adm!n" && _id) {
      let cryptoDeleted = await Crypto.deleteOne({
        _id: _id,
      });
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
    } else {
      res.json({
        message: "You are not authorized to access this ...",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  cryptosGet,
  cryptoCreate,
  cryptoUpdate,
  cryptoDelete,
};
