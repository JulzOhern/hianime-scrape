const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const info = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;
  const { infoId } = req.params;
  const data = {
    info: {
      episodeId: infoId,
      img: null,
      name: null,
      jname: null,
      pg: null,
      quality: null,
      sub: null,
      dub: null,
      eps: null,
      type: null,
      duration: null,
      description: null,
    },
    otherInfo: {
      japanese: null,
      synonyms: null,
      aired: null,
      premiered: null,
      duration: null,
      status: null,
      malScore: null,
      genres: [],
      studios: null,
      producers: null,
    },
    charactersAndVoiceActors: [],
    recommendedForYou: [],
  };

  try {
    const resp = await gotScraping.get(`${SRC_BASE_URL}/${infoId}`);
    const $ = load(resp.body);

    const selector = $("#ani_detail .anis-content");

    data.info.img = $(selector)
      .find(".anisc-poster .film-poster img")
      .attr("src");
    data.info.name = $(selector).find(".film-name").text();
    data.info.jname = $(selector).find(".film-name").attr("data-jname");
    data.info.pg = $(selector).find(".film-stats .tick-pg").text();
    data.info.quality = $(selector).find(".film-stats .tick-quality").text();
    data.info.sub = $(selector).find(".film-stats .tick-sub").text();
    data.info.dub = $(selector).find(".film-stats .tick-dub").text();
    data.info.eps = $(selector).find(".film-stats .tick-eps").text() || null;
    data.info.type = $(selector)
      .find(".film-stats .tick span:nth-child(7)")
      .text();
    data.info.duration = $(selector)
      .find(".film-stats .tick span:nth-child(9)")
      .text();
    data.info.description = $(selector)
      .find(".film-description .text")
      .text()
      .trim();
    data.otherInfo.japanese = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(2) .name")
      .text();
    data.otherInfo.synonyms = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(3) .name")
      .text();
    data.otherInfo.aired = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(4) .name")
      .text();
    data.otherInfo.premiered = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(5) .name")
      .text();
    data.otherInfo.duration = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(6) .name")
      .text();
    data.otherInfo.status = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(7) .name")
      .text();
    data.otherInfo.malScore = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(8) .name")
      .text();
    const genres = [];
    $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(9) a")
      .each(function () {
        genres.push({
          id: $(this).attr("href")?.split("/")[2],
          genres: $(this).text(),
        });
      });
    data.otherInfo.genres = genres;
    data.otherInfo.studios = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(10) .name")
      .text();
    data.otherInfo.producers = $(selector)
      .find(".anisc-info-wrap .anisc-info div:nth-child(11) .name")
      .text();

    $("#main-content .block-actors-content div:nth-child(1) .bac-item").each(
      function () {
        data.charactersAndVoiceActors.push({
          character: [
            {
              id: $(this).find(".ltr a").attr("href")?.split("/")[2] || null,
              img: $(this).find(".ltr img").attr("data-src") || null,
              name: $(this).find(".ltr .pi-detail h4").text() || null,
              cast: $(this).find(".ltr .pi-detail span").text() || null,
            },
          ],
          voiceActor: [
            {
              id: $(this).find(".rtl a").attr("href")?.split("/")[2] || null,
              img: $(this).find(".rtl img").attr("data-src") || null,
              name: $(this).find(".rtl .pi-detail h4").text() || null,
              cast: $(this).find(".rtl .pi-detail span").text() || null,
            },
          ],
        });
      }
    );

    $("#main-content .tab-content .film_list-wrap .flw-item").each(function () {
      data.recommendedForYou.push({
        id: $(this).find("a").attr("href")?.split("/")[2],
        img: $(this).find("img").attr("data-src"),
        name: $(this).find(".film-detail .film-name").text(),
        jname: $(this).find(".film-detail .film-name a").attr("data-jname"),
        sub: $(this).find(".tick .tick-sub").text(),
        dub: $(this).find(".tick .tick-dub").text() || null,
        eps: $(this).find(".tick .tick-eps").text() || null,
        type: $(this).find(".fd-infor span:nth-child(1)").text(),
        duration: $(this).find(".fd-infor span:nth-child(3)").text(),
      });
    });

    return res.json(data);
  } catch (error) {
    return res.json(error.message);
  }
};

module.exports = { info };
