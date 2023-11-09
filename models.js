const fetch = require("cross-fetch");
const cheerio = require("cheerio");
const url = "https://www.wickedweasel.com/en-sg/models";
const base = "https://www.wickedweasel.com/en-sg";

(async () => {
    const res = await fetch(url);
    const data = await res.text();
    const $ = cheerio.load(data);
    let models = [];
    $(".carousel_item").each((idx, el) => {
        let name = $(el).find(".model_text").find("h2").text();
        let murl = $(el).find("a").last().attr("href");
        murl = murl ? (murl.match(/https/i) ? murl : base + murl) : murl;
        models.push({ name, murl });
    });
    $(".winner-item").each((idx, el) => {
        let murl = $(el).attr("href");
        let name = $(el).find("h2").text();
        murl = murl ? (murl.match(/https/i) ? murl : base + murl) : murl;
        models.push({ name, murl });
    });
    for (let m of models) {
        await new Promise((r) => setTimeout(r, 2000));
        const res = await fetch(m.murl);
        const data = await res.text();
        const $ = cheerio.load(data);
        m.images = [];
        $(".carousel")
            .find("li")
            .each((idx, el) => {
                let href = $(el).find("img").attr("src");
                if (href) m.images.push(href);
            });
        console.log(m);
    }
})();
