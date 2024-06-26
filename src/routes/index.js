const { Router } = require("express");
const { episodeSrcs } = require("../controllers/episode-srcs");
const { spotlightAnime } = require("../controllers/spotlight-anime");
const { trendingAnime } = require("../controllers/trending-anime");
const { category } = require("../controllers/category");
const { top10 } = require("../controllers/top-10-anime");
const { genres } = require("../controllers/genres");
const { info } = require("../controllers/info");
const { episodes } = require("../controllers/episodes");
const { seasons } = require("../controllers/seasons");
const { search } = require("../controllers/search");
const { azList } = require("../controllers/az-list");
const { producers } = require("../controllers/producer");
const { episodeServers } = require("../controllers/episode-servers");

const router = Router();

router.get("/spotlight", spotlightAnime);

router.get("/trending", trendingAnime);

router.get("/top-10", top10);

router.get("/genres", genres);

router.get("/search", search);

router.get("/az-list/:letter", azList);

router.get("/producers/:producer", producers);

// top-airing -- most-popular -- most-favorite -- completed -- recently-updated -- recently-added -- top-upcoming
router.get("/category/:type", category);

router.get("/seasons/:infoId", seasons);

router.get("/info/:infoId", info);

router.get("/episodes/:infoId", episodes);

router.get("/episode-servers", episodeServers);

router.get("/episode-srcs", episodeSrcs);

module.exports = router;
