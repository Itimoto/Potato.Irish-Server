const express       = require("express");
const spdy          = require("spdy");
const http          = require("http");
const path          = require("path");
const fs            = require("fs");

// Dedicated Routes...
const INDEX         = path.join(__dirname + "/public", "index.html");
const NOTFOUNDPAGE  = path.join(__dirname + "/public", "404.html");
const ROOMBAROAMER  = path.join(__dirname + "/public/projects", "rr.html");
const PONG          = path.join(__dirname + "/public/projects", "pong.html");

// Custom Imports
const ScrapeMeta    = require('./lib/gen/scraper');
const WSSRouter     = require('./lib/gen/wssRouter');

const RoombaServer  = require('./lib/rr/_rr-server');
//const piStreamPORT = 8083;
//const commPORT = 8082;

const PongServer    = require('./lib/pong/_pong-server');
//const pongPORT = 8084;


// Express App Boilerplate
var app = express();

//public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));     // For the h264 Player
app.use(express.static(__dirname + '/public/projects')); // For any additional projects
app.use(express.static(__dirname + '/public/articles')); // For articles/blogposts

// Set Up Routes for Primary Server:
app.get('/', function (req, res) {
    //res.redirect("https://www.youtube.com/watch?v=6n3pFFPSlW4");
    // You've just been  g n o m e d
    res.sendFile(INDEX);
});

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + "/public", "about.html"));
});
app.get('/contact', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/articles", "contact.html"));
});

// Dedicated routes to active projects
app.get('/rr', function (req, res) {
    res.sendFile(ROOMBAROAMER);
});

app.get('/pong', function (req, res) {
    res.sendFile(PONG);
});

// 'Router' for Articles -- Middleware to catch general /articles first, then go for lookup
app.use('/articles*', function (req, res, next) {
    //console.log(`Middleware: ${JSON.stringify(req.params)}`);
    // Empty / Default Path
    if(req.params[0] === "/"){
        res.sendFile(path.join(__dirname + "/public/articles", "article-menu.html"));
        return;
    }

    // For the Article-Menu: 'Scrape' all Article Titles & Descriptions, then send it.
    if(req.params[0] === "/scrape"){
        let excludedFiles = ["contact.html", "testing.html", "empty-template", "article-menu.html", "landing.html"];
        let articleMetadata = ScrapeMeta.getMetadata( path.join(__dirname + "/public/articles" ), excludedFiles);
        res.send(articleMetadata);
        return;
    }

    next();
});

app.get('/articles/:articleName', function (req, res) {
    let requestedArticle = req.params.articleName;
    //console.log(`Request in for Article: ${requestedArticle}`);

    res.sendFile(path.join(__dirname + "/public/articles", `${requestedArticle}.html`));
});

app.get('/portfolio*', function (req, res) {
    if(req.params[0] === "/"){
        res.sendFile(path.join(__dirname + "/public/portfolio", "portfolio-landing.html"));
        return;
    };

    let requestedPortfolio = req.params[0];
    res.sendFile(path.join(__dirname + "/public/portfolio", `${requestedPortfolio}.html`));
});

app.get('/404', function (req, res) {
    res.sendFile(NOTFOUNDPAGE);
});

// '404 route' -- Must be kept as the last route
app.get('*', function(req, res) {   
    res.status(404);
    res.redirect('/404');
});
/*
// Semi-sorta-middleware, since we're using multiple routes.
function sendFromArticles(res, requestedArticle){
    res.sendFile(path.join(__dirname + "/public/articles", `${requestedArticle}.html`));
}
*/

// Set up HTTP2 Server SSL Components:
const options = {
    key : fs.readFileSync(__dirname + '/ssl/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
    ca  : fs.readFileSync(__dirname + '/ssl/chain.pem'),
}

//const server = http.createServer(app); // for HTTP: (Legacy)
//const roomba = new RoombaServer(server, {commPORT: commPORT, piStreamPORT: piStreamPORT);
//PongServer.beginListening({ port: pongPORT });

const server = spdy.createServer(options, app);
WSSRouter.initialize(server);

const roomba = new RoombaServer(server);
PongServer.initialize({ssl: true});

//server.listen(80);  // Start listening on HTTP's Default port
server.listen(443, (error) => {
    if(error) {
        console.error(error);
        return process.exit(1);
    } else {
        console.log(`Listening on port: 443.`);
    }
});

// Redirect from http port 80 to http2/https
http.createServer(function (req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();  
}).listen(80);