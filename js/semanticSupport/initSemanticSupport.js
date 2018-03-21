var semanticSupportEnabled = true;

function finalizeGUI(){
    $.ajax({
        url: 'http://132.252.51.194:3000/api/testConnection',
        success: function (result) {
            console.log("Connection to Server possible");
            initConnection(undefined);
        },
        error: function (result) {
            document.getElementById("intranetError").classList.remove("hidden");
        },
        timeout: 1000
    });

    $('#cardinality1').inputmask({ regex: "([0]|[1-9]+)(,)[1-9]+|\\*"});
    $('#cardinality2').inputmask({ regex: "([0]|[1-9]+)(,)[1-9]+|\\*"});
    var szenarioBtn = $('#szenarioBtn');
    szenarioBtn.click(function() {
        $('#szenarioModal').modal('show');
        $('#szenarioModal').on('hide.bs.modal', finalizeDomainModal);
        $('#editDomainButton').on('click', initEditDomains);
        initDomains();
    });

    var switchMessagesBtn = $('#SwitchMessagesBtn');
    switchMessagesBtn.click(function () {
        if (semanticSupportEnabled) {
            semanticSupportEnabled = false;
            notification.destroyAll();
            $('#szenarioBtn').prop('disabled', true);
            document.getElementById('currentDomain').classList.add("hidden");
            switchMessagesBtn.text("Hinweise einschalten");

            for (var i = 0; i < moodler._diagram.model.nodeDataArray.length; i++) {
                var item = moodler._diagram.model.nodeDataArray[i];

                if (!item) {
                    continue;
                }

                if (item.error) {
                    moodler._diagram.model.setDataProperty(item, "error", false);
                }

                if (item.warning) {
                    moodler._diagram.model.setDataProperty(item, "warning", false);
                }


            }
        }
        else {
            semanticSupportEnabled = true;
            $('#szenarioBtn').prop('disabled', false);
            document.getElementById('currentDomain').classList.remove("hidden");
            switchMessagesBtn.text("Hinweise ausschalten");

            for (var i = 0; i < moodler._diagram.model.nodeDataArray.length; i++) {
                var item = moodler._diagram.model.nodeDataArray[i];

                if (!item) {
                    continue;
                }

                if (item.errorMessage) {
                    moodler._diagram.model.setDataProperty(item, "error", true);
                }

                if (item.warningMessage) {
                    moodler._diagram.model.setDataProperty(item, "warning", true);
                }


            }
        }
    });

    startWelcomeTour();
    startToasts();
}

function startToasts(){
    //$.material.init();
    $('body').bootstrapMaterialDesign();

    /*var request = new XMLHttpRequest();
    request.open("GET", "json/szenario.json", false);
    request.send(null);
    autocomplete.sourceEntity = JSON.parse(request.responseText);*/

    toastr.options.progressBar = true;
    toastr.options.timeOut = 30000;
    toastr.options.extendedTimeOut = 60000;
    moodler.init("moodler");
    formHandler.init();
    notification.createInfo("Litte Helper", "Mistakes will be highlighted. Click on the highlighted area to know more about it.", "overview");
    setTimeout(function () {
        notification.createInfo("Domäne auswählen", "Bitte wählen Sie eine Domäne aus um Kontexthilfen zu erhalten", "overview");
    }, 1000);

    if (typeof(Storage) !== "undefined") {
        var save = localStorage.getItem("quicksave");
        if (save) {
            var modal = notification.createWarning("Hinweis", "<div class='row' style='margin-left: 0.33333%;'><p>Es wurde ein Modell wiederhergestellt. Soll es geladen werden?</p></div><div class='row col-md-offset-1' style=\"margin-left: 0.33333%;\"><div></div><button type='button' class='btn btn-raised btn-success btn-block' style='width: 45%; margin: 2.5%' id='reload'>Yes</button><button type='button' class='btn btn-raised btn-danger btn-block' style='width: 45%; margin: 2.5%' id='discard'>No</button></div>");
            modal.find("#reload").on("click", function () {
                moodler.fromJSON(save);
                if (moodler.getEntityList.length !== 0) {
                    localStorage.setItem("quicksave", "");
                }
            });
            modal.find("#discard").on("click", function () {
                localStorage.setItem("quicksave", "");
            });
        }
    } else {
        // Sorry! No Web Storage support..
    }


}

function startWelcomeTour(again) {
    // check cookie
    var visited = Cookies.get('visited');
    if (visited == null || again === true) {
        var trigger = $("body").find('[data-toggle="modal"]');
        trigger.click(function() {
            var theModal = $(this).data( "target" ),
                videoSRC = $(this).attr( "data-theVideo" ),
                videoSRCauto = videoSRC+"?autoplay=1" ;
            $(theModal+' iframe').attr('src', videoSRCauto);
            $(theModal+' button.close').click(function () {
                $(theModal+' iframe').attr('src', videoSRC);
            });
        });
        $('#videoBtn').click();
    }

    // set cookie
    Cookies.set('visited', 'value');

}