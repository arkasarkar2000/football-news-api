const express = require("express");
const PORT = 8000 || process.env.PORT;
const cheerio = require("cheerio");
const axios = require("axios");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

const news_array_ninenine = [];
const news_array_onefootball = [];
const news_array_espn = [];
const news_array_goaldotcom = [];
const news_array_fourfourtwo_epl = [];
const news_array_fourfourtwo_laliga = [];
const news_array_fourfourtwo_ucl = [];
const news_array_fourfourtwo_bundesliga = [];

const news_websites = [
  { title: "90mins" },
  { title: "One Football" },
  { title: "ESPN" },
  { title: "GOAL" },
  { title: "FourFourtwo" },
];

router.get("/news", (req, res) => {
  res.json(news_websites);
});

router.get("/news/90mins", (req, res) => {
  axios
    .get("https://www.90min.com/categories/football-news")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const validUrlPatterns = [
        /^https:\/\/www\.90min\.com\/[a-z0-9-]+$/,
        /^https:\/\/www\.90min\.com\/features\/[a-z0-9-]+$/,
      ];

      $("a", html).each(function () {
        const title = $(this).find("header").find("h3").text();
        const url = $(this).attr("href");
        console.log(url, 8888888);
        const isValidUrl = validUrlPatterns.some((pattern) =>
          pattern.test(url)
        );
        if (isValidUrl && title !== "") {
          news_array_ninenine.push({
            title,
            url,
          });
        }
      });

      res.json(news_array_ninenine);
    })
    .catch((err) => console.log(err));
});

router.get("/news/onefootball", (req, res) => {
  axios
    .get("https://onefootball.com/en/home")
    .then((response) => {
      const html1 = response.data;
      const $ = cheerio.load(html1);
      $("li", html1).each(function () {
        const title = $(this).find("a").eq(1).find("p").eq(0).text();
        const url =
          "https://onefootball.com" + $(this).find("a").eq(1).attr("href");
        const img = $(this).find("img").attr("src");

        if (title !== "") {
          news_array_onefootball.push({
            title,
            url,
            img,
          });
        }
      });
      res.json(news_array_onefootball);
    })
    .catch((err) => console.log(err));
});

router.get("/news/espn", (req, res) => {
  axios
    .get("https://www.espn.in/football/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $("a", html).each(function () {
        const title = $(this).find("h2").text();
        const url = "https://www.espn.in" + $(this).attr("href");
        const img = $(this).find("img").attr("data-default-src");

        if (url.includes("story") && title !== "") {
          news_array_espn.push({
            title,
            url,
            img,
          });
        }
      });
      res.json(news_array_espn);
    })
    .catch((err) => console.log(err));
});

router.get("/news/goal", (req, res) => {
  axios
    .get("https://www.goal.com/en-in/news")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("li", html).each(function () {
        const wordsToRemove = ["Getty", "Images", "/Goal"];
        const pattern = new RegExp(
          `^\\s+|(${wordsToRemove.join("|")}|[^a-zA-Z0-9\\s\\-.])`,
          "gi"
        );
        const url = "https://goal.com" + $(this).find("a").attr("href");
        const title = $(this).find("h3").text();
        const news_img = $(this).find("img").attr("src");
        const modifiedTitle = title.replace(pattern, "");
        const modifiedTitle2 = modifiedTitle.replace("CC", "");
        const modifiedTitle3 = modifiedTitle2.replace(
          "IG-leomessiIG-leomessiDear god",
          ""
        );

        console.log(title, "88888");

        if (url.includes("lists") && title !== "") {
          news_array_goaldotcom.push({
            url,
            modifiedTitle3,
            news_img,
          });
        }
      });
      res.json(news_array_goaldotcom);
    })
    .catch((err) => console.log(err));
});

router.get("/news/fourfourtwo/epl", (req, res) => {
  axios
    .get("https://www.fourfourtwo.com/premier-league")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".small", html).each(function (index, element) {
        const url = $(element).find("a").attr("href");
        const title = $(element).find("h3.article-name").text();
        const imgSplitted = $(element).find("img").attr("data-srcset");
        const img = imgSplitted ? imgSplitted.split(" ") : null;
        const news_img = img ? img[0] : null;
        const short_desc = $(element).find("p.synopsis").text()?.trim();
        if (!url || !title) {
          return;
        }
        news_array_fourfourtwo_epl.push({
          url,
          title,
          news_img,
          short_desc,
        });
      });

      res.json(news_array_fourfourtwo_epl);
    })
    .catch((err) => console.log(err));
});

router.get("/news/fourfourtwo/laliga", (req, res) => {
  axios
    .get("https://www.fourfourtwo.com/la-liga")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".small", html).each(function (index, element) {
        const url = $(element).find("a").attr("href");
        const title = $(element).find("h3.article-name").text();
        const imgSplitted = $(element).find("img").attr("data-srcset");
        const img = imgSplitted ? imgSplitted.split(" ") : null;
        const news_img = img ? img[0] : null;
        const short_descc = $(element).find("p.synopsis").text()?.trim();
        const short_desc = short_descc?.replace(/^La Liga\n|IN THE MAG\n/g, "");
        if (!url || !title) {
          return;
        }
        news_array_fourfourtwo_laliga.push({
          url,
          title,
          news_img,
          short_desc,
        });
      });

      res.json(news_array_fourfourtwo_laliga);
    })
    .catch((err) => console.log(err));
});

router.get("/news/fourfourtwo/ucl", (req, res) => {
  axios
    .get("https://www.fourfourtwo.com/champions-league")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".small", html).each(function (index, element) {
        const url = $(element).find("a").attr("href");
        const title = $(element).find("h3.article-name").text();
        const imgSplitted = $(element).find("img").attr("data-srcset");
        const img = imgSplitted ? imgSplitted.split(" ") : null;
        const news_img = img ? img[0] : null;
        const short_descc = $(element).find("p.synopsis").text()?.trim();
        const short_desc = short_descc?.replace(
          /^La Liga\n|IN THE MAG\n|HOW TO WATCH\n/g,
          ""
        );
        if (!url || !title) {
          return;
        }
        news_array_fourfourtwo_ucl.push({
          url,
          title,
          news_img,
          short_desc,
        });
      });

      res.json(news_array_fourfourtwo_ucl);
    })
    .catch((err) => console.log(err));
});

router.get("/news/fourfourtwo/bundesliga", (req, res) => {
  axios
    .get("https://www.fourfourtwo.com/bundesliga")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".small", html).each(function (index, element) {
        const url = $(element).find("a").attr("href");
        const title = $(element).find("h3.article-name").text();
        const imgSplitted = $(element).find("img").attr("data-srcset");
        const img = imgSplitted ? imgSplitted.split(" ") : null;
        const news_img = img ? img[0] : null;
        const short_descc = $(element).find("p.synopsis").text()?.trim();
        const short_desc = short_descc?.replace(
          /^La Liga\n|IN THE MAG\n|HOW TO WATCH\n|EXCLUSIVE\n/g,
          ""
        );
        if (!url || !title) {
          return;
        }
        news_array_fourfourtwo_bundesliga.push({
          url,
          title,
          news_img,
          short_desc,
        });
      });

      res.json(news_array_fourfourtwo_bundesliga);
    })
    .catch((err) => console.log(err));
});

app.use("/api", router);
module.exports.handler = serverless(app);