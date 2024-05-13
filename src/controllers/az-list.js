const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const azList = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;

  const { letter } = req.params;
  const { page } = req.query;
  const data = [];

  try {
    const resp = await gotScraping.get(
      `${SRC_BASE_URL}/az-list/${letter || ""}?page=${page || 1}`
    );
    const $ = load(resp.body);

    $(".tab-content .block_area-content .film_list-wrap .flw-item").each(
      function () {
        data.push({
          id: $(this).find("a").attr("href")?.split("/")[2],
          img: $(this).find("img").attr("data-src"),
          name: $(this).find(".film-detail .film-name").text(),
          jname: $(this).find(".film-detail .film-name a").attr("data-jname"),
          type: $(this).find(".film-detail .fd-infor span:nth-child(1)").text(),
          duration: $(this).find(".film-detail .fd-infor .fdi-duration").text(),
          sub: $(this).find(".film-poster .tick.ltr .tick-sub").text(),
          dub: $(this).find(".film-poster .tick.ltr .tick-sub").text(),
          eps: $(this).find(".film-poster .tick.ltr .tick-eps").text(),
          rate: $(this).find(".film-poster .tick-rate").text(),
        });
      }
    );

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { azList };
