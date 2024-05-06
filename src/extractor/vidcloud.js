const { USER_AGENT_HEADER } = require("../utils/constants.js");
const axios = require("axios");
const CryptoJS = require("crypto-js");

async function Vidcloud(videoUrl, isAlternative = false) {
  const serverName = "VidCloud";
  const sources = [];

  const host = "https://dokicloud.one";
  const host2 = "https://rabbitstream.net";

  const result = {
    sources: [],
    subtitles: [],
  };

  try {
    const id = videoUrl.href.split("/").pop()?.split("?")[0];
    /*  const options = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Referer: videoUrl.href,
        "User-Agent": USER_AGENT_HEADER,
      },
    };

    const res = await axios.get(
      `${isAlternative ? host : host}/ajax/embed-4/getSources?id=${id}`,
      options
    );
 */
    return id;
  } catch (error) {
    throw new Error(error.message);
  }
}

const substringBefore = (str, toFind) => {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(0, index);
};

const substringAfter = (str, toFind) => {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(index + toFind.length);
};

const isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

module.exports = { Vidcloud, substringBefore, substringAfter, isJson };
