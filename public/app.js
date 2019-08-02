
//button that scraped articles
$(document).on("click", "#scrape", function () {
    $.get("/scrape", function (data) {
        alert(data);
        location.reload();

    })
})


$(document).on("click", "#clearScrape", function () {
    $.ajax({
        method: "DELETE",
        url: "/clear"
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);

            location.reload();

        });
})

//if there are any notes for the selected article empties note display div and gets and displays them with a delete button
function getNotes(thisId) {
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // A button to submit a new note, with the id of the article saved to it



            // If there's a note in the article
            if (data[0].notes) {
                $("#previousComments").empty();
                data[0].notes.forEach(function (note) {
                    // Place the title of the note in the title input
                    $("#previousComments").append(`<strong>${note.title}: </strong>`);
                    // Place the body of the note in the body textarea
                    $("#previousComments").append(`${note.body}`);
                    $("#previousComments").append(`<button id="deleteComment" data-id="${note._id}"  article-id="${thisId}" type="button" class="btn btn-light">Delete</button><br>`);

                });

            }
        });
}

//deploys the modal and creates a button that is unique to the article in the modal and calls function to get the notes for that article. 
$(document).on("click", "#leaveComment", function () {
    // Empty the notes from the note section
    $("#previousComments").empty();
    $("#saveCommentDiv").empty();

    $('#myModal').modal('toggle')


    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    $("#saveCommentDiv").append(`<button id ="saveComment" data-id="${thisId}" type="button" class="btn btn-primary">Save Comment</button>`);

    getNotes(thisId);

})

//ajax call for the delete to be sent to the server on button click
$(document).on("click", "#deleteComment", function () {
    var thisId = $(this).attr("data-id");
    var thatId = $(this).attr("article-id")

    $.ajax({
        method: "DELETE",
        url: "/articles/note/delete/" + thisId
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);

            getNotes(thatId);

        });

})

// saves comment to specific article
$(document).on("click", "#saveComment", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var username = $("#nameInput").val();
    var content = $("#commentInput").val();

    // adds comment to article
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from name input
            title: username,
            // Value taken from content textarea
            body: content
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);

            //dispalys comments
            getNotes(thisId);
        });



    // Also, remove the values entered in the input and textarea for note entry
    $("#nameInput").val("");
    $("#commentInput").val("");

    //display new comment
    // Place the title of the note in the title input
    // $("#previousComments").append(`<strong>${username}:</strong>`);
    // // Place the body of the note in the body textarea
    // $("#previousComments").append(`${content} <br>`);
    // $("#previousComments").append(`<button type="button" class="btn btn-light">Delete</button><br>`);
});

//removes articles from favorites
$(document).on("click", "#remove", function () {

    // Save the id from the button
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/unfavorites/" + thisId
    })
        // With that done refresh the page so that a new handlebars page is called with updated favorites
        .then(function (data) {
            console.log(data);
            location.reload();
        });
})


$(document).on("click", "#favorite", function () {
    // remove favorite button
    $(this).hide();


    // Save the id from the button
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/favorites/" + thisId
    })
        
        .then(function (data) {
            console.log(data);
            
        });
})



