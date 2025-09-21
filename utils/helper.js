const news_websites = [
    { title: "90mins" },
    { title: "One Football" },
    { title: "ESPN" },
    { title: "GOAL" },
    { title: "FourFourtwo" },
];


const formatNewsItem = ({ title, url, image, source }) => {
    return {
        title: title?.trim() || null,
        url: url || null,
        image: image || null,
        source,
        timestamp: new Date().toISOString()
    };
}

const news_array_ninenine = [];
const news_array_onefootball = [];
const news_array_espn = [];
const news_array_goaldotcom = [];
const news_array_fourfourtwo_epl = [];
const news_array_fourfourtwo_laliga = [];
const news_array_fourfourtwo_ucl = [];
const news_array_fourfourtwo_bundesliga = [];

const successResponse = (res, data, source = "live", ttl = 5 * 60 * 1000) => {
    return res.status(200).json({
        success: true,
        error: false,
        cached: source === "cached",
        cache_ttl_ms: source === "cached" ? ttl : null,
        count: data.length,
        data
    });
}

const errorResponse = (res, err) => {
    return res.status(500).json({
        success: false,
        error: true,
        message: err.message
    });
}


module.exports = {
    errorResponse,
    formatNewsItem,
    successResponse,
    news_websites,
    news_array_espn,
    news_array_fourfourtwo_bundesliga,
    news_array_fourfourtwo_epl,
    news_array_fourfourtwo_laliga,
    news_array_fourfourtwo_ucl,
    news_array_goaldotcom,
    news_array_ninenine,
    news_array_onefootball
}