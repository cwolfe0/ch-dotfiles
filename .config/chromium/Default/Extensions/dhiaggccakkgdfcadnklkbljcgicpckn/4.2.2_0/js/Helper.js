var Helper = (function () {
    function Helper() {
    }
    Helper.getSpeedUnitData = function () {
        var measurementPreference = window.currentAthlete.get('measurement_preference');
        var units = (measurementPreference == 'meters') ? 'km' : 'mi';
        var speedUnitPerHour = (measurementPreference == 'meters') ? 'km/h' : 'mi/h';
        var speedUnitFactor = (speedUnitPerHour == 'km/h') ? 1 : Helper.KPH_TO_MPH_RATIO;
        var speedUnitData = {
            speedUnitPerHour: speedUnitPerHour,
            speedUnitFactor: speedUnitFactor,
            units: units
        };
        return speedUnitData;
    };
    Helper.HHMMSStoSeconds = function (str) {
        var p = str.split(':'), s = 0, m = 1;
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    };
    Helper.secondsToHHMMSS = function (secondsParam, trimLeadingZeros) {
        var secNum = secondsParam;
        var hours = Math.floor(secNum / 3600);
        var minutes = Math.floor((secNum - (hours * 3600)) / 60);
        var seconds = secNum - (hours * 3600) - (minutes * 60);
        var time = ((hours < 10) ? "0" + hours.toFixed(0) : hours.toFixed(0));
        time += ':' + ((minutes < 10) ? "0" + minutes.toFixed(0) : minutes.toFixed(0));
        time += ':' + ((seconds < 10) ? "0" + seconds.toFixed(0) : seconds.toFixed(0));
        return (trimLeadingZeros ? Helper.trimLeadingZerosHHMMSS(time) : time);
    };
    Helper.trimLeadingZerosHHMMSS = function (time) {
        var result = time.replace(/^(0*:)*/, '').replace(/^0*/, '') || "0";
        if (result.indexOf(":") < 0) {
            return result + "s";
        }
        return result;
    };
    Helper.weightedPercentiles = function (values, weights, percentiles) {
        var list = [];
        var tot = 0;
        for (var i = 0; i < values.length; i++) {
            list.push({ value: values[i], weight: weights[i] });
            tot += weights[i];
        }
        list.sort(function (a, b) {
            return a.value - b.value;
        });
        var result = [];
        for (var i = 0; i < percentiles.length; i++) {
            result.push(0);
        }
        var cur = 0;
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < percentiles.length; j++) {
                if (cur < percentiles[j] * tot && (cur + list[i].weight) > (percentiles[j] - 0.00001) * tot) {
                    result[j] = list[i].value;
                }
            }
            cur += list[i].weight;
        }
        return result;
    };
    Helper.heartrateFromHeartRateReserve = function (hrr, maxHr, restHr) {
        return parseFloat((hrr / 100 * (maxHr - restHr) + restHr).toFixed(0));
    };
    ;
    Helper.heartRateReserveFromHeartrate = function (hr, maxHr, restHr) {
        return (hr - restHr) / (maxHr - restHr);
    };
    ;
    Helper.setToStorage = function (extensionId, storageType, key, value, callback) {
        chrome.runtime.sendMessage(extensionId, {
            method: Helper.setToStorageMethod,
            params: {
                storage: storageType,
                'key': key,
                'value': value
            }
        }, function (response) {
            if (callback) {
                callback(response);
            }
        });
    };
    ;
    Helper.getFromStorage = function (extensionId, storageType, key, callback) {
        chrome.runtime.sendMessage(extensionId, {
            method: Helper.getFromStorageMethod,
            params: {
                storage: storageType,
                'key': key
            }
        }, function (response) {
            callback(response);
        });
    };
    ;
    Helper.formatNumber = function (n, c, d, t) {
        c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t;
        var s = n < 0 ? "-" : "";
        var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
        var j;
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    ;
    Helper.secondsToDHM = function (sec_num, trimZeros) {
        var days = Math.floor(sec_num / 86400);
        var hours = Math.floor((sec_num - (days * 86400)) / 3600);
        var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
        if (trimZeros && days === 0) {
            if (hours === 0) {
                return minutes + 'm';
            }
            return hours + 'h ' + minutes + 'm';
        }
        return days + 'd ' + hours + 'h ' + minutes + 'm';
    };
    ;
    Helper.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    ;
    Helper.versionCompare = function (v1, v2, options) {
        var lexicographical = options && options.lexicographical, zeroExtend = options && options.zeroExtend, v1parts = v1.split('.'), v2parts = v2.split('.');
        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }
        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }
        if (zeroExtend) {
            while (v1parts.length < v2parts.length)
                v1parts.push("0");
            while (v2parts.length < v1parts.length)
                v2parts.push("0");
        }
        if (!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }
        for (var i = 0; i < v1parts.length; ++i) {
            if (v2parts.length == i) {
                return 1;
            }
            if (v1parts[i] == v2parts[i]) {
                continue;
            }
            else if (v1parts[i] > v2parts[i]) {
                return 1;
            }
            else {
                return -1;
            }
        }
        if (v1parts.length != v2parts.length) {
            return -1;
        }
        return 0;
    };
    Helper.KPH_TO_MPH_RATIO = 0.621371;
    Helper.getFromStorageMethod = 'getFromStorage';
    Helper.setToStorageMethod = 'setToStorage';
    return Helper;
}());
