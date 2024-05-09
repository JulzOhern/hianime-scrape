const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const seasons = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const data = [];

  const { infoId } = req.params;

  try {
    const resp = await gotScraping.get(`${SRC_BASE_URL}/${infoId}`);
    const $ = load(resp.body);

    $("#main-content .os-list a").each(async function () {
      data.push({
        id: $(this).attr("href").replace("/", ""),
        img: $(this)
          .find(".season-poster")
          .attr("style")
          .split(" ")[1]
          .replace("url(", "")
          .replace(");", ""),
        title: $(this).find(".title").text(),
      });
    });

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { seasons };
