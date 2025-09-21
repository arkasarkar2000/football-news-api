export const news_websites = [
    { title: "90mins" },
    { title: "One Football" },
    { title: "ESPN" },
    { title: "GOAL" },
    { title: "FourFourtwo" },
];


export const formatNewsItem = ({ title, url, image, source }) => {
    return {
        title: title?.trim() || null,
        url: url || null,
        image: image || null,
        source,
        timestamp: new Date().toISOString()
    };
}

export const news_array_ninenine = [];
export const news_array_onefootball = [];
export const news_array_espn = [];
export const news_array_goaldotcom = [];
export const news_array_fourfourtwo_epl = [];
export const news_array_fourfourtwo_laliga = [];
export const news_array_fourfourtwo_ucl = [];
export const news_array_fourfourtwo_bundesliga = [];

export const successResponse = (res, data, source = "live", ttl = 5 * 60 * 1000) => {
    return res.status(200).json({
        success: true,
        error: false,
        cached: source === "cached",
        cache_ttl_ms: source === "cached" ? ttl : null,
        count: data.length,
        data
    });
}

export const errorResponse = (res, err) => {
    return res.status(500).json({
        success: false,
        error: true,
        message: err.message
    });
}