"use strict";

if (window.jQuery) $.when(
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"),
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.10/js/material.min.js"),
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.10/js/ripples.min.js"),
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/js/standalone/selectize.min.js"),
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.js"),
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/gojs/1.7.10/go-debug.js"),
    $.getScript("js/moodler/moodler.js"),
    $.getScript("js/moodler/erd_templates.js"),
    $.getScript("js/forms.js"),
    $.Deferred(function (deferred) {
        $(deferred.resolve);
    })
).done(function () {
    $.material.init();
    moodler.init("moodler");
    formHandler.init();
});
else
    alert("Failed to load Jquery - Can not continue");