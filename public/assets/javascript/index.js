$(document).ready(function () {
  var articleContainer = $(".article-container");
  // on click method that calls a specific function when a certain button is clicked.
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);

  startPage();

//
// name: startPage()
// description: Empties article panel. Does get API call to find new articles and loads articles into renderArticle() function. If no new articles found page renders empty.
// input: none
// variables: none
// return: none
//
  function startPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=false").then(function (data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

//   
// name: renderArticles()
// description: Loops through articles and creates formatted panels.
// input: articles[]
//      articles: array of unformatted article objects
// variables: articlePanel[]
//      articlePanel[]: array of formatted article panels
// return: none
// 
  function renderArticles(articles) {
    var articlePanel = [];
    for (var i = 0; i < articles.length; i++) {
      articlePanel.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanel);
  }

//   
// name: createPanel()
// description: Formats panel for articles.
// input: articles[]
//      articles: individual unformatted article
// variables: panel[]
//      panels[]: array of individual panel elements that is customized into a single string.
// return: panel
//      panel: formatted HTML elements to create a container that holds article URL, headline, and summary. also holds button for saving article.
// 
  function createPanel(article) {
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a id= 'articleurl' href=",
        article.url,
        ">",
        article.headline,
        "</a>",
        "<a id= 'buttonsave' class='btn save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div id= 'articlesummary' class='panel-body'>",
        article.summary,
        "</div>",
        "</div>",
      ].join("")
    );
    panel.data("_id", article._id);
    return panel;
  }

//   
// name: renderEmpty()
// description: Formats panel if there are no new articles.
// input: none
// variables: emptyAlert[]
//      emptyAlert[]: array of individual HTML panel elements that is customized into a single string.
// return: none
// 
  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
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
        "</div>",
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

// 
// name: handleArticleSave()
// description: Saves new articles and runs startPage().
// input: none
// variables: articleToSave
//      articleToSave: selects article to be saved from array of articles
// return: none
// 
  function handleArticleSave() {
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    $.ajax({
      method: "PATCH",
      url: "/api/headlines",
      data: articleToSave,
    }).then(function (data) {
      if (data.ok) {
        startPage();
      }
    });
  }

// 
// name: handleArticleScrape()
// description: Does get API call to pull new articles
// input: none
// variables: none
// return: none
// 
  function handleArticleScrape() {
    $.get("/api/fetch").then(function (data) {
      startPage();
      bootbox.alert({
        size: "medium",
        message: data.message,
        closeButton: false,
      });
    });
  }
});
