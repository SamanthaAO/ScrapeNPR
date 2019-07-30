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
    $('#myModal').modal('toggle')
})


var getArticles = (category)=> {
    $("#articles").empty();
    $.getJSON("/articles/" + category, function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append(
                `<div class="col-sm-3">
                <div data-id="${data[i]._id}"class="card" style="width: 18rem;">
                
    
                    <img class="card-img-top" src="${data[i].image}" alt="${data[i].title}">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].title}</h5>
                        <p class="card-text">${data[i].summary}</p>
                    <a href="${data[i].link}" class="btn btn-primary">View Article</a>
                    <a href="#" id="leaveComment"class="btn btn-primary">Leave Comment</a>
                    </div>
                </div>
            </div>`);

        }
    });

}

getArticles("national");

