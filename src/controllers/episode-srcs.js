const { load } = require("cheerio");
const {
  SRC_AJAX_URL,
  SRC_BASE_URL,
  USER_AGENT_HEADER,
} = require("../utils/constants");
const { retrieveServerId } = require("../utils/method");
const axios = require("axios");
const MegaCloud = require("../extractor/megacloud");
const StreamSB = require("../extractor/streamsb");
const StreamTape = require("../extractor/streamtape");

const episodeSrcs = async (req, res) => {
  try {
    const { id, server, category } = req.query;

    if (!id || !category) {
      throw new Error("id server and category is required");
    }
    const animeURL = new URL(id?.split("?ep=")[0], SRC_BASE_URL)?.href;

    const [episodeSrcsData, anilist_malId] = await Promise.all([
      scrapeAnimeEpisodeSources(id, server, category),
      axios.get(animeURL, {
        headers: {
          Referer: SRC_BASE_URL,
          "User-Agent": USER_AGENT_HEADER,
          "X-Requested-With": "XMLHttpRequest",
        },
      }),
    ]);

    const $ = load(anilist_malId.data);

    try {
      anilistID = Number(
        JSON.parse($("body")?.find("#syncData")?.text())?.anilist_id
      );
      malID = Number(JSON.parse($("body")?.find("#syncData")?.text())?.mal_id);
    } catch (err) {
      anilistID = null;
      malID = null;
    }

    return res.json({ ...episodeSrcsData, anilistID, malID });
  } catch (error) {
    return res.json(error.message);
  }
};

async function scrapeAnimeEpisodeSources(episodeId, server, category) {
  if (episodeId.startsWith("http")) {
    const serverUrl = new URL(episodeId);
    switch (server) {
      case "vidstreaming":
      case "vidcloud":
        return await MegaCloud(serverUrl);
      case "streamsb":
        return {
          headers: {
            Referer: serverUrl.href,
            watchsb: "streamsb",
            "User-Agent": USER_AGENT_HEADER,
          },
          sources: await StreamSB(serverUrl, true),
        };
      case "streamtape":
        return {
          headers: { Referer: serverUrl.href, "User-Agent": USER_AGENT_HEADER },
          sources: await StreamTape(serverUrl),
        };
    }
  }

  const epId = new URL(`/watch/${episodeId}`, SRC_BASE_URL).href;

  try {
    const resp = await axios.get(
      `${SRC_AJAX_URL}/v2/episode/servers?episodeId=${
        episodeId.split("?ep=")[1]
      }`,
      {
        headers: {
          Referer: epId,
          "User-Agent": USER_AGENT_HEADER,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    const $ = load(resp.data.html);

    let serverId;

    switch (server) {
      case "vidcloud":
        serverId = retrieveServerId($, 1, category);
        if (!serverId) throw new Error("Vidcloud not found");
        break;
      case "vidstreaming":
        serverId = retrieveServerId($, 4, category);
        if (!serverId) throw new Error("Vidstreaming not found");
        break;
      case "streamsb": {
        serverId = retrieveServerId($, 5, category);
        if (!serverId) throw new Error("StreamSB not found");
        break;
      }
      case "streamtape": {
        serverId = retrieveServerId($, 3, category);
        if (!serverId) throw new Error("StreamTape not found");
        break;
      }
    }

    const {
      data: { link },
    } = await axios.get(`${SRC_AJAX_URL}/v2/episode/sources?id=${serverId}`);

    return await scrapeAnimeEpisodeSources(link, server);
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { episodeSrcs };
