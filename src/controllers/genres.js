import { load } from "cheerio";
import { gotScraping } from "got-scraping";
import { SRC_BASE_URL } from "../utils/constants.js";

export const genres = async (req, res) => {
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
