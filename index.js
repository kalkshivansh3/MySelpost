import express from "express";
import Parser from "rss-parser";
import cors from "cors";
import axios from "axios";
import NodeCache from "node-cache";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import webpush from "web-push";

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

const parser = new Parser();

const cache = new NodeCache();

//! Connect database
const mongoURI =
  "mongodb+srv://himarabkoti:CWoZHUiM2kpze9vd@myselpostcluster.xetzmg2.mongodb.net/";
mongoose
  .connect(mongoURI, {
    dbName: "myselpostDB",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to myselpostDB database");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });


//! Database schemas
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  rating: Number,
});

const contactUsSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const subscriptionSchema = new mongoose.Schema({
  endpoint: String,
  keys: mongoose.Schema.Types.Mixed,
});

//! Database models
const Feedback = mongoose.model("Feedbacks", feedbackSchema);
const ContactUs = mongoose.model("contact Us", contactUsSchema);
const Subscription = mongoose.model("Subscription", subscriptionSchema);

//! Web push API keys
const publicKey =
  "BFYpZ9Lk5HdtTY5gx2InF-FXWMFb0sbaQgQa489op10YK9mBu4hgM-JQGh6K6Pwq8NwGn3tHMbNukgx3IWD51PY";
const privateKey = "XxvrcNKDtcNNfVrs0dfkEwnOr2kEj6Q9ZP7v-EP3Jqg";
webpush.setVapidDetails(
  "mailto:anujrajpoot087@gmail.com",
  publicKey,
  privateKey
);

app.use(bodyParser.json());

//! News sources
const newsSources = [
  //! Indian rss feed
  "https://www.india.com/news/india/feed/",
  //"https://www.socialnews.xyz/category/national/feed/",
  "https://feeds.feedburner.com/ndtvnews-india-news",
  "https://zeenews.india.com/rss/india-national-news.xml",

  //! American rss feed
  "https://theintercept.com/feed/?lang=en",
  "https://chaski.huffpost.com/us/auto/vertical/us-news",
  "http://rss.cnn.com/rss/cnn_us.rss",
  "https://www.latimes.com/nation/rss2.0.xml",

  //! Technology rss feed
  "https://techcrunch.com/feed/",
  "https://lifehacker.com/rss",
  "https://www.wired.com/feed/",
  "https://www.theverge.com/rss/index.xml",
  "https://www.zdnet.com/news/rss.xml",
  "https://feeds.feedburner.com/gadgets360-latest",

  //! Indian states wise rss feed
  "https://www.thehindu.com/news/cities/Delhi/feeder/default.rss",
  "https://www.thehindu.com/news/cities/bangalore/feeder/default.rss",
  "https://www.thehindu.com/news/cities/mumbai/feeder/default.rss",
  "https://www.thehindu.com/news/cities/chennai/feeder/default.rss",
  "https://www.thehindu.com/news/cities/hyderabad/feeder/default.rss",
  "https://www.thehindu.com/news/cities/kochi/feeder/default.rss",
  "https://www.thehindu.com/news/cities/kolkata/feeder/default.rss",
  "https://www.thehindu.com/news/cities/madurai/feeder/default.rss",
  "https://www.thehindu.com/news/cities/kozhikode/feeder/default.rss",
  "https://www.thehindu.com/news/cities/mangaluru/feeder/default.rss",
  "https://www.thehindu.com/news/cities/puducherry/feeder/default.rss",
  "https://www.thehindu.com/news/cities/thiruvananthapuram/feeder/default.rss",
  "https://www.thehindu.com/news/cities/tiruchirapalli/feeder/default.rss",
  "https://www.thehindu.com/news/cities/vijaywada/feeder/default.rss",
  "https://www.tribuneindia.com/rss/feed?catId=30",
  "https://www.tribuneindia.com/rss/feed?catId=28",
  "https://www.tribuneindia.com/rss/feed?catId=36",
  "https://www.tribuneindia.com/rss/feed?catId=45",
  "https://timesofindia.indiatimes.com/rssfeeds/3012544.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/3942660.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/3947071.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/-2128821153.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/-2128816011.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/4118215.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/3012535.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/-2128817995.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/4118245.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/3947067.cms",
  "https://timesofindia.indiatimes.com/rssfeeds/3942695.cms",
  "https://www.hindustantimes.com/feeds/rss/cities/bhopal-news/rssfeed.xml",

  //! American states wise rss feed
  "https://feeds.texastribune.org/feeds/main/",
  "https://nypost.com/us-news/feed/",
  "https://mississippitoday.org/feed/",
  "https://www.orlandosentinel.com/feed/",
  "https://www.spokesman.com/feeds/stories/",
  "https://billingsgazette.com/search/?f=rss&t=article&l=50&s=start_time&sd=desc&k%5B%5D=%23topstory",
  "https://www.reviewjournal.com/feed/",
  "https://www.latimes.com/california/rss2.0.xml",
  "https://starherald.com/search/?f=rss&t=article&l=50&s=start_time&sd=desc&k%5B%5D=%23topstory",
  "https://www.jamestownsun.com/index.rss",
  "https://www.denverpost.com/news/feed/",
  "https://feeds.mcclatchy.com/thestate/stories",
  "https://www.nwitimes.com/search/?f=rss&t=article&l=50&s=start_time&sd=desc&k%5B%5D=%23topstory",

  //! Indonesia states wise rss feed
  "https://rss.tempo.co/",
  "https://jabar.tribunnews.com/rss",
  "https://surabayapagi.com/feed",
  "https://www.balidiscovery.com/feed/",
  "https://www.metrosumatera.com/feed/",

  //! Cuba states wise rss feed
  "https://havanatimes.org/feed/",
  "https://santiagotimes.com/feed/",
  "https://www.radiorebelde.cu/feed/",
  "https://www.cubanet.org/feed/",

  //! UK states wise rss feed
  "https://www.standard.co.uk/news/rss",
  "https://www.manchestereveningnews.co.uk/news/?service=rss",
  "https://www.birminghammail.co.uk/news/?service=rss",
  "https://www.glasgowlive.co.uk/news/?service=rss",
  "https://feeds.bbci.co.uk/news/wales/rss.xml",
  "https://www.scotsman.com/rss",
  "https://feeds.bbci.co.uk/news/northern_ireland/rss.xml",

  //! World location news
  "https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/nz/?outputType=xml&_website=nzh",
  "https://feeds.bbci.co.uk/news/rss.xml",
  "http://rss.cnn.com/rss/cnn_us.rss",
  "https://www.smh.com.au/rss/feed.xml",
  "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
  "http://www.xinhuanet.com/english/rss/chinarss.xml",
  "https://www.rt.com/rss/",
  "https://batimes.com.ar/feed",
  "https://rss.jpost.com/rss/rssfeedsfrontpage.aspx",
  "https://www.arabnews.com/rss.xml",
  "https://feeds.capi24.com/v1/Search/articles/news24/topstories/rss",
  "https://www.dailysabah.com/rssFeed/10",
  "https://www.adaderana.lk/rss.php",
  "https://www.cbc.ca/webfeed/rss/rss-world",
  "https://feeds.thelocal.com/rss/dk",
  "https://www.france24.com/en/rss",
  "https://www.japantimes.co.jp/feed/",
  "https://www.spiegel.de/international/index.rss",
  "https://www.thedailystar.net/rss.xml",
  "https://tribune.com.pk/feed/pakistan",
  "https://english.onlinekhabar.com/feed",
  "https://www.irrawaddy.com/feed",
  "https://rss.tempo.co/",
  "https://www.riotimesonline.com/feed/",
  "https://rss.punchng.com/v1/category/latest_news",
  "https://www.arctictoday.com/feed/",
  "https://mexiconewsdaily.com/feed/",

  //! UK news
  "https://feeds.bbci.co.uk/news/rss.xml",
  "https://www.theguardian.com/uk-news/rss",
  "https://www.independent.co.uk/rss",
  "https://www.telegraph.co.uk/rss.xml",
  "https://en.granma.cu/feed",

  //! World news
  "https://www.thehindu.com/news/international/?service=rss",
  "https://www.scmp.com/rss/2/feed",
  "https://www.rt.com/rss/news/",
  "https://www.theguardian.com/world/rss",
  "https://www.independent.co.uk/news/world/rss",
  "https://feeds.npr.org/1004/rss.xml",
  "https://www.newsweek.com/rss",

  //! Business news
  "https://marketbusinessnews.com/feed/",
  "https://www.ibtimes.com/rss",
  "https://www.vox.com/rss/business-and-finance/index.xml",
  "https://fortune.com/feed/fortune-feeds/?id=3230629",
  "https://www.businessinsider.com/rss",

  //! Sports news
  "https://www.espn.com/espn/rss/news",
  "https://www.fourfourtwo.com/feeds.xml",
  "https://www.eurosport.com/rss.xml",
  "https://www.cbssports.com/rss/headlines/",

  //! Health news
  "https://www.statnews.com/feed/",
  "https://kffhealthnews.org/feed/",
  "https://www.medpagetoday.com/rss/headlines.xml",
  "https://theconversation.com/us/health/articles.atom",

  //! Science news
  "https://www.space.com/rss.xml",
  "https://www.livescience.com/feeds/all",
  "https://phys.org/rss-feed/",
  "https://feeds.newscientist.com/home",

  //! Entertainment news
  "https://www.etonline.com/movies/rss",
  "https://www.billboard.com/feed/",
  "https://www.hollywoodreporter.com/feed/",
  "https://deadline.com/feed/",
  "https://variety.com/feed/",

  //! Fashion news
  "https://www.fashiongonerogue.com/feed/",
  "https://www.businessoffashion.com/arc/outboundfeeds/rss/?outputType=xml",
  "https://www.glamour.com/feed/rss",
  "https://graziamagazine.com/feed/",
  "https://coveteur.com/feeds/feed.rss",

  //! Rus-ukr war news
  "https://euromaidanpress.com/feed/",
  "https://apnews.com/hub/russia-ukraine.rss",
  "https://feeds.bbci.co.uk/news/topics/c1vw6q14rzqt/rss.xml",
  "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/news-event/ukraine-russia/rss.xml",

  //! Israel war news
  "https://apnews.com/hub/israel-hamas-war.rss",
  "https://www.theguardian.com/world/israel-hamas-war/rss",
  "https://rss.jpost.com/rss/israel-hamas-war/",
  "https://feeds.bbci.co.uk/news/topics/c2vdnvdg6xxt/rss.xml",

  //! Education news
  "https://www.insidehighered.com/rss.xml",
  "https://theconversation.com/us/education/articles.atom",
  "https://www.educationnext.org/feed/",
  "https://hechingerreport.org/feed/",

  //! Brazil news
  "https://jornaldebrasilia.com.br/feed/",
  "https://www.brasilwire.com/feed/",
  "https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/geral/?body=%7B%22layout%22:%22google-news%22%7D",
  "https://braziljournal.com/feed/",
];

//! Fetch RSS feed
async function fetchRSS(url) {
  try {
    const cachedData = cache.get(url);
    if (cachedData) {
      console.log("Cached data found for:", url);
      return cachedData;
    }

    const feed = await parser.parseURL(url);
    const items = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      date: item.isoDate,
      image: null,
    }));

    const imageRequests = items.map(async (item) => {
      try {
        const htmlResponse = await axios.get(item.link);
        const metaImage = extractImage(htmlResponse.data);
        item.image = metaImage || null;
      } catch (error) {
        //console.error("Error fetching or parsing article:", error);
      }
    });

    await Promise.all(imageRequests);
    cache.set(url, items);
    return items;
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
    restartServer();
    return [];
  }
}

//! Extract image from news source
function extractImage(html) {
  try {
    const match = html.match(
      /<meta\s+(?:property|name)="og:image"\s+content="([^"]+)"\s*\/?>/i
    );
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting image:", error);
    return null;
  }
}

//! Restart server
function restartServer() {
  console.log("Restarting server...");
  // Close the current server instance
  server.close(async () => {
    try {
      // Reconnect to the database
      await mongoose.connect(mongoURI, {
        dbName: "myselpostDB",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Reconnected to the database");

      // Start the server again
      server = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    } catch (error) {
      console.error("Error reconnecting to the database:", error);
    }
  });
}

//! Fetch news source
app.get("/api/news/:source", async (req, res) => {
  const source = req.params.source.toLowerCase();
  const index = {
    indianews: 0,
    ndtvnews: 1,
    zeenews: 2,

    cbsnews: 3,
    huffpost: 4,
    cnnnews: 5,
    lanews: 6,

    techcrunch: 7,
    lifehacker: 8,
    wired: 9,
    verge: 10,
    zdnet: 11,
    gadget360: 12,

    delhi: 13,
    bangalore: 14,
    mumbai: 15,
    chennai: 16,
    hyderabad: 17,
    kochi: 18,
    kolkata: 19,
    madurai: 20,
    kozhikode: 21,
    mangaluru: 22,
    puducherry: 23,
    thiruvananthapuram: 24,
    tiruchirapalli: 25,
    vijaywada: 26,
    himachalpradesh: 27,
    haryana: 28,
    jammukashmir: 29,
    punjab: 30,
    jaipur: 31,
    surat: 32,
    varanasi: 33,
    ahmedabad: 34,
    hyderabad: 35,
    guwahati: 36,
    goa: 37,
    patna: 38,
    ranchi: 39,
    kanpur: 40,
    hubli: 41,
    bhopal: 42,

    texas: 43,
    newyork: 44,
    mississippi: 45,
    florida: 46,
    washington: 47,
    montana: 48,
    lasvegas: 49,
    california: 50,
    nebraska: 51,
    northdakota: 52,
    denver: 53,
    southcarolina: 54,
    indiana: 55,

    jakarta: 56,
    bandung: 57,
    surabaya: 58,
    bali: 59,
    sumatra: 60,

    havana: 61,
    santiago: 62,
    pinardelrio: 63,
    matanzas: 64,

    london: 65,
    manchester: 66,
    birmingham: 67,
    glasgow: 68,
    wales: 69,
    scotland: 70,
    northernireland: 71,

    newzealand: 72,
    uk: 73,
    us: 74,
    australia: 75,
    india: 76,
    china: 77,
    russia: 78,
    argentina: 79,
    israel: 80,
    saudiarabia: 81,
    southafrica: 82,
    turkey: 83,
    srilanka: 84,
    canada: 85,
    denmark: 86,
    france: 87,
    japan: 88,
    germany: 89,
    bangladesh: 90,
    pakistan: 91,
    nepal: 92,
    myanmar: 93,
    indonesia: 94,
    brazil: 95,
    nigeria: 96,
    greenland: 97,
    mexico: 98,

    bbc: 99,
    guardian: 100,
    independent: 101,
    telegraph: 102,

    granma: 103,

    thehindu: 104,
    scpost: 105,
    rtworld: 106,
    guardianworld: 107,
    independentworld: 108,
    nprworld: 109,
    newsweek: 110,

    marketbusiness: 111,
    ibtimes: 112,
    vox: 113,
    fortune: 114,
    businessinsider: 115,

    espn: 116,
    fourfourtwo: 117,
    eurosport: 118,
    cbssport: 119,

    statnews: 120,
    kffhealth: 121,
    medpagetoday: 122,
    theconversation: 123,

    spacenews: 124,
    livescience: 125,
    physics: 126,
    newsscientist: 127,

    etonline: 128,
    billboard: 129,
    hollywoodreporter: 130,
    deadline: 131,
    variety: 132,

    fashionrogue: 133,
    businessofffashion: 134,
    glamour: 135,
    glaziamagazine: 136,
    coveteur: 137,

    euromaid: 138,
    apnews: 139,
    bbcukraine: 140,
    nytukraine: 141,

    apisrael: 142,
    guardianisrael: 143,
    jpost: 144,
    bbcisrael: 145,

    insidehigh: 146,
    theconversationeducation: 147,
    educationnext: 148,
    hechingerreport: 149,

    brazilnews: 150,
    brasilwire: 151,
    estadao: 152,
    braziljournal: 153,
  };

  try {
    const url = newsSources[index[source]];
    const cachedData = cache.get(url);
    if (cachedData) {
      //console.log("Cached data found for:", url);
      res.json(cachedData);
    } else {
      const newsData = await fetchRSS(url);
      res.json(newsData);
    }
  } catch (error) {
    console.error(`Error fetching ${source} News:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//! Store user feedback
app.post("/api/feedbacks", async (req, res) => {
  try {
    //console.log('Received feedback:', req.body);
    const { name, email, message, rating } = req.body;
    const feedback = new Feedback({ name, email, message, rating });
    await feedback.save();
    console.log("Feedback saved successfully");
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//! Store contact details
app.post("/api/contact-us", async (req, res) => {
  try {
    //console.log('Received feedback:', req.body);
    const { name, email, message } = req.body;
    const contact = new ContactUs({ name, email, message });
    await contact.save();
    console.log("Contact form saved successfully");
    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error saving contact form:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//! Store subscription
app.post("/api/subscribe", async (req, res) => {
  try {
    const existingSubscription = await Subscription.findOneAndUpdate(
      { endpoint: req.body.endpoint },
      req.body,
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Subscription stored successfully", subscription: existingSubscription });
  } catch (error) {
    console.error("Error storing subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//! Send notification
app.post("/api/send-notification", async (req, res) => {
  const { title, body } = req.body;
  const payload = JSON.stringify({ title, body });

  const subscriptions = await Subscription.find();

  const notificationPromises = subscriptions.map((subscription) => {
    return webpush
      .sendNotification(subscription, payload)
      .catch((err) => {
        console.error("Error sending notification:", err);
        if (err.statusCode === 410) {
          // Subscription is no longer valid, remove it from database
          return subscription.remove();
        }
      });
  });

  await Promise.all(notificationPromises);

  res.status(200).json({ message: 'Notifications sent' });
});

//! Update subscription
app.put("/api/update-subscription", async (req, res) => {
  const newSubscription = req.body;
  try {
    const existingSubscription = await Subscription.findOneAndUpdate(
      { endpoint: newSubscription.endpoint },
      newSubscription,
      { new: true, upsert: true }
    );

    if (existingSubscription) {
      res
        .status(200)
        .json({
          message: "Subscription updated successfully",
          subscription: existingSubscription,
        });
    } else {
      res.status(404).json({ error: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//! Start server
let server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
