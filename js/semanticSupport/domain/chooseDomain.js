var domains = [];
var waitElementClone;

function initDomains() {
    waitElementClone = document.getElementById("waitDomain").cloneNode(false);
    if (domains.length !== 0)
        return;

    loadDomains();
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
    if (pre) {
        if (isLoggedIn) {
            success.style.display = "block";
            setTimeout(function () {
                document.getElementById("domainLoginForm").reset();
                success.style.display = "none";
                modal = $("#domainLogin").modal('hide');
                $('#szenarioModal').modal('show');
                initDomains();
            }, 1000);
        }
    } else {
        login(username, passwort,
            function (response) {
                success.style.display = "block";
                domainApiKey = response.token.replace("JWT ", "");
                setTimeout(function () {
                    document.getElementById("domainLoginForm").reset();
                    success.style.display = "none";
                    modal = $("#domainLogin").modal('hide');
                    $('#szenarioModal').modal('show');
                    initDomains();
                }, 1000);
            },
            function (response) {
                error.style.display = "block";
                setTimeout(function () {
                    document.getElementById("domainLoginForm").reset();
                    error.style.display = "none";
                }, 1000);
            });
    }

    return false;

}

function loadDomains() {
    makeRequest(
        DOMAIN,
        function (response) {
            availableDomains = [];
            for (var i = 0; i < response.domains; i++) {
                availableDomains[i] = response.domains[i].id;
            }
            domainListCallback(response.domains);
        },
        function (response) {
            console.log("Connection to Server to load domains failed");
        },
        {
            type: 'GET'
        }
    );
}

function domainListCallback(domains) {
    var title = document.getElementById("szenarioModal").querySelector(".heading");
    var body = document.getElementById("szenarioModal").querySelector(".modal-body").querySelector(".container-fluid");
    var waitElement = document.getElementById("waitDomain");
    var row = [];

    if (domains.length === 0) {
        waitElement.innerText = "Es sind keine verfügbaren Domänen gefunden worden!"

        if (isLoggedIn) {
            var clearfix = document.createElement("div");
            clearfix.classList.add("row");
            clearfix.classList.add("text-center");
            var col = document.createElement("div");
            col.classList.add("col-12");
            var createNewContainer = document.createElement("label");
            createNewContainer.classList.add("btn");
            createNewContainer.classList.add("btn-outline-primary");
            createNewContainer.classList.add("btn-file");
            createNewContainer.innerText = "Domäne erstellen";
            var createNew = document.createElement("input");
            createNew.type = "file";
            createNew.style = "display:none;";
            createNew.addEventListener("change", createDomainHandler);
            createNewContainer.appendChild(createNew);
            col.appendChild(createNewContainer);
            clearfix.appendChild(col);
            body.appendChild(clearfix);

            var loginButton = $('#editDomainButton');
            loginButton.html("Ausloggen");
            loginButton.off('click', initEditDomains);
            loginButton.on('click', logoutDomain);
        }
    }
    else {
        if (isLoggedIn) {
            for (var i = 0, len_i = domains.length % 4; i < len_i; i++) {
                row[i] = document.createElement("div");
                row[i].classList.add("row");
                for (var j = i * 4, len_j = j + 4; j < len_j; j++) {
                    if (domains[j] !== undefined) {
                    var col = document.createElement("div");
                        col.classList.add("col-md-3");

                    var subCol1 = document.createElement("div");
                        subCol1.classList.add("row");
                        subCol1.classList.add("no-margin");

                    var button = document.createElement("button");
                    button.classList.add("btn");
                    button.classList.add("btn-outline-primary");
                        button.classList.add("btn-block");
                        button.style.whiteSpace = "normal";
                    button.type = "button";
                    button.innerText = domains[j].name;
                    button.setAttribute("data-id", domains[j].id);
                        button.addEventListener("click", getDomainHandler);
                    col.appendChild(button);

                        var button2Container = document.createElement("label");
                        button2Container.classList.add("btn");
                        button2Container.classList.add("btn-outline-warning");
                        button2Container.style.width = "50%";
                        button2Container.classList.add("btn-file");
                        button2Container.innerHTML = "<i class='fa fa-pencil'></i>";
                        button2Container.setAttribute("data-id", domains[j].id);
                        var button2 = document.createElement("input");
                        button2.type = "file";
                        button2.style = "display:none;";
                        button2.addEventListener("change", updateDomainHandler);
                        button2Container.appendChild(button2);

                        subCol1.appendChild(button2Container);

                    var button3 = document.createElement("button");
                    button3.classList.add("btn");
                        button3.classList.add("btn-outline-danger");
                        button3.style.width = "50%";
                    button3.type = "button";
                    button3.innerHTML = "<i class='fa fa-trash'></i>";
                    button3.setAttribute("data-id", domains[j].id);
                        button3.addEventListener("click", deleteDomainHandler);
                        subCol1.appendChild(button3);


                        col.appendChild(subCol1);

                    row[i].appendChild(col);
                    }
                }

                body.appendChild(row[i]);
            }

            var clearfix2 = document.createElement("div");
            clearfix2.classList.add("row");
            clearfix2.classList.add("text-center");
            var col2 = document.createElement("div");
            col2.classList.add("col-12");

            var createNewContainer2 = document.createElement("label");
            createNewContainer2.classList.add("btn");
            createNewContainer2.classList.add("btn-outline-primary");
            createNewContainer2.classList.add("btn-file");
            createNewContainer2.innerText = "Domäne erstellen";
            var createNew2 = document.createElement("input");
            createNew2.type = "file";
            createNew2.style = "display:none;";
            createNew2.addEventListener("change", createDomainHandler);
            createNewContainer2.appendChild(createNew2);

            col2.appendChild(createNewContainer2);
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
                for (var j = i * 4, len_j = j + 4; j < len_j; j++) {
                    if (domains[j] !== undefined) {
                        var col = document.createElement("div");
                        col.classList.add("col-md-3");

                        var button = document.createElement("button");
                        button.classList.add("btn");
                        button.classList.add("btn-outline-primary");
                        button.classList.add("btn-block");
                        button.style.whiteSpace = "normal";
                        button.type = "button";
                        button.innerText = domains[j].name;
                        button.setAttribute("data-id", domains[j].id);
                        button.addEventListener("click", getDomainHandler);
                        col.appendChild(button);

                        row[i].appendChild(col);
                    }
                }

                body.appendChild(row[i]);
            }
        }

        body.removeChild(waitElement);
    }


}

function getDomain(id) {
    makeRequest(
        DOMAIN + id,
        function (response) {
            readAll(response.data);
            $('#szenarioModal').modal('hide');

            readAll(response.data);
            var currentDomain = $("#currentDomain");
            currentDomain.find(".name").text(response.name);
            currentDomain.find(".id").text(response.id);
            domainDetails.name = response.name;
            domainDetails.id = response.id
        },
        function (response) {
            console.log("Error while loading domain");
        },
        {
            type: 'GET'
        }
    );
}

function createDomain(name, data) {
    makeRequest(
        DOMAIN,
        function (response) {
            $('#szenarioModal').modal('hide');
            getDomain(response.id);
        },
        function (response) {
            console.log("Error while loading domain");
            console.log(response.responseJSON.error)
        },
        {
            type: 'POST'
        },
        {
            name: name,
            data: data
        }
    );
}

function updateDomain(id, name, data) {
    makeRequest(
        DOMAIN + id,
        function (response) {
            getDomain(id);
            $('#szenarioModal').modal('hide');
            alert(response.message);
        },
        function (response) {
            console.log("Error while loading domain");
        },
        {
            type: 'PUT'
        },
        {
            name: name,
            data: data
        }
    );
}

function deleteDomain(id) {
    makeRequest(
        DOMAIN + id,
        function (response) {
            $('#szenarioModal').modal('hide');
            alert("Domain gelöscht!");
        },
        function (response) {
            if (response.status === 200) {
                $('#szenarioModal').modal('hide')

                entityArray = [];
                relationArray = [];
                specialArray = [];
                var currentDomain = $("#currentDomain");
                currentDomain.find(".name").text("");
                currentDomain.find(".id").text("");
                domainDetails.name = "";
                domainDetails.id = "";

                alert("Domäne gelöscht!");
            } else {
                alert("Es ist ein Fehler aufgetreten\nStatus: " + response.status);
            }

        },
        {
            type: 'DELETE'
        }
    );
}

function setAdminHeader(xhr) {
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', domainApiKey);
}

function logoutDomain() {
    logout();
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

function createDomainHandler(event) {
    var files = event.target.files;
    if (files.length === 0) {
        alert("Es muss eine Datei  ausgewählt werden!");
        return;
    }
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function (event) {
        var name = files[0].name;
        name = name.replace(/\.[^/\\.]+$/, "");
        createDomain(name, event.target.result);
    };
}

function updateDomainHandler(event) {
    var id = event.target.parentNode.getAttribute("data-id");
    var files = event.target.files;
    if (files.length === 0) {
        alert("Es muss eine Datei  ausgewählt werden!");
        return;
    }
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function (event) {
        var name = files[0].name;
        name = name.replace(/\.[^/\\.]+$/, "");
        updateDomain(id, name, event.target.result);
    };
}

function getDomainHandler(event) {
    var id = event.currentTarget.getAttribute("data-id");
    getDomain(id);
}

function deleteDomainHandler(event) {
    var id = event.currentTarget.getAttribute("data-id");
    if (confirm('Soll das Modell wirklich entfernt werden?')) {
        deleteDomain(id);
    } else {
        // Do nothing!
    }
}