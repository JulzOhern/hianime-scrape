const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const top10 = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const data = {
    today: [],
    week: [],
    month: [],
  };

  try {
    const resp = await gotScraping.get(`${SRC_BASE_URL}/home`);
    const $ = load(resp.body);

    $("#top-viewed-day ul li").each(function () {
      data.today.push({
        id: $(this).find("a").attr("href").replace("/", ""),
        img: $(this).find("img").attr("data-src"),
        title: $(this).find(".film-detail .film-name a").text(),
        sub: $(this).find(".tick-sub").text(),
        dub: $(this).find(".tick-dub").text() || null,
        eps: $(this).find(".tick-eps").text() || null,
      });
    });

    $("#top-viewed-week ul li").each(function () {
      data.week.push({
        id: $(this).find("a").attr("href").replace("/", ""),
        img: $(this).find("img").attr("data-src"),
        title: $(this).find(".film-detail .film-name a").text(),
        sub: $(this).find(".tick-sub").text(),
        dub: $(this).find(".tick-dub").text() || null,
        eps: $(this).find(".tick-eps").text() || null,
      });
    });

    $("#top-viewed-month ul li").each(function () {
      data.month.push({
        id: $(this).find("a").attr("href").replace("/", ""),
        img: $(this).find("img").attr("data-src"),
        title: $(this).find(".film-detail .film-name a").text(),
        sub: $(this).find(".tick-sub").text(),
        dub: $(this).find(".tick-dub").text() || null,
        eps: $(this).find(".tick-eps").text() || null,
      });
    });

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { top10 };
