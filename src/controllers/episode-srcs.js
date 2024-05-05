import { load } from "cheerio";
import {
  SRC_AJAX_URL,
  SRC_BASE_URL,
  USER_AGENT_HEADER,
} from "../utils/constants.js";
import { retrieveServerId } from "../utils/method.js";
import axios from "axios";
import MegaCloud from "../extractor/megacloud.js";
import RapidCloud from "../extractor/rapidcloud.js";
import StreamSB from "../extractor/streamsb.js";
import StreamTape from "../extractor/streamtape.js";
import { Vidcloud } from "../extractor/vidcloud.js";

export const episodeSrcs = async (req, res) => {
  try {
    const { id, server, category } = req.query;

    if (!id || !category) {
      throw new Error("id server and category is required");
    }

    const episodeSrcsData = await scrapeAnimeEpisodeSources(
      id,
      server,
      category
    );

    return res.json(episodeSrcsData);
  } catch (error) {
    return res.json(error.message);
  }
};

async function scrapeAnimeEpisodeSources(episodeId, server, category) {
  if (episodeId.startsWith("http")) {
    const serverUrl = new URL(episodeId);
    switch (server) {
      case "vidstreaming":
        return await MegaCloud(serverUrl);
      case "vidcloud":
        return await MegaCloud(serverUrl, true);
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
