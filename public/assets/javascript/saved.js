$(document).ready(function () {
  var articleContainer = $(".article-container");

//
// name: startPage()
// description: Empties article panel. Does get API call to check for saved flag and loads articles into renderArticle() function. If no saved articles found page renders empty.
// input: none
// variables: none
// return: none
//
  function startPage() {
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function (data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

//   
// name: renderArticles()
// description: Loops through saved articles and creates formatted panels.
// input: articles[]
//      articles: array of unformatted article objects
// variables: articlePanels[]
//      articlePanels[]: array of formatted article panels
// return: none
// 
  function renderArticles(articles) {
    var articlePanels = [];
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }

//   
// name: createPanel()
// description: Formats panel for saved articles.
// input: articles[]
//      articles: individual unformatted article
// variables: panel[]
//      panels[]: array of individual panel elements that is customized into a single string.
// return: panel
//      panel: formatted HTML elements to create a container that holds article URL, headline, and summary. also hold buttons for deleting article and adding notes.
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
        "<a id='buttonDelete' class='btn delete'>",
        "Delete From Saved",
        "</a>",
        "<a id='buttonNotes' class='btn btn-info notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        "<div id= 'articlesummary' class='panel-body'>",
        article.summary,
        "</div>",
        "</div>",
      ].join("")
    );
    panel.data("_id", article._id);
    panel.data("headline", article.headline);
    return panel;
  }

//   
// name: renderEmpty()
// description: Formats panel if there are no saved articles.
// input: none
// variables: emptyAlert[]
//      emptyAlert[]: array of individual HTML panel elements that is customized into a single string.
// return: none
// 
  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>There are no saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would you like to view available articles?</h3>",
        "</div>",
        "</div>",
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

//   
// name: renderNotesList()
// description: Renders notes saved to an individual article. If no notes are saved a message will show alerting there are no saved notes.
// input: data[]
//      data: individual saved articles
// variables: notesToRender[], currentNote
//      notesToRender[]: array of notes saved to an individual article.
//      currentNote: formatted HTML elements to hold notes saved to individual articles. also holds button for deleting notes.
// return: none
// 
  function renderNotesList(data) {
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      currentNote = [
        "<li class='list-group-item'>",
        "There are no notes for this article.",
        "</li>",
      ].join("");
      notesToRender.push(currentNote);
    } else {
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button id='note-delete' class='btn btn-danger note-delete'>x</button>",
            "</li>",
          ].join("")
        );
        currentNote.children("button").data("_id", data.notes[i]._id);
        notesToRender.push(currentNote);
      }
    }
    $(".note-container").append(notesToRender);
  }

//   
// name: handleArticleDelete()
// description: Deletes saved articles and runs startPage().
// input: none
// variables: articleToDelete
//      articleToDelete: selects article to be deleted from array of saved articles.
// return: none
// 
  function handleArticleDelete() {
    var articleToDelete = $(this).parents(".panel").data();
    console.log("delete: ", articleToDelete);
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id,
    }).then(function (data) {
      if (data.ok) {
        startPage();
      }
    });
  }

//   
// name: handleArticleNotes()
// description: Selects article for note to be saved to and then brings up a textarea for note to be typed into.
// input: none
// variables: currentArticle, modalText[], box, noteData{}
//      currentArticle: selects individual article from array of saved articles so note can be saved
//      modalText[]: formatted HTML elements that shows notes saved to an individual article and has textarea for adding notes.
//      box: holds information for bootbox
//      noteData{}: holds information about individual article
// return: none
// 
  function handleArticleNotes() {
    var currentArticle = $(this).parents(".panel").data();
    console.log("current article: ", currentArticle);
    $.get("/api/notes/" + currentArticle._id).then(function (data) {
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes for Article: ",
        currentArticle.headline,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='35'></textarea>",
        "<button id='buttonSave' class='btn save'>Save Note</button>",
        "</div>",
      ].join("");
      console.log("modalText: ", modalText);
      var box = bootbox.dialog({
        className: "bootboxNotes",
        size: "extra-large",
        message: modalText,
        inputType: "textarea",
        closeButton: true,
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || [],
      };
      console.log("notedata: ", noteData);
      $(".btn.save").data("article", noteData);
      renderNotesList(noteData);
    });
  }

//   
// name: handleNoteSave()
// description: Saves notes to an individual article.
// input: none
// variables: noteData, newNote
//      noteData: holds information about the article and is where notes are saved to.
//      newNote: formats note
// return: none
// 
  function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    console.log("notes save: ", newNote);
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote,
      };
      $.post("/api/notes", noteData).then(function () {
        bootbox.hideAll();
      });
    }
  }

//   
// name: handleNoteDelete()
// description: Deletes notes saved to an individual article
// input: none
// variables: noteToDelete
//      noteToDelete: selects note saved to an article and deletes it.
// return: none
// 
  function handleNoteDelete() {
    var noteToDelete = $(this).data("_id");
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE",
    }).then(function () {
      bootbox.hideAll();
    });
  }

// on click method that calls a specific function when a certain button is clicked.
  $(document).on("click", "#buttonDelete", handleArticleDelete);
  $(document).on("click", "#buttonNotes", handleArticleNotes);
  $(document).on("click", "#buttonSave", handleNoteSave);
  $(document).on("click", "#note-delete", handleNoteDelete);
  startPage();
});
