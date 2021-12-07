mongoose = require("mongoose");

const { isAlpha, isURL } = require("validator");

const cryptoSchema = new mongoose.Schema(
  {
    cmcId: {
      type: Number,
    },
    name: {
      type: String,
      validate: [isAlpha, "Letters Only"],
    },
    symbol: {
      type: String,
    },

    category: {
      type: String,
    },
    slug: {
      type: String,
    },
    logo: {
      type: String,
      validate: [isURL, "Logo Img Src URL incorrectly formatted"],
    },
    subreddit: {
      type: String,
    },
    tags: {
      type: Array,
    },
    tagNames: {
      type: Array,
    },
    urls: {
      website: {
        type: Array,
      },
      twitter: {
        type: Array,
      },
      message_board: {
        type: Array,
      },
      chat: {
        type: Array,
      },
      facebook: {
        type: Array,
      },
      explorer: {
        type: Array,
      },
      reddit: {
        type: Array,
      },
      technical_doc: {
        type: Array,
      },
      source_code: {
        type: Array,
      },
      announcement: {
        type: Array,
      },
    },

    platform: { type: Array },
    date_added: { type: Date },
    twitter_username: { type: String },
    date_launched: { type: Date },
    contract_address: { type: Array },

    priceCurrent: {
      type: Number,
    },
    website: {
      type: String,
      validate: [isURL, "Website URL incorrectly formatted"],
    },
    usersFavored: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],
    usersUnfavored: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
    ],

    programsAffiliated: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "cryptoProgram",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("crypto", cryptoSchema);
