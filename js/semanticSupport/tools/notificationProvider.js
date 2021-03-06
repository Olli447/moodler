window.notification = {
    activeToasts: [],
	enterEventToast: null,
    observer: new MutationObserver(this.somethingChanged),
    createInfo: function (title, content, key) {

        if (!semanticSupportEnabled) {
            return null;
        }

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

        if (!semanticSupportEnabled) {
            return null;
        }

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
    createWarning: function (title, content, key) {

        if (!semanticSupportEnabled) {
            return null;
        }

        var newToast = toastr.warning(content, title);

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
	addEventListener: function (toast, type, callback, isEnter) {
        if (!semanticSupportEnabled) {
            return;
        }
		if (isEnter == undefined) {
			this.isEnter = false;
		}
		var id = toast.attr("data-id");

        for (var i = 0, len = notification.activeToasts.length; i < len; i++) {
	        if (this.activeToasts[i].id === id) {
                type === "keydown" ? setTimeout(function () {
	                for (var j = 0, len = notification.activeToasts.length; j < len; j++) {
		                var tmpToast = notification.activeToasts[j];
		                for (var o = 0; o < tmpToast.events.length; o++) {
			                var event = tmpToast.events[o];
			                if (isEnter && id !== tmpToast.id)
				                document.removeEventListener(event.type, event.callback);
		                }
	                }

                    document.addEventListener(type, callback);
                }, 500) : this.activeToasts[i].toast.addEventListener(type, callback);
                this.activeToasts[i].events.push({
                    type: type,
	                callback: callback,
	                isEnter: isEnter
                });
                break;
            }
        }


    },
    destroyToast: function (toast, isEvent) {
        if (isEvent) {
            for (var i = 0, len = this.activeToasts.length; i < len; i++) {
                var item = this.activeToasts[i];

                if (!item)
                    continue;

                if (this.activeToasts[i].id === toast.dataset.id) {
                    this.activeToasts.splice(i, 1);

                    for (var j = 0, len2 = item.events.length; j < len2; j++) {
                        var type = item.events[j].type;
                        var callback = item.events[j].callback;

                        if (type == "keydown") {
                            document.removeEventListener(type, callback)
                        } else {
                            toast.removeEventListener(type, callback);
                        }
                    }

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

            if (!item)
                continue;

            if (this.activeToasts[i].key === key) {
	            if (item.event) {
		            for (var j = 0, len2 = item.events.length; j < len2; j++) {
			            var event = item.event[j];
			            event.removeEventListener(event.type, event.callback)
		            }
	            }
                toastr.clear(item.toast);
                this.activeToasts.splice(i, 1);
            }
        }
    },

    destroyAll: function () {
        for (var i = 0, len = this.activeToasts.length; i < len; i++) {
            var item = this.activeToasts[i];

            if (!item)
                continue;

	        if (item.event) {
		        for (var j = 0, len2 = item.events.length; j < len2; j++) {
			        var event = item.event[j];
			        event.removeEventListener(event.type, event.callback)
		        }
            }
            toastr.clear(item.toast);
            this.activeToasts.splice(i, 1);
        }
    }
};

function somethingChanged(mutations) {
    for (var i = 0, len = mutations.length; i < len; i++) {
        for (var j = 0, len2 = mutations[i].removedNodes.length; j < len2; j++) {
            notification.destroyToast(mutations[i].removedNodes[j], true);
        }
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
