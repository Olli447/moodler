var domainApiKey = "";
var domains = [];
var waitElementClone;

function initDomains() {
    waitElementClone = document.getElementById("waitDomain").cloneNode(false);
    if (domains.length !== 0)
        return;

    var uri = "http://132.252.51.194:3000/api/auth/";
    //var uri = "http://localhost:3000/api/auth/";

    var xhr = $.ajax({
        url: encodeURI(uri + "check"),
        type: 'GET',
        dataType: 'json',
        beforeSend: identify.setHeader,
        error: function (response) {
            console.log("No key acquired yet!");
            $.ajax({
                url: encodeURI(uri + "login"),
                type: 'POST',
                dataType: 'json',
                data: {username: "public", password: "public"},
                beforeSend: identify.setHeader,
                error: function (response) {
                    console.log("Login failed!");
                },
                success: function (response) {
                    var apiKey = response.token.replace("JWT ", "");
                    identify.apiKey = apiKey;
                    loadDomains(identify.apiKey)
                }
            });
        },
        success: function (response) {
            loadDomains(identify.apiKey)
        }
    });
}

function initEditDomains(event) {
    var modal = $(event.target).parent().parent().parent().parent();
    modal.modal('hide');

    modal = $("#domainLogin").modal('show');
    setTimeout(function () {
        domainLogin(true)
    }, 500);


}

function domainLogin(pre) {
    var username = document.getElementById("usernameDomain").value;
    var passwort = document.getElementById("passwordDomain").value;
    var success = document.getElementById("success");
    var error = document.getElementById("error");
    pre === undefined ? pre = false : pre;

    var uri = "http://132.252.51.194:3000/api/auth/";
    //var uri = "http://localhost:3000/api/auth/";

    var xhr = $.ajax({
        url: encodeURI(uri + "check"),
        type: 'GET',
        dataType: 'json',
        beforeSend: setAdminHeader,
        error: function (response) {
            console.log("No key acquired yet!");

            if (!pre) {
                $.ajax({
                    url: encodeURI(uri + "login"),
                    type: 'POST',
                    dataType: 'json',
                    data: {username: username, password: passwort},
                    beforeSend: setAdminHeader,
                    error: function (response) {
                        error.style.display = "block";
                        setTimeout(function () {
                            document.getElementById("domainLoginForm").reset();
                            error.style.display = "none";
                        }, 1000);
                    },
                    success: function (response) {
                        success.style.display = "block";
                        domainApiKey = response.token.replace("JWT ", "");
                        setTimeout(function () {
                            document.getElementById("domainLoginForm").reset();
                            success.style.display = "none";
                            modal = $("#domainLogin").modal('hide');
                            $('#szenarioModal').modal('show');
                            initDomains();
                        }, 1000);
                    }
                });
            }

        },
        success: function (response) {
            //Wenn du hier landest bist du schon angemeldet. Man muesste es nur vorher testen ^^
            success.style.display = "block";
            setTimeout(function () {
                document.getElementById("domainLoginForm").reset();
                error.style.display = "none";
                modal = $("#domainLogin").modal('hide');
                $('#szenarioModal').modal('show');
                initDomains();
            }, 1000);
        }
    });

    return false;

}

function loadDomains() {
    var uri = "http://132.252.51.194:3000/api/domain/";
    //var uri = "http://localhost:3000/api/domain/";

    var xhr = $.ajax({
        url: encodeURI(uri),
        type: 'GET',
        dataType: 'json',
        data: {},
        beforeSend: identify.setHeader,
        error: function (response) {
            console.log("Connection to Server to load domains failed")
        },
        success: function (response) {
            domainListCallback(response.domains)
        }
    })
}

function domainListCallback(domains) {
    var title = document.getElementById("szenarioModal").querySelector(".heading");
    var body = document.getElementById("szenarioModal").querySelector(".modal-body").querySelector(".container-fluid");
    var waitElement = document.getElementById("waitDomain");
    var row;

    if (domains.length === 0) {
        waitElement.innerText = "Es sind keine verfügbaren Domänen gefunden worden!"

        if (domainApiKey) {
            var clearfix = document.createElement("div");
            clearfix.classList.add("row");
            clearfix.classList.add("text-center");
            var col = document.createElement("div");
            col.classList.add("col-12");
            var createNew = document.createElement("button");
            createNew.classList.add("btn");
            createNew.classList.add("btn-outline-primary");
            createNew.type = "button";
            createNew.innerText = "Domain erstellen";
            createNew.addEventListener("click", createDomain);
            col.appendChild(createNew);
            clearfix.appendChild(col);
            body.appendChild(clearfix);

            var loginButton = $('#editDomainButton');
            loginButton.html("Ausloggen");
            loginButton.off('click', initEditDomains);
            loginButton.on('click', logoutDomain);
        }
    }
    else {
        if (domainApiKey) {
            for (var i = 0, len_i = domains.length % 4; i < len_i; i++) {
                row[i] = document.createElement("div");
                row[i].classList.add("row");
                for (var j = i * 4, len_j = j + 4; i < len_j; j++) {
                    var col = document.createElement("div");
                    col.classList.add("col");

                    var subrow = document.createElement("div");
                    subCol2.classList.add("row");
                    var subCol1 = document.createElement("div");
                    subCol1.classList.add("col");
                    var subCol2 = document.createElement("div");
                    subCol2.classList.add("col");

                    var button = document.createElement("button");
                    button.classList.add("btn");
                    button.classList.add("btn-outline-primary");
                    button.type = "button";
                    button.innerText = domains[j].name;
                    button.setAttribute("data-id", domains[j].id);
                    button.addEventListener("click", getDomain);
                    col.appendChild(button);

                    var button2 = document.createElement("button");
                    button2.classList.add("btn");
                    button2.classList.add("btn-outline-warning");
                    button2.type = "button";
                    button2.innerHTML = "<i class='fa fa-pen'></i>";
                    button2.setAttribute("data-id", domains[j].id);
                    button2.addEventListener("click", updateDomain);
                    subCol1.appendChild(button2);

                    var button3 = document.createElement("button");
                    button3.classList.add("btn");
                    button3.classList.add("btn-outline-error");
                    button3.type = "button";
                    button3.innerHTML = "<i class='fa fa-trash'></i>";
                    button3.setAttribute("data-id", domains[j].id);
                    //button.addEventListener("click", deleteDomain);
                    subCol2.appendChild(button3);

                    subrow.appendChild(subCol1);
                    subrow.appendChild(subCol2);

                    row[i].appendChild(col);
                    row[i].appendChild(subrow);
                }

                body.appendChild(row[j]);
            }

            var clearfix2 = document.createElement("div");
            clearfix2.classList.add("row");
            clearfix2.classList.add("text-center");
            var col2 = document.createElement("div");
            col2.classList.add("col-12");
            var createNew2 = document.createElement("button");
            createNew2.classList.add("btn");
            createNew2.classList.add("btn-outline-primary");
            createNew2.type = "button";
            createNew2.innerText = "Domain erstellen";
            createNew2.addEventListener("click", createDomain);
            col2.appendChild(createNew2);
            clearfix2.appendChild(col2);
            body.appendChild(clearfix2);

            var loginButton = $('#editDomainButton');
            loginButton.html("Ausloggen");
            loginButton.off('click', initEditDomains);
            loginButton.on('click', logoutDomain);

        } else {
            for (var i = 0, len_i = domains.length % 4; i < len_i; i++) {
                row[i] = document.createElement("div");
                row[i].classList.add("row");
                for (var j = i * 4, len_j = j + 4; i < len_j; j++) {
                    var col = document.createElement("div");
                    col.classList.add("col");

                    var button = document.createElement("button");
                    button.classList.add("btn");
                    button.classList.add("btn-outline-primary");
                    button.type = "button";
                    button.innerText = domains[j].name;
                    button.setAttribute("data-id", domains[j].id);
                    button.addEventListener("click", getDomain);
                    col.appendChild(button);

                    row[i].appendChild(col);
                }

                body.appendChild(row[j]);
            }
        }

        body.removeChild(waitElement);
    }


}

function getDomain() {

}

function domainCallback() {

}

function createDomain() {

}

function updateDomain() {

}

function setAdminHeader(xhr) {
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', domainApiKey);
}

function logoutDomain() {
    domainApiKey = undefined;
    $('#szenarioModal').modal('hide');
}

function finalizeDomainModal(modal) {
    var body = document.getElementById("szenarioModal").querySelector(".modal-body").querySelector(".container-fluid");

    var loginButton = $('#editDomainButton');
    loginButton.html("Einloggen");
    loginButton.off('click', logoutDomain);
    loginButton.on('click', initEditDomains);

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    body.appendChild(waitElementClone);
}