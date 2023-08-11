const express = require('express')
const PORT = 8000 || process.env.PORT
const cheerio = require('cheerio')
const axios = require('axios')
const serverless = require('serverless-http')

const app = express()
const router = express.Router()

const news_array_ninenine = []
const news_array_onefootball = []
const news_array_espn = []
const news_array_goaldotcom = []

const news_websites = [
    {title: "90mins"},
    {title:"One Football"},
    {title: "ESPN"},
    {title: "GOAL"}
]


router.get('/news',(req,res)=>{
    res.json(news_websites)
})

router.get('/news/90mins',(req,res)=>{
    axios.get("https://www.90min.com/categories/football-news")
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a',html).each(function(){
            const title = $(this).find("header").find("h3").text()
            const url = $(this).attr('href')

            if(url.includes("posts") && title!==""){
                news_array_ninenine.push({
                    title,
                    url,
                })
              }
           
        })
    /*     $('h3',html).each(function(){
            const title = $(this).text()
            news_array.push({
                title
            })
        }) */
        res.json(news_array_ninenine)
    }).catch((err)=>console.log(err))
})

router.get('/news/onefootball',(req,res)=>{
    axios.get("https://onefootball.com/en/home")
    .then((response)=>{
        const html1 = response.data
        const $ = cheerio.load(html1)
        $("li",html1).each(function(){
            const title = $(this).find("a").eq(1).find("p").eq(0).text()
            const url =  "https://onefootball.com" + $(this).find("a").eq(1).attr("href")
            const img = $(this).find("img").attr("src")
           

            if(title!==""){
                news_array_onefootball.push({
                    title,
                    url,
                    img
                })

            }
            
        })
        res.json(news_array_onefootball)

    }).catch((err)=>console.log(err))
})

router.get('/news/espn',(req,res)=>{
    axios.get("https://www.espn.in/football/")
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a',html).each(function(){
            const title = $(this).find("h2").text()
            const url = "https://www.espn.in" + $(this).attr('href')
            const img = $(this).find("img").attr("data-default-src")
            if(url.includes("story") && title!==""){
                news_array_espn.push({
                    title,
                    url,
                    img
                    /* news_img */
                })
              }
           
        })
        res.json(news_array_espn)
    }).catch((err)=>console.log(err))
})

router.get('/news/goal', (req,res)=>{
    axios.get("https://www.goal.com/en-in/news")
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)
        $('li',html).each(function(){
            const wordsToRemove = ["Getty","Images","/Goal"]
            const pattern = new RegExp(`^\\s+|(${wordsToRemove.join("|")}|[^a-zA-Z0-9\\s\\-.])`, "gi");
            const url = "https://goal.com/" + $(this).find('a').attr('href')
            const title = $(this).find('span').text()
            const news_img = $(this).find('img').attr('src')
            const modifiedTitle = title.replace(pattern,"")
            const modifiedTitle2 = modifiedTitle.replace("CC","")
            const modifiedTitle3 = modifiedTitle2.replace("IG-leomessiIG-leomessiDear god","" )

            if(url.includes("news","lists") && title!==""){
                news_array_goaldotcom.push({
                    url,
                    modifiedTitle3,
                    news_img
                })

            }
            
        })
        res.json(news_array_goaldotcom)
    }).catch(err=>console.log(err))
})


app.use('/.netlify/functions/api',router)
module.exports.handler = serverless(app)
