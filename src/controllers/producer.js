const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const producers = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const { producer } = req.params;
  const { page } = req.query;

  const data = [];

  try {
    const resp = await gotScraping.get(
      `${SRC_BASE_URL}/producer/${producer}?page=${page}`
    );
    const $ = load(resp.body);

    $("#main-content .tab-content .film_list-wrap .flw-item").each(function () {
      data.push({
        id: $(this).find("a").attr("href").replace("/", ""),
        img: $(this).find("img").attr("data-src"),
        name: $(this).find(".film-detail .film-name").text(),
        jname: $(this).find(".film-detail .film-name a").attr("data-jname"),
        description:
          $(this).find(".film-detail .description").text().trim() || null,
        type: $(this).find(".film-detail .fd-infor span:nth-child(1)").text(),
        duration: $(this).find(".film-detail .fd-infor .fdi-duration").text(),
        sub: $(this).find(".film-poster .tick-sub").text(),
        dub: $(this).find(".film-poster .tick-dub").text() || null,
        rate: $(this).find(".film-poster .tick-rate").text() || null,
      });
    });

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { producers };
