const express = require('express')
const PORT = 8000 || process.env.PORT
const cors = require('cors')
const cheerio = require('cheerio')
const axios = require('axios')

const news_array_ninenine = []
const news_array_onefootball = []
const news_array_espn = []
const news_array_goaldotcom = []
/* const scores_array = [] */
const news_websites = [
    {title: "90mins"},
    {title:"One Football"},
    {title: "ESPN"}
]

const app = express()
app.use(cors())


app.get('/news',(req,res)=>{
    res.json(news_websites)
})

app.get('/news/90mins',(req,res)=>{
    axios.get("https://www.90min.com/categories/football-news")
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a',html).each(function(){
            const title = $(this).find("header").find("h3").text()
            const url = $(this).attr('href')
            const news_img = $(this).find("img").attr('src')

            if(url.includes("posts") && title!==""){
                news_array_ninenine.push({
                    title,
                    url,
                    news_img
                    /* news_img */
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

app.get('/news/onefootball',(req,res)=>{
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

app.get('/news/espn',(req,res)=>{
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

app.get('/news/goal', (req,res)=>{
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

/* app.get('/scores',(req,res)=>{
    axios.get("https://onefootball.com/en/matches")
    .then((response)=>{
        const html=response.data;
        const $=cheerio.load(html);
        $('li',html).each(function(){
            const score_url = "https://onefootball.com" + $(this).find('a').attr('href')
            const team1_name = $(this).find('span').eq(0).text()
            const team1_logo = $(this).find('picture').eq(0).find('source').eq(0).attr('srcset')
            const team2_name = $(this).find('span').eq(2).text()
            const team2_logo = $(this).find('picture').eq(1).find('source').eq(0).attr('srcset')

            const team1_score = $(this).find('span').eq(1).text()
            const team2_score = $(this).find('span').eq(3).text()
            if(score_url.includes('match')&& team1_logo!=="" && team2_logo!==""){
                scores_array.push({
                    score_url,
                    team1_logo,
                    team1_name,
                    team1_score,
                    team2_logo,
                    team2_name,
                    team2_score
                })
            }
            
        })
        res.json(scores_array)
    }).catch(err=>console.log(err))
}) */



/* app.get('/scores',(req,res)=>{
    axios.get("https://www.goal.com/en-in/live-scores")
    .then((response)=>{
        const html = response.data
        const $ = cheerio.load(html)

        $("a",html).each(function(){
            const match_url = $(this).attr("href")
            const match_time_IST = $(this).find('time').text()
            const t1_name = $(this).find("h4").eq(0).text()
            const t2_name = $(this).find("h4").eq(1).text()
            const t1_score = $(this).find("p").eq(0).text()
            const t2_score = $(this).find("p").eq(2).text()
            if (match_url.includes('match')){
                scores_array.push({
                    match_url,
                    match_time_IST,
                    t1_name,
                    t1_score,
                    t2_name,
                    t2_score
                })

            }
            

        })
        res.json(scores_array)
    }).catch(err=>console.log(err))
})
 */






app.listen(PORT,()=>{
    console.log(`Listening on ${PORT} port`)
})