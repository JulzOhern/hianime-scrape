const { config } = require("dotenv");

config();

const ACCEPT_ENCODING_HEADER = "gzip, deflate, br";
const USER_AGENT_HEADER =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4692.71 Safari/537.36";
const ACCEPT_HEADER =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9";

const DOMAIN = process.env.DOMAIN || "hianime.to";

const SRC_BASE_URL = `https://${DOMAIN}`;
const SRC_AJAX_URL = `${SRC_BASE_URL}/ajax`;

module.exports = {
  ACCEPT_ENCODING_HEADER,
  USER_AGENT_HEADER,
  ACCEPT_HEADER,
  DOMAIN,
  SRC_BASE_URL,
  SRC_AJAX_URL,
};
