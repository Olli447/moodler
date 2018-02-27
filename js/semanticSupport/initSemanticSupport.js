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

    $('#cardinality1').mask('0BZ', {
        translation: {
            'Z': {
                pattern: /[1-9]|[*]/, optional: false
            },
            'B': {
                pattern: /,/, optional: false
            }
        }
    });
    $('#cardinality2').mask('0BZ', {
        translation: {
            'Z': {
                pattern: /[1-9]|[*]/, optional: false
            },
            'B': {
                pattern: /,/, optional: false
            }
        }
    });

    var szenarioBtn = $('#szenarioBtn');
    szenarioBtn.click(function() {
        $('#szenarioModal').modal('show');
        $('#szenarioModal').on('hide.bs.modal', finalizeDomainModal);
        $('#editDomainButton').on('click', initEditDomains);
        initDomains();


    });
    startWelcomeTour();
    startToasts();
}

function startToasts(){
    //$.material.init();
    $('body').bootstrapMaterialDesign();

    var request = new XMLHttpRequest();
    request.open("GET", "json/szenario.json", false);
    request.send(null);
    autocomplete.sourceEntity = JSON.parse(request.responseText);

    toastr.options.progressBar = true;
    toastr.options.timeOut = 30000;
    toastr.options.extendedTimeOut = 60000;
    moodler.init("moodler");
    formHandler.init();
    notification.createInfo("Litte Helper", "Mistakes will be highlighted. Click on the highlighted area to know more about it.", "overview");

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

function startWelcomeTour(){
    // check cookie
    var visited = Cookies.get('visited');
    if (visited == null) {
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