const { load } = require("cheerio");
const {
  SRC_BASE_URL,
  SRC_AJAX_URL,
  ACCEPT_HEADER,
  USER_AGENT_HEADER,
  ACCEPT_ENCODING_HEADER,
} = require("../utils/constants");
const { default: axios } = require("axios");

let gotScraping;

const episodeServers = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const { episodeId } = req.query;

  const data = {
    sub: [],
    dub: [],
    raw: [],
    episodeId,
    episodeNo: 0,
  };

  try {
    const epId = episodeId.split("?ep=")[1];

    const resp = await axios.get(
      `${SRC_AJAX_URL}/v2/episode/servers?episodeId=${epId}`,
      {
        headers: {
          Accept: ACCEPT_HEADER,
          "User-Agent": USER_AGENT_HEADER,
          "X-Requested-With": "XMLHttpRequest",
          "Accept-Encoding": ACCEPT_ENCODING_HEADER,
          Referer: new URL(`/watch/${episodeId}`, SRC_BASE_URL).href,
        },
      }
    );
    const $ = load(resp.data.html);

    const epNoSelector = ".server-notice strong";
    res.episodeNo = Number($(epNoSelector).text().split(" ").pop()) || 0;

    $(`.ps_-block.ps_-block-sub.servers-sub .ps__-list .server-item`).each(
      (_, el) => {
        data.sub.push({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null,
        });
      }
    );

    $(`.ps_-block.ps_-block-sub.servers-dub .ps__-list .server-item`).each(
      (_, el) => {
        data.dub.push({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null,
        });
      }
    );

    $(`.ps_-block.ps_-block-sub.servers-raw .ps__-list .server-item`).each(
      (_, el) => {
        data.raw.push({
          serverName: $(el).find("a").text().toLowerCase().trim(),
          serverId: Number($(el)?.attr("data-server-id")?.trim()) || null,
        });
      }
    );

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { episodeServers };
