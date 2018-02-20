window.notification = {
    activeToasts: [],
    observer: new MutationObserver(this.somethingChanged),
    createInfo: function (title, content, key) {

        var newToast = toastr.info(content, title);

        if (this.activeToasts.length === 0) {
            var config = {childList: true, subtree: true};
            this.observer.observe(document.getElementById("toast-container"), config);
        }

        var id = generateUUID();
        newToast.attr('data-id', id);

        this.activeToasts.push({
            key: key,
            toast: newToast,
            events: [],
            type: "info",
            id: id
        });

        return newToast;
    },
    createError: function (title, content, key) {
        var newToast = toastr.error(content, title);

        if (this.activeToasts.length === 0) {
            var config = {childList: true, subtree: true};
            this.observer.observe(document.getElementById("toast-container"), config);
        }

        var id = generateUUID();
        newToast.attr('data-id', id);

        this.activeToasts.push({
            key: key,
            toast: newToast,
            events: [],
            type: "error",
            id: id
        });

        return newToast;
    },
    createWarn: function (title, content, key) {
        var newToast = toastr.warn(content, title);

        if (this.activeToasts.length === 0) {
            var config = {childList: true, subtree: true};
            this.observer.observe(document.getElementById("toast-container"), config);
        }

        var id = generateUUID();
        newToast.attr('data-id', id);

        this.activeToasts.push({
            key: key,
            toast: newToast,
            events: [],
            type: "warn",
            id: id
        });

        return newToast;
    },
    addEventListener: function (toast, type, callback) {
        for (var i = 0, len = notification.activeToasts.length; i < len; i++) {
            if (this.activeToasts[i].id === toast.attr("data-id")) {
                type === "keydown" ? document.addEventListener(type, callback) : this.activeToasts[i].toast.addEventListener(type, callback);
                this.activeToasts[i].events.push({
                    type: type,
                    callback: callback
                });
                break;
            }
        }


    },
    destroyToast: function (toast, isEvent) {
        if (isEvent) {
            for (var i = 0, len = this.activeToasts.length; i < len; i++) {
                var item = this.activeToasts[i];
                if (this.activeToasts[i].id === toast) {
                    this.activeToasts.splice(i, 1);
                    break;
                }
            }
        }
        else {
            for (var i = 0, len = this.activeToasts.length; i < len; i++) {
                var item = this.activeToasts[i];
                if (this.activeToasts[i].id === toast.attr("data-id")) {
                    for (var j = 0, len2 = item.events.length; j < len2; j++) {
                        var event = item.event[j];
                        document.removeEventListener(event.type, event.callback)
                    }
                    if (!isEvent)
                        toastr.clear(item.toast);
                    this.activeToasts.splice(i, 1);
                    break;
                }
            }
        }
    },
    destroyToastForKey: function (key) {
        for (var i = 0, len = this.activeToasts.length; i < len; i++) {
            var item = this.activeToasts[i];
            if (this.activeToasts[i].key === key) {
                for (var j = 0, len2 = item.events.length; j < len2; j++) {
                    var event = item.event[j];
                    event.removeEventListener(event.type, event.callback)
                }
                toastr.clear(item.toast);
                this.activeToasts.splice(i, 1);
            }
        }
    }
};

function somethingChanged(mutations) {
    for (var i = 0, len = mutations.length; i < len; i++) {
        for (var j = 0, len2 = mutations[i].removedNodes.length; j < len2; j++) {
            notification.destroyToast(mutations[i].removedNodes[j].dataset.id, true);
        }
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
