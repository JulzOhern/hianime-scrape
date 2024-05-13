const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const trendingAnime = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
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
          name: $(this)?.find(".number .film-title")?.text() || null,
          jname: $(this).find(".number .film-title").attr("data-jname"),
        });
      }
    );

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { trendingAnime };
