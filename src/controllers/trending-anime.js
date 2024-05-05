import { gotScraping } from "got-scraping";
import { load } from "cheerio";
import { SRC_BASE_URL } from "../utils/constants.js";

export const trendingAnime = async (req, res) => {
  const data = [];

  try {
    const resp = await gotScraping.get(`${SRC_BASE_URL}/home`);
    const $ = load(resp.body);
    console.log(SRC_BASE_URL);

    $("#anime-trending .swiper-container .swiper-wrapper div .item").each(
      function () {
        data.push({
          id: $(this)?.find("a")?.attr("href").replace("/", "") || null,
          img: $(this)?.find("img")?.attr("data-src") || null,
          rank: $(this)?.find(".number span")?.text() || null,
          title: $(this)?.find(".number .film-title")?.text() || null,
        });
      }
    );

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};
