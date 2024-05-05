import { Router } from "express";
import { episodeSrcs } from "../controllers/episode-srcs.js";
import { spotlightAnime } from "../controllers/spotlight-anime.js";
import { trendingAnime } from "../controllers/trending-anime.js";
import { category } from "../controllers/category.js";
import { top10 } from "../controllers/top-10-anime.js";
import { genres } from "../controllers/genres.js";
import { info } from "../controllers/info.js";
import { episodes } from "../controllers/episodes.js";

const router = Router();

router.get("/spotlight", spotlightAnime);

router.get("/trending", trendingAnime);

router.get("/top-10", top10);

router.get("/genres", genres);

// top-airing -- most-popular -- most-favorite -- completed -- recently-updated -- recently-added -- top-upcoming
router.get("/category/:type", category);

router.get("/info/:id", info);

router.get("/episodes/:id", episodes);

router.get("/episode-srcs", episodeSrcs);

export default router;
