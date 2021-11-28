const CryptoProgram = require("../model/CryptoProgram");
const Crypto = require("../../cryptos/model/Crypto");
const User = require("../../users/model/User");

const errorHandler = require("../../utils/errorHandler/errorHandler");
const userDecodeAndFind = require("../../utils/userDecodeAndFind/userDecodeAndFind");

async function cryptoQuickAdd(Symbol, userCreating) {
  return new Crypto({
    nameSymbol: Symbol,
    nameCreator: userCreating._id,
  }).save();
}

async function cryptoProgramsGet(req, res) {
  console.log("");
  console.log("");
  console.log("                cryptoProgramsGet Called");
  console.log("");
  console.log("");

  try {
    let cryptoPrograms = await CryptoProgram.find(req.body);

    res.json({
      message: "cryptoProgramsGet has gotten your Crypto Program(s)",
      payload: cryptoPrograms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Trouble retrieving Crypto Programs",
      error: errorHandler(error),
    });
  }
}

async function cryptoProgramCreate(req, res) {
  console.log("");
  console.log("");
  console.log("                cryptoProgramCreate Called");
  console.log("");
  console.log("");

  let userFound = await userDecodeAndFind(res.locals.dataDecoded);

  const {
    name,
    description,
    url,
    urlSiteRef,
    urlLogo,
    type,
    earnOpportunities: {
      rewardDaily,
      rewardHourly,
      rewardBonus,
      offerWalls,
      promotions,
    },
    withdrawalOptions,
    withdrawalMinAmount,
    withdrawalFrequency,
    withdrawalWallets,
    access,
    developer,
    cryptosAffiliated,
  } = req.body;

  let newCryptosAffiliated = await cryptosAffiliated.map(async (crypto) => {
    let cryptoFound = await Crypto.findOne({
      nameSymbol: crypto,
    });
    if (!cryptoFound) {
      cryptoFound = await cryptoQuickAdd(crypto, userFound);
    }
    return cryptoFound._id;
  });
  let cryptosAffiliatedTransArray = await Promise.all(newCryptosAffiliated);
  console.log(cryptosAffiliatedTransArray);

  let programFound = await CryptoProgram.findOne({
    name: name,
  });

  if (!programFound) {
    const cryptoProgramCreate = new CryptoProgram({
      name,
      description,
      developer,
      url,
      urlSiteRef,
      urlLogo,
      type,
      cryptosAffiliated: cryptosAffiliatedTransArray,
      earnOpportunities: {
        rewardDaily,
        rewardHourly,
        rewardBonus,
        offerWalls,
        promotions,
      },
      withdrawalOptions,
      withdrawalMinAmount,
      withdrawalFrequency,
      withdrawalWallets,
      access,
      nameCreator: userFound._id,
      usersFavored: userFound._id,
    });
    let programSaved = await cryptoProgramCreate.save();
    console.log(cryptoProgramCreate);

    CryptoProgram.findOneAndUpdate(
      {
        _id: programSaved._id,
      },
      {
        $set: {
          usersFavored: userFound._id,
        },
      }
    );

    let payload = await CryptoProgram.findOne({
      _id: programSaved._id,
    });

    res.json({
      message: "Success in Program Creation",
      payload: payload,
    });
  } else {
    res.json({
      message: "Program already implemented on site. Try another.",
    });
  }
}

async function cryptoProgramUpdate(req, res) {
  console.log("                cryptoProgramUpdate Called");

  let userFound = await userDecodeAndFind(res.locals.dataDecoded);

  const {
    _id,
    name,
    description,
    url,
    urlSiteRef,
    urlLogo,
    type,
    earnOpportunities,
    earnOpportunities: {
      rewardDaily,
      rewardHourly,
      rewardBonus,
      offerWalls,
      promotions,
    },
    withdrawalOptions,
    withdrawalMinAmount,
    withdrawalFrequency,
    withdrawalWallets,
    access,
    developer,
    cryptosAffiliated,
  } = req.body;

  if (cryptosAffiliated) {
    cryptosAffiliated.forEach(async (crypto) => {
      let cryptoFound = await Crypto.findOne({
        nameSymbol: crypto,
      });
      if (!cryptoFound) {
        cryptoFound = await cryptoQuickAdd(crypto, userFound);
      }
      await CryptoProgram.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          $addToSet: {
            cryptosAffiliated: cryptoFound._id,
          },
        },
        { new: true }
      ).exec();
    });
  }
  //   console.log(req.body.earnOpportunities);
  console.log(rewardDaily);
  console.log(rewardBonus);

  // const {
  //     rewardDaily,
  //     rewardBonus,
  //     rewardHourly,
  //     promotions
  // } = req.body.earnOpportunities

  //////////Work on this in future
  // if (promotions) {
  //   console.log("Promotions: ", promotions);

  //   await CryptoProgram.findOneAndUpdate(
  //     {
  //       _id: _id,
  //     },
  //     {
  //       $addToSet: {
  //         promotions: promotions,
  //       },
  //     },
  //     { new: true }
  //   ).exec();

  //   let theOne = await CryptoProgram.findById(_id);
  //   console.log();
  //   res.json({
  //     message: "Good Updating",
  //     payload: theOne,
  //   });
  // }
}

async function cryptoProgramDelete(req, res) {
  // Only Avail on admin level or under specific parameters.
  console.log("                cryptoProgramDelete Called");

  let userFound = await userDecodeAndFind(res.locals.dataDecoded);

  console.log(userFound);
  res.json({ message: "GoodDeletin", payload: userFound });
}

module.exports = {
  cryptoProgramsGet,
  cryptoProgramCreate,
  cryptoProgramUpdate,
  cryptoProgramDelete,
};
