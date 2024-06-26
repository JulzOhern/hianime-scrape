const { load } = require("cheerio");
const {
  ACCEPT_ENCODING_HEADER,
  ACCEPT_HEADER,
  SRC_AJAX_URL,
  SRC_BASE_URL,
  USER_AGENT_HEADER,
} = require("../utils/constants");
const axios = require("axios");

const episodes = async (req, res) => {
  const { infoId } = req.params;
  const data = {
    totalEpisodes: 0,
    episodes: [],
  };

  try {
    const resp = await axios.get(
      `${SRC_AJAX_URL}/v2/episode/list/${infoId.split("-").pop()}`,
      {
        headers: {
          Accept: ACCEPT_HEADER,
          "User-Agent": USER_AGENT_HEADER,
          "X-Requested-With": "XMLHttpRequest",
          "Accept-Encoding": ACCEPT_ENCODING_HEADER,
          Referer: `${SRC_BASE_URL}/watch/${infoId}`,
        },
      }
    );
    const $ = load(resp.data.html);

    data.totalEpisodes = Number($(".detail-infor-content .ss-list a").length);

    $(".detail-infor-content .ss-list a").each((i, el) => {
      data.episodes.push({
        title: $(el)?.attr("title")?.trim() || null,
        episodeId: $(el)?.attr("href")?.split("/")?.pop() || null,
        number: Number($(el).attr("data-number")),
        isFiller: $(el).hasClass("ssl-item-filler"),
      });
    });

    return res.send(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { episodes };
