const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const genres = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const data = [];

  try {
    const resp = await gotScraping.get(`${SRC_BASE_URL}/home`);
    const $ = load(resp.body);

    $("#main-sidebar section:nth-child(1) .block_area-content ul li").each(
      function () {
        data.push({
          id: $(this).find("a").attr("href").split("/")[2],
          genre: $(this).find("a").text(),
        });
      }
    );

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { genres };
