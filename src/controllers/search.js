const { load } = require("cheerio");
const { SRC_BASE_URL } = require("../utils/constants");

let gotScraping;

const buildUrl = ({
  baseUrl,
  keyword,
  page = 1,
  type,
  status,
  rated,
  score,
  season,
  language,
  sy,
  sm,
  sd,
  ey,
  em,
  ed,
  sort,
  genres,
}) => {
  const params = new URLSearchParams({
    keyword,
    page,
  });

  if (type) params.append("type", type);
  if (status) params.append("status", status);
  if (rated) params.append("rated", rated);
  if (score) params.append("score", score);
  if (season) params.append("season", season);
  if (language) params.append("language", language);
  if (sy) params.append("sy", sy);
  if (sm) params.append("sm", sm);
  if (sd) params.append("sd", sd);
  if (ey) params.append("ey", ey);
  if (em) params.append("em", em);
  if (ed) params.append("ed", ed);
  if (sort) params.append("sort", sort);
  if (genres) params.append("genres", genres);

  return `${baseUrl}/search?${params.toString()}`;
};

const search = async (req, res) => {
  gotScraping ??= (await import("got-scraping")).gotScraping;

  const {
    keyword,
    page,
    type,
    status,
    rated,
    score,
    season,
    language,
    sy,
    sm,
    sd,
    ey,
    em,
    ed,
    sort,
    genres,
  } = req.query;
  const data = {
    currentPage: page || 1,
    lastPage: null,
    results: [],
  };

  try {
    const url = buildUrl({
      baseUrl: SRC_BASE_URL,
      keyword,
      page,
      type,
      status,
      rated,
      score,
      season,
      language,
      sy,
      sm,
      sd,
      ey,
      em,
      ed,
      sort,
      genres,
    });

    const resp = await gotScraping.get(url);

    const $ = load(resp.body);

    data.lastPage =
      parseInt($("[aria-label='Page navigation'] ul a")?.last()?.text()) ||
      parseInt(
        $("[aria-label='Page navigation'] ul a")
          ?.last()
          ?.attr("href")
          ?.split("&page=")[1]
      ) ||
      1;

    $("#main-content section .tab-content .film_list-wrap .flw-item").each(
      function () {
        data.results.push({
          id: $(this).find("a").attr("href")?.split("/")[2],
          img: $(this).find("img").attr("data-src"),
          name: $(this).find(".film-detail .film-name a").text(),
          jname: $(this).find(".film-detail .film-name a").attr("data-jname"),
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
