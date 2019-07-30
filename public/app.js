// Grab the articles as a json



$(document).on("click", ".nav-link", function (e) {

    getArticles(e.currentTarget.text.toLowerCase());
})

$(document).on("click", "#scrape", function () {
    $.get("/scrape", function (data) {
        alert(data);
    })
})

$(document).on("click", "#leaveComment", function () {
    // Empty the notes from the note section
    $("#previousComments").empty();
    $("#saveCommentDiv").empty();

    $('#myModal').modal('toggle')


    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // A button to submit a new note, with the id of the article saved to it

            $("#saveCommentDiv").append(`<button id ="saveComment" data-id="${thisId}" type="button" class="btn btn-primary">Save Comment</button>`);

            // If there's a note in the article
            if (data[0].notes) {
                data[0].notes.forEach(function(note){
                    // Place the title of the note in the title input
                    $("#previousComments").append(`<strong>${note.title}:</strong>`);
                    // Place the body of the note in the body textarea
                    $("#previousComments").append(`${note.body} <br>`);
                });

            }
        });
})


var getArticles = (category) => {
    $("#articles").empty();
    $.getJSON("/articles/category/" + category, function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append(
                `<div class="col-sm-3">
                <div data-id="${data[i]._id}" class="card" style="width: 18rem;">
                
    
                    <img class="card-img-top" src="${data[i].image}" alt="${data[i].title}">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">${data[i].summary}</p>
                    <a href="${data[i].link}" class="btn btn-primary">View Article</a>
                    <a href="#" id="leaveComment" data-id="${data[i]._id}" class="btn btn-primary">Leave Comment</a>
                    </div>
                </div>
            </div>`);

        }
    });

}

getArticles("national");




// When you click the savenote button
$(document).on("click", "#saveComment", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var username = $("#nameInput").val();
    var content = $("#commentInput").val();

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: username,
            // Value taken from note textarea
            body: content
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            //$("#previousComments").empty();
        });

    

    // Also, remove the values entered in the input and textarea for note entry
    $("#nameInput").val("");
    $("#commentInput").val("");

    //display new comment
    // Place the title of the note in the title input
    $("#previousComments").append(`<strong>${username}:</strong>`);
    // Place the body of the note in the body textarea
    $("#previousComments").append(`${content} <br>`);
});


