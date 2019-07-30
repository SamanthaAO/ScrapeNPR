// Grab the articles as a json



// $(document).on("click", ".nav-link", function (e) {

//     //getArticles(e.currentTarget.text.toLowerCase());
//     $.get("/scraped/"+ e.currentTarget.text.toLowerCase(), function (data) {
        
//     })
// })

$(document).on("click", "#scrape", function () {
    $.get("/scrape", function (data) {
        alert(data);
    })
})

function getNotes(thisId){
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
            
            getNotes(thisId);
            // Empty the notes section
            
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




// var getArticles = (category) => {
//     $("#articles").empty();
//     $.getJSON("/articles/category/" + category, function (data) {
//         // For each one
//         for (var i = 0; i < data.length; i++) {
//             // Display the apropos information on the page
//             $("#articles").append(
//                 `<div class="col-sm-3">
//                 <div data-id="${data[i]._id}" class="card" style="width: 18rem;">
                
    
//                     <img class="card-img-top" src="${data[i].image}" alt="${data[i].title}">
//                     <div class="card-body">
//                         <h5 class="card-title">${data[i].title}</h5>
//                         <p class="card-text">${data[i].summary}</p>
//                     <a href="${data[i].link}" class="btn btn-primary">View Article</a>
//                     <a href="#" id="leaveComment" data-id="${data[i]._id}" class="btn btn-primary">Leave Comment</a>
//                     <a href="#" id="favorite" data-id="${data[i]._id}" class="btn btn-primary">Favorite</a>
//                     </div>
//                 </div>
//             </div>`);


//         }
//     });

// }

// getArticles("national");

function getFovorites() {
    // Empty articles 
    $("#articles").empty();


    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/favorites"
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);

            // If there's a note in the article
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
                        <a href="#" id="remove" data-id="${data[i]._id}" class="btn btn-primary">Remove</a>
                        </div>
                    </div>
                </div>`);

            }
        });
};

// $(document).on("click", "#viewFavorites", function () {

//     getFovorites();

// })

$(document).on("click", "#remove", function () {

    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/unfavorites/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            location.reload();
        });
})

$(document).on("click", "#favorite", function () {
    // remove favorite button
    $(this).hide();


    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "POST",
        url: "/favorites/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // $("#favorite").hide();
        });
})



