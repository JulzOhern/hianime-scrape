const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const spotlightAnime = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const data = [];

  try {
    const resp = await gotScraping.get(`${SRC_BASE_URL}/home`);
    const $ = load(resp.body);
    console.log(SRC_BASE_URL);

    $("#slider .swiper-wrapper .swiper-slide .deslide-item").each((i, el) => {
      const srcDetail = [];
      $(el)
        .find(".deslide-item-content .sc-detail .scd-item")
        .each(function () {
          srcDetail.push($(this).text().trim() || null);
        });
      data.push({
        id: $(el)?.find("a")?.attr("href").split("/")[2] || null,
        img: $(el)?.find("img")?.attr("data-src") || null,
        rank: i + 1,
        name:
          $(el).find(".deslide-item-content .desi-head-title").text() || null,
        jname:
          $(el)
            .find(".deslide-item-content .desi-head-title")
            .attr("data-jname") || null,
        srcDetail: srcDetail.slice(0, 4),
        sub:
          Number(
            $(el)
              .find(".deslide-item-content .sc-detail .tick div:nth-child(1)")
              .text()
          ) || null,
        dub:
          Number(
            $(el)
              .find(".deslide-item-content .sc-detail .tick div:nth-child(2)")
              .text()
          ) || null,
        eps:
          Number(
            $(el)
              .find(".deslide-item-content .sc-detail .tick div:nth-child(3)")
              .text()
          ) || null,
        description: $(el).find(".desi-description").text().trim(),
      });
    });

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { spotlightAnime };
