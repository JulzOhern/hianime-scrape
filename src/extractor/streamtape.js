const axios = require("axios");
const { load } = require("cheerio");

async function StreamTape(videoUrl) {
  const serverName = "StreamTape";
  const sources = [];

  try {
    const { data } = await axios.get(videoUrl.href).catch(() => {
      throw new Error("Video not found");
    });

    const $ = load(data);

    let [fh, sh] = $.html()
      ?.match(/robotlink'\).innerHTML = (.*)'/)[1]
      .split("+ ('");

    sh = sh.substring(3);
    fh = fh.replace(/\'/g, "");

    const url = `https:${fh}${sh}`;

    sources.push({
      url: url,
      isM3U8: url.includes(".m3u8"),
    });

    return sources;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = StreamTape;
