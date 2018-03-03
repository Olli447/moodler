window.autocomplete = {
    szenario: "healthcare",
    sourceEntity: {},
    search: function (query, callback) {
        var matches, substrRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(query, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(entityArray, function (i, obj) {
            if (substrRegex.test(obj.name)) {
                matches.push(obj.name);
            }
        });

        callback(matches);
    }
};