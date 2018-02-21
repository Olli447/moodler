function finalizeGUI(){
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