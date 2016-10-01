var Background = (function () {
    function Background() {
    }
    Background.prototype.init = function () {
        this.listenForExternalMessages();
        this.listenInstallUpdate();
    };
    Background.prototype.listenForExternalMessages = function () {
        chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
            var storageManager = new StorageManager(request.params.storage);
            switch (request.method) {
                case Helper.getFromStorageMethod:
                    storageManager.getFromStorage(request.params.key, function (returnedValue) {
                        sendResponse({
                            data: returnedValue
                        });
                    });
                    break;
                case Helper.setToStorageMethod:
                    storageManager.setToStorage(request.params.key, request.params.value, function (returnAllData) {
                        sendResponse({
                            data: returnAllData
                        });
                    });
                    break;
                default:
                    return false;
            }
            return true;
        });
    };
    Background.prototype.listenInstallUpdate = function () {
        var storageManager = new StorageManager(StorageManager.storageSyncType);
        chrome.runtime.onInstalled.addListener(function (details) {
            var thisVersion = chrome.runtime.getManifest().version;
            if (details.reason === "install") {
                storageManager.setToStorage('extensionHasJustUpdated', true, function (data) {
                    console.log('Installed. User settings: ', data);
                    chrome.tabs.create({
                        url: 'http://thomaschampagne.github.io/stravistix/'
                    }, function (tab) {
                        console.log("First install. Display website new tab:", tab);
                        chrome.tabs.create({
                            url: chrome.extension.getURL('/options/app/index.html#/')
                        }, function (tab) {
                            console.log("First install. Display settings:", tab);
                        });
                    });
                });
            }
            else if (details.reason === "update") {
                console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
                storageManager = new StorageManager(StorageManager.storageSyncType);
                storageManager.setToStorage('extensionHasJustUpdated', true, function (data) {
                    console.log('Updated. User settings: ', data);
                    if (Helper.versionCompare('3.9.0', details.previousVersion) === 1) {
                        console.log('Reset zones...');
                        storageManager.setToStorage('userHrrZones', userSettings.userHrrZones, function (data) {
                            console.log('userHrrZones revert to ', userSettings.userHrrZones);
                            console.log(data);
                            storageManager.setToStorage('zones', userSettings.zones, function (data) {
                                console.log('zones revert to ', userSettings.zones);
                                console.log(data);
                            });
                        });
                    }
                });
            }
        });
    };
    return Background;
}());
var background = new Background();
background.init();
