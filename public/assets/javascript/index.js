$(document).ready(function() {

    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    startPage();

    function startPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
        .then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        var articlePanel = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanel.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanel);
    }

    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            "<a id= 'articleurl' href=", article.url, ">", article.headline, "</a>",
            "<a id= 'buttonsave' class='btn save'>",
            "Save Article",
            "</a>",
            "</h3>",
            "</div>",
            "<div id= 'articlesummary' class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
            ].join(""));
        panel.data("_id", article._id);
        return panel;
    }

    function renderEmpty() {
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
            "<h4>There are no new articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>What do you want to do?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a class='scrape-new'>Scrape New Articles</a></h4>",
            "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
            "</div>",
            "</div>"
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data) {
            if (data.ok) {
                startPage();
            }
        });
    }

    function handleArticleScrape() {
        $.get("/api/fetch")
        .then(function(data) {
            startPage();
            bootbox.alert({
                size: "medium",
                message: data.message,
                closeButton: false
            });
        });
    }
});