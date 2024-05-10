const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const search = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;

  const { keyword, page } = req.query;
  const data = {
    currentPage: page || 1,
    lastPage: null,
    results: [],
  };

  try {
    const resp = await gotScraping.get(
      `${SRC_BASE_URL}/search?keyword=${keyword}&page=${page || 1}`
    );
    const $ = load(resp.body);

    data.lastPage =
      parseInt($("[aria-label='Page navigation'] ul a").last().text()) ||
      parseInt(
        $("[aria-label='Page navigation'] ul a")
          .last()
          .attr("href")
          .split("&page=")[1]
      );

    $("#main-content section .tab-content .film_list-wrap .flw-item").each(
      function () {
        data.results.push({
          id: $(this).find("a").attr("href").split("/")[2],
          img: $(this).find("img").attr("data-src"),
          title: $(this).find(".film-detail .film-name a").text(),
          type: $(this).find(".film-detail .fd-infor span:nth-child(1)").text(),
          duration: $(this).find(".film-detail .fd-infor .fdi-duration").text(),
          sub: $(this).find(".film-poster .tick.ltr .tick-sub").text(),
          dub: $(this).find(".film-poster .tick.ltr .tick-dub").text(),
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

module.exports = { search };
