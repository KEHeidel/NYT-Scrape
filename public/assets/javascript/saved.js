$(document).ready(function() {
    var articleContainer = $(".article-container");

    function startPage() {
        
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data) {
            if (data && data.length) {
                renderArticles(data);
            }
            else {
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        var articlePanels = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        var panel =
            $(["<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            article.headline,
            "<a id='buttonDelete' class='btn delete'>",
            "Delete From Saved",
            "</a>",
            "<a id='buttonNotes' class='btn btn-info notes'>Article Notes</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
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
            "<h4>There are no saved articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>Would you like to view available articles?</h3>",
            "</div>",
            "</div>"
        ].join(""));
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if(!data.notes.length) {
            currentNote = [
                    "<li class='list-group-item'>",
                    "There are no notes for this article.",
                    "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button id='note-delete' class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        var articleToDelete = $(this).parents(".panel").data();
        console.log("delete: ", articleToDelete )
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                startPage();
            }
        });
    }

    function handleArticleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        console.log("current article: ", currentArticle)
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes for Article: ",
                currentArticle._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button id='save' class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            console.log("modalText: ", modalText)
            var box = bootbox.dialog({
                className: 'bootboxNotes',
                size: "extra-large",
                message: modalText,
                inputType: 'textarea',
                closeButton: true
            })
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            console.log("notedata: ", noteData)
            $(".btn.save").data("article", noteData);
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        console.log("notes save: ", newNote)
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        });
    }
    
    $(document).on("click", "#buttonDelete", handleArticleDelete);
    $(document).on("click", "#buttonNotes", handleArticleNotes);
    $(document).on("click", "#save", handleNoteSave);
    $(document).on("click", "#note-delete", handleNoteDelete);
    startPage();
});