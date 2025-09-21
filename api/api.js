const express = require("express");
const PORT = 8000 || process.env.PORT;
const cheerio = require("cheerio");
const axios = require("axios");
const serverless = require("serverless-http");
const rateLimit = require("express-rate-limit");
const { news_websites,
  news_array_espn,
  news_array_fourfourtwo_bundesliga,
  news_array_fourfourtwo_epl,
  news_array_fourfourtwo_laliga,
  news_array_fourfourtwo_ucl,
  news_array_goaldotcom,
  news_array_ninenine,
  news_array_onefootball,
  formatNewsItem,
  successResponse,
  errorResponse
} = require("../utils/helper");
const { URLLISTS, cacheKeys } = require("../utils/constants");
const { getCache, setCache } = require("../utils/cache");

const app = express();
const router = express.Router();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    error: true,
    message: "Too many requests, please try again later."
  }
});
router.get("/news", (req, res) => {
  res.json(news_websites);
});

// 90mins
router.get("/news/90mins", async (req, res) => {
  try {
    const cacheKey = cacheKeys.ninetymins;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    const response = await axios.get(URLLISTS.ninetymins)
    const html = response?.data
    const $ = cheerio.load(html);
    $("article").each(function () {
      const title = $(this).find("h3").text().trim();
      const url = $(this).find("a").attr("href");
      const thumb = $(this).find('picture').find('img').attr('src')
      if (url && title) {
        const item = formatNewsItem({
          title,
          url,
          image: thumb,
          source: "90mins"
        });
        news_array_ninenine.push(item);
      }
    });
    setCache(cacheKey, news_array_ninenine, 5 * 60 * 1000);
    successResponse(res, news_array_ninenine)
  } catch (err) {
    console.error("Error:", err.message);
    errorResponse(res, err)
  }
});

// One Football
router.get("/news/onefootball", async (req, res) => {
  try {
    const cacheKey = cacheKeys.onefootball;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    const response = await axios.get(URLLISTS.onefootball);
    const html = response.data;
    const $ = cheerio.load(html);

    $("li").each(function () {
      const title = $(this).find("a").eq(1).find("p").eq(0).text().trim();
      const url = $(this).find("a").eq(1).attr("href");
      const img = $(this).find("img").attr("src");

      if (title && url) {
        const item = formatNewsItem({
          title,
          url,
          image: img,
          source: "One Football"
        });
        news_array_onefootball.push(item);
      }
    });
    setCache(cacheKey, news_array_onefootball, 5 * 60 * 1000);
    successResponse(res, news_array_onefootball)
  } catch (err) {
    console.error("Error scraping OneFootball:", err.message);
    errorResponse(res, err)
  }
});

// ESPN
router.get("/news/espn", async (req, res) => {
  try {
    const cacheKey = cacheKeys.espn;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    const response = await axios.get(URLLISTS.espn);
    const html = response.data;
    const $ = cheerio.load(html);

    $("a").each(function () {
      const title = $(this).find("h2").text().trim();
      const href = $(this).attr("href");
      const img = $(this).find("img").attr("data-default-src");

      if (href && title) {
        const url = href.startsWith("http") ? href : `https://www.espn.in${href}`;
        if (url.includes("story")) {
          const item = formatNewsItem({
            title,
            url,
            image: img,
            source: "ESPN"
          });
          news_array_espn.push(item);
        }
      }
    });
    setCache(cacheKey, news_array_espn, 5 * 60 * 1000);
    successResponse(res, news_array_espn)
  } catch (err) {
    console.error("Error scraping ESPN:", err.message);
    errorResponse(res, err)
  }
});

// GOAL.com
router.get("/news/goal", async (req, res) => {
  try {
    const cacheKey = cacheKeys.goal;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    news_array_goaldotcom.length = 0;
    const response = await axios.get(URLLISTS.goal);
    const html = response.data;
    const $ = cheerio.load(html);

    $("li").each(function () {
      const href = $(this).find("a").attr("href");
      const url = href ? `https://goal.com${href}` : null;
      const title = $(this).find("h3").text().trim();
      const news_img = $(this).find("img").attr("src");
      if (!url || !title) return;
      if (url.includes("lists")) {
        const item = formatNewsItem({
          title,
          url,
          image: news_img,
          source: "GOAL"
        });
        news_array_goaldotcom.push(item);
      }
    });
    setCache(cacheKey, news_array_goaldotcom, 5 * 60 * 1000);
    successResponse(res, news_array_goaldotcom)
  } catch (err) {
    console.error("Error scraping Goal:", err.message);
    errorResponse(res, err)
  }
});

// FourFourTwo EPL
router.get("/news/fourfourtwo/epl", async (req, res) => {
  try {
    const cacheKey = cacheKeys.fourfourtwopl;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    news_array_fourfourtwo_epl.length = 0;

    const response = await axios.get(URLLISTS.fourfourtwopl);
    const html = response.data;
    const $ = cheerio.load(html);

    $(".small").each(function (index, element) {
      const url = $(element).find("a").attr("href");
      const title = $(element).find("h3.article-name").text().trim();
      const img = $(element).find("picture").find("img").attr('src');

      if (!url || !title) return;
      const item = formatNewsItem({
        title,
        url,
        image: img,
        source: "FourFourTwo"
      });
      news_array_fourfourtwo_epl.push(item);
    });
    setCache(cacheKey, news_array_fourfourtwo_epl, 5 * 60 * 1000);
    successResponse(res, news_array_fourfourtwo_epl)
  } catch (err) {
    console.error("Error scraping FourFourTwo EPL:", err.message);
    errorResponse(res, err)
  }
});

// FourFourTwo La Liga
router.get("/news/fourfourtwo/laliga", async (req, res) => {
  try {
    const cacheKey = cacheKeys.fourfourtwolaliga;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    news_array_fourfourtwo_laliga.length = 0;

    const response = await axios.get(URLLISTS.fourfourtwolaliga);
    const html = response.data;
    const $ = cheerio.load(html);

    $(".small").each(function (_, element) {
      const url = $(element).find("a").attr("href");
      const title = $(element).find("h3.article-name").text().trim();
      const img = $(element).find("picture").find("img").attr('src');

      if (!url || !title) return;
      const item = formatNewsItem({
        title,
        url,
        image: img,
        source: "FourFourTwo"
      });
      news_array_fourfourtwo_laliga.push(item);
    });
    setCache(cacheKey, news_array_fourfourtwo_laliga, 5 * 60 * 1000);
    successResponse(res, news_array_fourfourtwo_laliga)
  } catch (err) {
    console.error("Error scraping FourFourTwo La Liga:", err.message);
    errorResponse(res, err)
  }
});

// FourFourTwo UCL
router.get("/news/fourfourtwo/ucl", async (req, res) => {
  try {
    const cacheKey = cacheKeys.fourfourtwoucl;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    news_array_fourfourtwo_ucl.length = 0;

    const response = await axios.get(URLLISTS.fourfourtwoucl);
    const html = response.data;
    const $ = cheerio.load(html);

    $(".small").each(function (_, element) {
      const url = $(element).find("a").attr("href");
      const title = $(element).find("h3.article-name").text().trim();
      const img = $(element).find("picture").find("img").attr('src');

      if (!url || !title) return;
      const item = formatNewsItem({
        title,
        url,
        image: img,
        source: "FourFourTwo"
      });
      news_array_fourfourtwo_ucl.push(item);
    });
    setCache(cacheKey, news_array_fourfourtwo_ucl, 5 * 60 * 1000);
    successResponse(res, news_array_fourfourtwo_ucl)
  } catch (err) {
    console.error("Error scraping FourFourTwo UCL:", err.message);
    errorResponse(res, err)
  }
});

// FourFourTwo Bundesliga
router.get("/news/fourfourtwo/bundesliga", async (req, res) => {
  try {
    const cacheKey = cacheKeys.fourfourtwobund;
    const cached = getCache(cacheKey);
    if (cached) {
      return successResponse(res, cached, "cached");
    }
    news_array_fourfourtwo_bundesliga.length = 0;

    const response = await axios.get(URLLISTS.fourfourtwobund);
    const html = response.data;
    const $ = cheerio.load(html);

    $(".small").each(function (_, element) {
      const url = $(element).find("a").attr("href");
      const title = $(element).find("h3.article-name").text().trim();
      const img = $(element).find("picture").find("img").attr('src');

      if (!url || !title) return;
      const item = formatNewsItem({
        title,
        url,
        image: img,
        source: "FourFourTwo"
      });
      news_array_fourfourtwo_bundesliga.push(item);
    });
    setCache(cacheKey, news_array_fourfourtwo_bundesliga, 5 * 60 * 1000);
    successResponse(res, news_array_fourfourtwo_bundesliga)
  } catch (err) {
    console.error("Error scraping FourFourTwo Bundesliga:", err.message);
    errorResponse(res, err)
  }
});

app.use("/api/v2", router);
app.use("/api/v2", limiter);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
module.exports.handler = serverless(app);
// module.exports = { handler: serverless(app), app };
// middleware to log time,method and ip address from each request


// for local development
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });