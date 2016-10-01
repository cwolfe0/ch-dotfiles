var StorageManager = (function () {
    function StorageManager(storageType) {
        this.storageType = storageType;
    }
    StorageManager.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    };
    StorageManager.setCookieSeconds = function (cname, cvalue, seconds) {
        var d = new Date();
        d.setTime(d.getTime() + (seconds * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    };
    StorageManager.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1);
            if (c.indexOf(name) != -1)
                return c.substring(name.length, c.length);
        }
        return null;
    };
    StorageManager.prototype.getFromStorage = function (key, callback) {
        console.debug('GETTING: ' + key);
        this.hasChromeLastError();
        if (this.storageType === 'sync') {
            chrome.storage.sync.get(userSettings, function (userSettingsResponseData) {
                console.log(userSettingsResponseData);
                var result = userSettingsResponseData[key];
                result = (typeof result === 'undefined') ? null : result;
                console.debug('HAS BEEN GET: ' + key + ' has value of: ', result);
                callback(result);
            });
        }
        else if (this.storageType === 'local') {
            chrome.storage.local.get([key], function (value) {
                value = value[key];
                value = (typeof value === 'undefined') ? null : value;
                callback(value);
            });
        }
        else {
            console.error('Storage type not available');
        }
    };
    StorageManager.prototype.setToStorage = function (key, value, callback) {
        console.debug('SETTING: ' + key + '=' + value);
        this.hasChromeLastError();
        if (this.storageType === 'sync') {
            chrome.storage.sync.get(userSettings, function (userSettingsResponseData) {
                userSettingsResponseData[key] = value;
                chrome.storage.sync.set(userSettingsResponseData, function () {
                    chrome.storage.sync.get(userSettings, function (userSettingsResponseData) {
                        console.debug('HAS BEEN SET: ' + key + ' has now value of: ', userSettingsResponseData[key]);
                        callback(userSettingsResponseData);
                    });
                });
            });
        }
        else if (this.storageType === 'local') {
            chrome.storage.local.get(null, function (allData) {
                allData[key] = value;
                chrome.storage.local.set(allData);
                callback(allData);
            });
        }
        else {
            console.error('Storage type not available');
        }
    };
    StorageManager.prototype.hasChromeLastError = function () {
        if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
        }
    };
    StorageManager.prototype.printStorage = function () {
        if (this.storageType === 'sync') {
            chrome.storage.sync.get(null, function (data) {
                console.log(data);
            });
        }
        else if (this.storageType === 'local') {
            chrome.storage.local.get(null, function (data) {
                console.log(data);
            });
        }
        else {
            console.error('Storage type not available');
        }
    };
    StorageManager.storageSyncType = 'sync';
    StorageManager.storageLocalType = 'local';
    return StorageManager;
}());
