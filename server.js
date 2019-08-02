var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");



// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/unit18HW", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/unit18HW";

mongoose.connect(MONGODB_URI);

//object that has each category we are scrapign npr for
var categories = [
    {
        category: "national",
        link: "https://www.npr.org/sections/national/"
    },
    {
        category: "world",
        link: "https://www.npr.org/sections/world/"
    },
    {
        category: "politics",
        link: "https://www.npr.org/sections/politics/"
    },
    {
        category: "business",
        link: "https://www.npr.org/sections/business/"
    },
    {
        category: "technology",
        link: "https://www.npr.org/sections/technology/"
    },
    {
        category: "science",
        link: "https://www.npr.org/sections/science/"
    },
    {
        category: "health",
        link: "https://www.npr.org/sections/health/"
    },
    {
        category: "RaceAndCulture",
        link: "https://www.npr.org/sections/codeswitch/"
    }
]

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    //goes through eahc categors and scrapes each one
    categories.map((category, i) => {
        axios.get(category.link).then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            $("article.item.has-image").each(function (i, element) {

                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.category = category.category;

                result.favorite = false;

                result.title = $(this)
                    .children("div.item-info-wrap")
                    .children("div.item-info")
                    .children("h2.title")
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("div.item-info-wrap")
                    .children("div.item-info")
                    .children("h2.title")
                    .children("a")
                    .attr("href");
                result.summary = $(this)
                    .children("div.item-info-wrap")
                    .children("div.item-info")
                    .children("p.teaser")
                    .children("a")
                    .text();
                result.image = $(this)
                    .children("div.item-image")
                    .children("div.imagewrap")
                    .children("a")
                    .children("img")
                    .attr("src");

                // Create a new Article using the `result` object built from scraping will not allow articles if the link is already present
                db.Article.findOneAndUpdate({ link: result.link }, result, { upsert: true })
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });

            //only send response back to client if on last category
            if (i === categories.length - 1) {
                res.send("Scrape Complete");
            }
        });
    })

});





// Route for adding article to favorites
app.post("/favorites/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ _id: req.params.id })
    // and change the favorite to true
    db.Article.findOneAndUpdate({ _id: req.params.id }, { favorite: true })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// route for removing article from favorites
app.post("/unfavorites/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ _id: req.params.id })
    // changes favorite to false
    db.Article.findOneAndUpdate({ _id: req.params.id }, { favorite: false })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for deleting comment
app.delete("/articles/note/delete/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Note.find({ _id: req.params.id })
    // removes the note matching the id
    db.Note.findOneAndRemove({ _id: req.params.id })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for deleting all articles
app.delete("/clear", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.collection.drop()
        // removes the note matching the id
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("notes")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



// Route for adding a note to an article
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            //$push adds note to the list of notes
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//if going to the home page redirect to national
app.get("/", function (req, res) {
    res.redirect('/national');
});

//this displays the favorites page in handlbars which shows all articles where favorite is true
app.get("/favorites", function (req, res) {
    // Grab every document in the Articles collection where favorite is true
    db.Article.find({ favorite: true })
        .then(function (dbArticle) {
            // create handlebars object
            var hbsObject = {
                articles: dbArticle
            }

            var message = {
                message: "Sorry, there are currently no articles in favorites."
            }

            console.log(hbsObject);
            //renders favorite handlebars
            if (hbsObject.articles.length >= 1) {
                res.render("favorites", hbsObject);
            }
            else {
                res.render("favorites", message)
            }
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//creates handlebars for each category page
app.get("/:category", function (req, res) {
    console.log(req.params)
    // Grab every document in the Articles collection with the chosed category
    db.Article.find({ category: req.params.category })

        //create handlebars onject
        .then(function (dbArticle) {
            var hbsObject = {
                articles: dbArticle
            }
            var message = {
                message: "There are currently no articles scraped. Please, scrape articles to view them."
            }

            console.log(hbsObject);
            //render handlebars category page
            if (hbsObject.articles.length >= 1) {
                res.render(req.params.category, hbsObject);
            }
            else {
                res.render(req.params.category, message)
            }

        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });

});



// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});