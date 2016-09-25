$(function () {
    restore_options();
});

$('#cb_sound, #txt_volumn').change(function () {
    if ($('#cb_sound').val() === 'custom' && $('#txt_custom').val() === '') {
        $('#cb_sound').val('offersound.ogg');
    }
    play_sound();
    save_options();
});

$('#txt_resultnumber').change(function () {
    $('#lb_resultnumber').text($(this).val());
    save_options();
});

$('#txt_historypagesize').change(function () {
    $('#lb_historypagesize').text($(this).val());
    save_options();
});

$('#ck_nof, #ck_nof_friend, #ck_nof_comment, #ck_quickBuy, #ck_quickSell, #ck_buySet, #ck_selectAll, #ck_offerdelay,' +
    ' #ck_autocheckofferprice, #ck_steamrep, #ck_simpify, #ck_totalrow, #ck_medium, #ck_autodecline, #ck_highlight,' +
    ' #ck_privateignore, #ck_privateblock, #ck_bookmarks, #ck_quickoffer, #ck_quickofferprompt, #ck_quickrefuse,' +
    ' #ck_quickrefuseprompt, #ck_hidedefaultprice, #ck_agp_hover, #ck_agp_gem, #ck_agp_sticker, #extprice, #extmasslisting,' +
    ' #ck_inventoryPrice, #ck_offertotalprice, #ck_tradableinfo'
).click(function () {
    save_options();
});

$('#txt_fastsell, #txt_offerdelay, #cb_currency, #cb_lang, #txt_delay, #txt_custom, #txt_ignore, #txt_block, #txt_apikey,' +
    ' #txt_qodelay, #txt_qrdelay, #txt_gpdelayscc, #txt_gpdelayerr, #extbgcolor, #exttextcolor, #extcustom'
).change(function () {
    save_options();
});

$('#cb_currency').change(function () {
    chrome.tabs.query({url: '*://steamcommunity.com/*'}, function (tabs) {

        $.each(tabs, function (idx, tab) {
            chrome.tabs.sendMessage(tab.id, {
                type: "updatecurency",
                currencyid: parseInt($('#cb_currency').val())
            }, function (response) {
            });
        });
    });
});

$('#extbgcolor,#exttextcolor').change(function () {
    chrome.tabs.query({url: '*://steamcommunity.com/*'}, function (tabs) {
        $.each(tabs, function (idx, tab) {
            chrome.tabs.sendMessage(tab.id, {
                type: "changeextcolor",
                colors: {extbgcolor: $('#extbgcolor').val(), exttextcolor: $('#exttextcolor').val()}
            }, function (response) {
            });
        });
    });
});

$('#ck_simpify').click(function () {
    chrome.tabs.query({url: '*://steamcommunity.com/*/inventory*'}, function (tabs) {
        $.each(tabs, function (idx, tab) {
            chrome.tabs.sendMessage(tab.id, {
                type: "changesimplify",
                simplify: $('#ck_simpify').is(':checked')
            }, function (response) {
            });
        });
    });
});

$('#bt_Clear').click(function () {
    chrome.storage.sync.set({
        lastIdx: 0,
        totalMinus: 0,
        totalPlus: 0,
        totalRows: 0
    });
});

$('#bt_resetrq').click(function () {
    chrome.storage.sync.set({
        ignoredfriends: 0,
        blockedfriends: 0
    });
    $('#sp_friendrequests').html('done');
    return false;
});

$('#lnk_reset').click(function (e) {
    e.preventDefault();
    if (!confirm('Are you sure?')) {
        return false;
    }
    reset_options();
});

$('#lnk_clearbookmarks').click(function (e) {
    e.preventDefault();
    if (!confirm('Are you sure?')) {
        return false;
    }

    chrome.storage.local.set({
        bookmarks: null
    }, function () {
    });
});

function play_sound() {
    var soundFile = $('#cb_sound').val();// document.getElementById('sound').value;
    if (soundFile != '' && soundFile != 'custom') {
        var sound = new Audio(chrome.extension.getURL('assets/' + soundFile));
        sound.volume = $('#txt_volumn').val() / 100.0;
        sound.play();
    } else if (soundFile == 'custom') {
        var sound = new Audio($('#txt_custom').val());
        sound.volume = $('#txt_volumn').val() / 100.0;
        sound.play();
    }
}

function save_options() {
    var sound = document.getElementById('cb_sound').value;
    if (parseInt($('#txt_delay').val()) < 100) {
        $('#txt_delay').val('100');
    }
    var extcustom = [];
    if ($('#extcustom').val()) {
        extcustom.push($('#extcustom').val());
    }
    chrome.storage.sync.set({
        sound: sound,
        soundvolumn: $('#txt_volumn').val(),
        resultnumber: $('#txt_resultnumber').val(),
        historypagesize: $('#txt_historypagesize').val(),
        fastdelta: $('#txt_fastsell').val(),
        delaylistings: $('#txt_delay').val(),
        offerdelayinterval: $('#txt_offerdelay').val(),
        showbookmarks: $('#ck_bookmarks').is(':checked'),
        shownotify: $('#ck_nof').is(':checked'),
        shownotify_friend: $('#ck_nof_friend').is(':checked'),
        shownotify_comment: $('#ck_nof_comment').is(':checked'),
        quickbuybuttons: $('#ck_quickBuy').is(':checked'),
        quicksellbuttons: $('#ck_quickSell').is(':checked'),
        selectallbuttons: $('#ck_selectAll').is(':checked'),
        offerdelay: $('#ck_offerdelay').is(':checked'),
        inventoryprice: $('#ck_inventoryPrice').is(':checked'),
        offertotalprice: $('#ck_offertotalprice').is(':checked'),
        autocheckofferprice: $('#ck_autocheckofferprice').is(':checked'),
        buysetbuttons: $('#ck_buySet').is(':checked'),
        steamrep: $('#ck_steamrep').is(':checked'),
        totalrow: $('#ck_totalrow').is(':checked'),
        currency: $('#cb_currency').val(),
        lang: $('#cb_lang').val(),
        usevector: $('#ck_medium').is(':checked'),
        simplyinvent: $('#ck_simpify').is(':checked'),
        customsound: $('#txt_custom').val(),
        ignorefriend: $('#txt_ignore').val(),
        blockfriend: $('#txt_block').val(),
        privateblock: $('#ck_privateblock').is(':checked'),
        privateignore: $('#ck_privateignore').is(':checked'),
        autodecline: $('#ck_autodecline').is(':checked'),
        highlight: $('#ck_highlight').is(':checked'),
        quickaccept: $('#ck_quickoffer').is(':checked'),
        quickacceptprompt: $('#ck_quickofferprompt').is(':checked'),
        quickrefuse: $('#ck_quickrefuse').is(':checked'),
        quickrefuseprompt: $('#ck_quickrefuseprompt').is(':checked'),
        hidedefaultprice: $('#ck_hidedefaultprice').is(':checked'),
        qadelay: $('#txt_qodelay').val(),
        qrdelay: $('#txt_qrdelay').val(),
        gpdelayscc: $('#txt_gpdelayscc').val(),
        gpdelayerr: $('#txt_gpdelayerr').val(),
        agp_hover: $('#ck_agp_hover').is(':checked'),
        agp_gem: $('#ck_agp_gem').is(':checked'),
        agp_sticker: $('#ck_agp_sticker').is(':checked'),
        extprice: $('#extprice').is(':checked'),
        extmasslisting: $('#extmasslisting').is(':checked'),
        extbgcolor: $('#extbgcolor').val(),
        exttextcolor: $('#exttextcolor').val(),
        extcustom: extcustom,
        apikey: $('#txt_apikey').val(),
        tradableinfo: $('#ck_tradableinfo').is(':checked')
    }, function () {
        // Update status to let user know options were saved.
        //var status = document.getElementById('status');
        //status.textContent = 'Options saved.';
        //setTimeout(function () {
        //    status.textContent = '';
        //}, 750);
    });
    var bg = chrome.extension.getBackgroundPage();
    if (bg && bg.setOptions) {
        bg.setOptions({sound: sound});
    }
}

function reset_options() {
    chrome.storage.sync.clear(function () {
        chrome.storage.sync.set({
            sound: 'offersound.ogg',
            soundvolumn: 100,
            resultnumber: 10,
            historypagesize: 10,
            showbookmarks: true,
            shownotify: true,
            shownotify_friend: false,
            shownotify_comment: false,
            quickbuybuttons: true,
            quicksellbuttons: true,
            selectallbuttons: true,
            buysetbuttons: true,
            inventoryprice: false,
            offertotalprice: false,
            steamrep: true,
            totalrow: true,
            fastdelta: -0.01,
            delaylistings: 200,
            offerdelay: true,
            autocheckofferprice: true,
            offerdelayinterval: 100,
            currency: '',
            lang: '',
            lastIdx: 0,
            totalMinus: 0,
            totalPlus: 0,
            totalRows: 0,
            usevector: false,
            simplyinvent: false,
            customsound: '',
            ignorefriend: 0,
            blockfriend: 0,
            ignoredfriends: 0,
            blockedfriends: 0,
            privateblock: false,
            privateignore: false,
            autodecline: true,
            highlight: true,
            quickaccept: false,
            quickacceptprompt: true,
            quickrefuse: false,
            quickrefuseprompt: true,
            hidedefaultprice: false,
            qadelay: 10,
            qrdelay: 10,
            gpdelayscc: 2500,
            gpdelayerr: 5000,
            agp_hover: true,
            agp_gem: true,
            agp_sticker: true,
            extprice: true,
            extmasslisting: false,
            extbgcolor: '#0000FF',
            exttextcolor: '#FFFFFF',
            extcustom: [],
            apikey: '',
            tradableinfo: false
        }, function () {
            restore_options();
        });
    });
}

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        sound: 'offersound.ogg',
        soundvolumn: 100,
        resultnumber: 10,
        historypagesize: 10,
        showbookmarks: true,
        shownotify: true,
        shownotify_friend: false,
        shownotify_comment: false,
        quickbuybuttons: true,
        quicksellbuttons: true,
        buysetbuttons: true,
        selectallbuttons: true,
        inventoryprice: false,
        offertotalprice: false,
        steamrep: true,
        totalrow: true,
        fastdelta: -0.01,
        delaylistings: 200,
        offerdelay: true,
        autocheckofferprice: true,
        offerdelayinterval: 100,
        currency: '',
        lang: '',
        lastIdx: 0,
        totalMinus: 0,
        totalPlus: 0,
        totalRows: 0,
        usevector: false,
        simplyinvent: false,
        customsound: '',
        ignorefriend: 0,
        blockfriend: 0,
        ignoredfriends: 0,
        blockedfriends: 0,
        privateblock: false,
        privateignore: false,
        autodecline: true,
        highlight: true,
        quickaccept: false,
        quickacceptprompt: true,
        quickrefuse: false,
        quickrefuseprompt: true,
        hidedefaultprice: false,
        qadelay: 10,
        qrdelay: 10,
        gpdelayscc: 2500,
        gpdelayerr: 5000,
        agp_hover: true,
        agp_gem: true,
        agp_sticker: true,
        extprice: true,
        extmasslisting: false,
        extbgcolor: '#0000FF',
        exttextcolor: '#FFFFFF',
        extcustom: [],
        apikey: '',
        tradableinfo: false
    }, function (items) {
        document.getElementById('cb_sound').value = items.sound;

        $('#txt_volumn').val(items.soundvolumn);
        $('#ck_nof').prop('checked', items.shownotify);
        $('#ck_nof_friend').prop('checked', items.shownotify_friend);
        $('#ck_nof_comment').prop('checked', items.shownotify_comment);
        $('#ck_quickBuy').prop('checked', items.quickbuybuttons);
        $('#ck_quickSell').prop('checked', items.quicksellbuttons);
        $('#ck_buySet').prop('checked', items.buysetbuttons);
        $('#ck_selectAll').prop('checked', items.selectallbuttons);
        $('#ck_steamrep').prop('checked', items.steamrep);
        $('#ck_totalrow').prop('checked', items.totalrow);
        $('#ck_offerdelay').prop('checked', items.offerdelay);
        $('#ck_autocheckofferprice').prop('checked', items.autocheckofferprice);
        $('#ck_bookmarks').prop('checked', items.showbookmarks);
        $('#txt_resultnumber').val(items.resultnumber);
        $('#lb_resultnumber').text(items.resultnumber);
        $('#txt_historypagesize').val(items.historypagesize);
        $('#lb_historypagesize').text(items.historypagesize);
        $('#txt_fastsell').val(items.fastdelta);
        $('#txt_delay').val(items.delaylistings);
        $('#txt_offerdelay').val(items.offerdelayinterval);
        $('#txt_custom').val(items.customsound);
        $('#cb_currency').val(items.currency);
        $('#cb_lang').val(items.lang);
        $('#ck_medium').prop('checked', items.usevector);
        $('#ck_simpify').prop('checked', items.simplyinvent);
        $('#ck_autodecline').prop('checked', items.autodecline);
        $('#ck_inventoryPrice').prop('checked', items.inventoryprice);
        $('#ck_offertotalprice').prop('checked', items.offertotalprice);
        $('#txt_ignore').val(items.ignorefriend);
        $('#txt_block').val(items.blockfriend);
        $('#ck_privateblock').prop('checked', items.privateblock);
        $('#ck_privateignore').prop('checked', items.privateignore);
        $('#sp_friendrequests').html(items.ignoredfriends + ' ignored, ' + items.blockedfriends + ' blocked');
        $('#ck_highlight').prop('checked', items.highlight);
        $('#ck_quickoffer').prop('checked', items.quickaccept);
        $('#ck_quickofferprompt').prop('checked', items.quickacceptprompt);
        $('#ck_quickrefuse').prop('checked', items.quickrefuse);
        $('#ck_quickrefuseprompt').prop('checked', items.quickrefuseprompt);
        $('#ck_hidedefaultprice').prop('checked', items.hidedefaultprice);
        $('#txt_qodelay').val(items.qadelay);
        $('#txt_qrdelay').val(items.qrdelay);
        $('#txt_gpdelayscc').val(items.gpdelayscc);
        $('#txt_gpdelayerr').val(items.gpdelayerr);
        $('#ck_agp_hover').prop('checked', items.agp_hover);
        $('#ck_agp_gem').prop('checked', items.agp_gem);
        $('#ck_agp_sticker').prop('checked', items.agp_sticker);
        $('#extprice').prop('checked', items.extprice);
        $('#extmasslisting').prop('checked', items.extmasslisting);
        $('#extbgcolor').val(items.extbgcolor);
        $('#exttextcolor').val(items.exttextcolor);
        $('#ck_tradableinfo').prop('checked', items.tradableinfo);
        if (items.extcustom && items.extcustom.length) {
            $('#extcustom').val(items.extcustom[0]);
        }
        $('#txt_apikey').val(items.apikey);
        //$('#spanInfo').html(items.lastIdx + '/' + items.totalRows + ' (' + items.totalPlus + ' - ' + items.totalMinus + ')');
    });
}

$(function () {
    chrome.browserAction.setPopup({
        popup: "html/popup.html"
    });
});
