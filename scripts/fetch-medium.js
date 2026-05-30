const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();
const FEED = "https://medium.com/feed/@srghimire061";

(async () => {
    const feed = await parser.parseURL(FEED);

    const posts = feed.items.slice(0, 10).map(item => {

        const html = item['content:encoded'] || item.content || "";

        // 1. Try OG image (best)
        let imgMatch = html.match(/property="og:image"\s+content="([^"]+)"/);

        // 2. Fallback: first image in content
        if (!imgMatch) {
            imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
        }

        return {
            title: item.title,
            link: item.link,
            date: item.pubDate,
            image: imgMatch ? imgMatch[1] : null
        };
    });

    fs.mkdirSync("data", { recursive: true });

    fs.writeFileSync(
        "data/posts.json",
        JSON.stringify(posts, null, 2)
    );

    console.log("Medium posts updated");
})();