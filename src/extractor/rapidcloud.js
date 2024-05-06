const axios = require("axios");
const CryptoJS = require("crypto-js");

async function RapidCloud(videoUrl) {
  const serverName = "RapidCloud";
  const sources = [];

  const fallbackKey = "c1d17096f2ca11b7";
  const host = "https://rapid-cloud.co";

  const result = {
    sources: [],
    subtitles: [],
  };

  try {
    const id = videoUrl.href.split("/").pop()?.split("?")[0];
    const options = {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    };

    let res = null;

    res = await axios.get(
      `https://${videoUrl.hostname}/embed-2/ajax/e-1/getSources?id=${id}`,
      options
    );

    let {
      data: { sources, tracks, intro, outro, encrypted },
    } = res;

    let decryptKey = await (
      await axios.get("https://raw.githubusercontent.com/cinemaxhq/keys/e1/key")
    ).data;

    decryptKey = substringBefore(
      substringAfter(decryptKey, '"blob-code blob-code-inner js-file-line">'),
      "</td>"
    );

    if (!decryptKey) {
      decryptKey = await (
        await axios.get(
          "https://raw.githubusercontent.com/cinemaxhq/keys/e1/key"
        )
      ).data;
    }

    if (!decryptKey) decryptKey = fallbackKey;

    try {
      if (encrypted) {
        const sourcesArray = sources.split("");

        let extractedKey = "";
        let currentIndex = 0;

        for (const index of decryptKey) {
          const start = index[0] + currentIndex;
          const end = start + index[1];

          for (let i = start; i < end; i++) {
            extractedKey += res.data.sources[i];
            sourcesArray[i] = "";
          }
          currentIndex += index[1];
        }

        decryptKey = extractedKey;
        sources = sourcesArray.join("");

        const decrypt = CryptoJS.AES.decrypt(sources, decryptKey);
        sources = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
      }
    } catch (error) {
      throw new Error(error.message);
    }

    sources = sources?.map((s) => ({
      url: s.file,
      isM3U8: s.file.includes(".m3u8"),
    }));

    result.sources.push(...this.sources);

    return sources;
  } catch (error) {
    throw new Error(error.message);
  }
}

function substringAfter(str, toFind) {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(index + toFind.length);
}

function substringBefore(str, toFind) {
  const index = str.indexOf(toFind);
  return index == -1 ? "" : str.substring(0, index);
}

module.exports = RapidCloud;
