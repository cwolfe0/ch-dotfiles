var StravistiX = (function () {
    function StravistiX(userSettings, appResources) {
        this._userSettings = userSettings;
        this.appResources = appResources;
        this.extensionId = this.appResources.extensionId;
        this.vacuumProcessor = new VacuumProcessor();
        this.activityProcessor = new ActivityProcessor(this.appResources, this.vacuumProcessor, this._userSettings);
        this.athleteId = this.vacuumProcessor.getAthleteId();
        this.athleteName = this.vacuumProcessor.getAthleteName();
        this.athleteIdAuthorOfActivity = this.vacuumProcessor.getAthleteIdAuthorOfActivity();
        this.isPremium = this.vacuumProcessor.getPremiumStatus();
        this.isPro = this.vacuumProcessor.getProStatus();
        this.activityId = this.vacuumProcessor.getActivityId();
        this.init();
        if (StravistiX.instance == null) {
            StravistiX.instance = this;
        }
    }
    StravistiX.prototype.init = function () {
        if (this.handleForwardToWWW()) {
            return;
        }
        if (this._userSettings.extensionHasJustUpdated || env.forceUpdated) {
            this.handleExtensionHasJustUpdated();
        }
        if (env.preview) {
            this.handlePreviewRibbon();
        }
        if (this._userSettings.localStorageMustBeCleared) {
            localStorage.clear();
            Helper.setToStorage(this.extensionId, StorageManager.storageSyncType, 'localStorageMustBeCleared', false, function (response) {
                console.log('localStorageMustBeCleared is now ' + response.data.localStorageMustBeCleared);
            });
        }
        if (env.debugMode)
            console.log("Handling " + window.location.pathname);
        this.handleMenu();
        this.handleRemoteLinks();
        this.handleWindyTyModifier();
        this.handleReliveCCModifier();
        this.handleActivityScrolling();
        this.handleDefaultLeaderboardFilter();
        this.handleSegmentRankPercentage();
        this.handleActivityStravaMapType();
        this.handleHidePremium();
        this.handleHideFeed();
        this.handleDisplayFlyByFeedModifier();
        this.handleExtendedActivityData();
        this.handleExtendedSegmentEffortData();
        this.handleNearbySegments();
        this.handleActivityBikeOdo();
        this.handleActivitySegmentTimeComparison();
        this.handleActivityBestSplits();
        this.handleRunningGradeAdjustedPace();
        this.handleRunningHeartRate();
        this.handleRunningCadence();
        this.handleRunningTemperature();
        this.handleActivityQRCodeDisplay();
        this.handleVirtualPartner();
        this.handleAthletesStats();
        this.handleActivitiesSummary();
        this.handleTrackTodayIncomingConnection();
        this.handleGoogleMapsComeBackModifier();
    };
    StravistiX.prototype.handleForwardToWWW = function () {
        if (_.isEqual(window.location.hostname, 'app.strava.com')) {
            var forwardUrl = window.location.protocol + "//www.strava.com" + window.location.pathname;
            window.location.href = forwardUrl;
            return true;
        }
        return false;
    };
    StravistiX.prototype.handleExtensionHasJustUpdated = function () {
        console.log("ExtensionHasJustUpdated, localstorage clear");
        localStorage.clear();
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }
        this.handleUpdatePopup();
        var updatedToEvent = {
            categorie: 'Exploitation',
            action: 'updatedVersion',
            name: this.appResources.extVersion
        };
        follow('send', 'event', updatedToEvent.categorie, updatedToEvent.action, updatedToEvent.name);
        Helper.setToStorage(this.extensionId, StorageManager.storageSyncType, 'extensionHasJustUpdated', false);
    };
    StravistiX.prototype.handleUpdatePopup = function () {
        var previewBuild = false;
        if (this.appResources.extVersionName.indexOf('preview@') !== -1) {
            previewBuild = true;
        }
        var latestRelease = _.first(releaseNotes);
        var updateMessageObj = {
            logo: '<img src="' + this.appResources.logoStravistix + '"/>',
            title: 'Update <strong>v' + this.appResources.extVersion + '</strong>',
            hotFixes: (latestRelease.hotFixes) ? latestRelease.hotFixes : [],
            features: (latestRelease.features) ? latestRelease.features : [],
            fixes: (latestRelease.fixes) ? latestRelease.fixes : [],
            upcommingFixes: [],
            upcommingFeatures: [
                'Currently coding new Input/Output fitness extended stats panel & Human Performance Modeling graphs (CTL, ATL, TSB) with more accuracy.',
                'And more suprises... stay tunned via <a target="_blank" href="https://twitter.com/champagnethomas">my twitter</a>!',
            ]
        };
        var message = '';
        if (!_.isEmpty(latestRelease.message)) {
            message += '<div style="background: #eee; padding: 8px;">';
            message += latestRelease.message;
            message += '</div>';
        }
        var baseVersion = this.appResources.extVersion.split('.');
        if (!_.isEmpty(updateMessageObj.features) && !previewBuild) {
            message += '<h5><strong>NEW in ' + baseVersion[0] + '.' + baseVersion[1] + '.x' + ':</strong></h5>';
            _.each(updateMessageObj.features, function (feature) {
                message += '<h6>- ' + feature + '</h6>';
            });
        }
        if (!_.isEmpty(updateMessageObj.hotFixes)) {
            message += '<h5><strong>HOTFIXES ' + this.appResources.extVersion + ':</strong></h5>';
            _.each(updateMessageObj.hotFixes, function (hotFix) {
                message += '<h6>- ' + hotFix + '</h6>';
            });
        }
        if (!_.isEmpty(updateMessageObj.fixes) && !previewBuild) {
            message += '<h5><strong>FIXED in ' + baseVersion + ':</strong></h5>';
            _.each(updateMessageObj.fixes, function (fix) {
                message += '<h6>- ' + fix + '</h6>';
            });
        }
        if (!_.isEmpty(updateMessageObj.upcommingFixes) && !previewBuild) {
            message += '<h5><strong>Upcomming Fixes:</strong></h5>';
            _.each(updateMessageObj.upcommingFixes, function (upcommingFixes) {
                message += '<h6>- ' + upcommingFixes + '</h6>';
            });
        }
        if (!_.isEmpty(updateMessageObj.upcommingFeatures) && !previewBuild) {
            message += '<h5><strong>Upcomming Features:</strong></h5>';
            _.each(updateMessageObj.upcommingFeatures, function (upcommingFeatures) {
                message += '<h6>- ' + upcommingFeatures + '</h6>';
            });
        }
        if (previewBuild) {
            updateMessageObj.title = this.appResources.extVersionName;
            var shortSha1Commit = this.appResources.extVersionName.slice(this.appResources.extVersionName.indexOf('@') + 1);
            message += '<a href="https://github.com/thomaschampagne/stravistix/compare/master...' + shortSha1Commit + '" target="_blank">Git diff between ' + this.appResources.extVersionName + ' and master (code in production)</a></br></br> ';
        }
        message += '<a style="font-size: 24px;" class="button btn-block btn-primary" target="_blank" id="extendedStatsButton" href="' + this.appResources.settingsLink + '#/?showDonation=true">';
        message += '<strong>Push this project higher !!!</strong>';
        message += '</a>';
        $.fancybox('<div style="margin-left: auto; margin-right: auto; width: 25%;">' + updateMessageObj.logo + '</div><h2>' + updateMessageObj.title + '</h2>' + message);
    };
    StravistiX.prototype.handleAthletesStats = function () {
        if (!window.location.pathname.match(new RegExp("/athletes/" + this.athleteId + "$", "g"))) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleAthletesStats()");
        var athleteStatsModifier = new AthleteStatsModifier(this.appResources, {
            Run: this._userSettings.targetsYearRun,
            Ride: this._userSettings.targetsYearRide
        });
        athleteStatsModifier.modify();
    };
    StravistiX.prototype.handleActivitiesSummary = function () {
        if (!window.location.pathname.match(new RegExp("/athletes/" + this.athleteId + "$", "g"))) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleActivitiesSummary()");
        var activitiesSummaryModifier = new ActivitiesSummaryModifier();
        activitiesSummaryModifier.modify();
    };
    StravistiX.prototype.handlePreviewRibbon = function () {
        var globalStyle = 'background-color: #FFF200; color: rgb(84, 84, 84); font-size: 12px; padding: 5px; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; text-align: center;';
        var html = '<div id="updateRibbon" style="' + globalStyle + '"><strong>WARNING</strong> You are running a preview of <strong>StravistiX</strong>, to remove it, open a new tab and type <strong>chrome://extensions</strong></div>';
        $('body').before(html);
    };
    StravistiX.prototype.handleMenu = function () {
        if (env.debugMode)
            console.log("Execute handleMenu()");
        var menuModifier = new MenuModifier(this.athleteId, this.appResources);
        menuModifier.modify();
    };
    StravistiX.prototype.handleRemoteLinks = function () {
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/) && !window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (!this._userSettings.remoteLinks) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleRemoteLinks()");
        var remoteLinksModifier = new RemoteLinksModifier(this.appResources, (this.athleteIdAuthorOfActivity === this.athleteId), this.activityId);
        remoteLinksModifier.modify();
    };
    StravistiX.prototype.handleWindyTyModifier = function () {
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (!window.pageView) {
            return;
        }
        if (window.pageView.activity().get('type') !== "Ride") {
            return;
        }
        if (window.pageView.activity().get('trainer')) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleWindyTyModifier()");
        var windyTyModifier = new WindyTyModifier(this.activityId, this.appResources, this._userSettings);
        windyTyModifier.modify();
    };
    StravistiX.prototype.handleReliveCCModifier = function () {
        if (!this._userSettings.showHiddenBetaFeatures || !this._userSettings.displayReliveCCLink) {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (!window.pageView) {
            return;
        }
        if (window.pageView.activity().get('type') != "Ride") {
            return;
        }
        if (window.pageView.activity().get('trainer')) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleReliveCCModifier()");
        var reliveCCModifier = new ReliveCCModifier(this.activityId);
        reliveCCModifier.modify();
    };
    StravistiX.prototype.handleActivityScrolling = function () {
        if (!this._userSettings.feedAutoScroll) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleActivityScrolling_()");
        var activityScrollingModifier = new ActivityScrollingModifier();
        activityScrollingModifier.modify();
    };
    StravistiX.prototype.handleDefaultLeaderboardFilter = function () {
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        var view = Strava.Labs.Activities.SegmentLeaderboardView;
        if (!view) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleDefaultLeaderboardFilter()");
        var defaultLeaderboardFilterModifier = new DefaultLeaderboardFilterModifier(this._userSettings.defaultLeaderboardFilter);
        defaultLeaderboardFilterModifier.modify();
    };
    StravistiX.prototype.handleSegmentRankPercentage = function () {
        if (!this._userSettings.displaySegmentRankPercentage) {
            return;
        }
        if (!window.location.pathname.match(/^\/segments\/(\d+)$/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleSegmentRankPercentage()");
        var segmentRankPercentage = new SegmentRankPercentageModifier();
        segmentRankPercentage.modify();
    };
    StravistiX.prototype.handleActivityStravaMapType = function () {
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleActivityStravaMapType()");
        var activityStravaMapTypeModifier = new ActivityStravaMapTypeModifier(this._userSettings.activityStravaMapType);
        activityStravaMapTypeModifier.modify();
    };
    StravistiX.prototype.handleHidePremium = function () {
        if (this.isPremium) {
            return;
        }
        if (!this._userSettings.hidePremiumFeatures) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleHidePremium()");
        var hidePremiumModifier = new HidePremiumModifier();
        hidePremiumModifier.modify();
    };
    StravistiX.prototype.handleHideFeed = function () {
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }
        if (!this._userSettings.feedHideChallenges && !this._userSettings.feedHideCreatedRoutes && !this._userSettings.feedHideRideActivitiesUnderDistance && !this._userSettings.feedHideRunActivitiesUnderDistance) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleHideFeed()");
        var hideFeedModifier = new HideFeedModifier(this._userSettings);
        hideFeedModifier.modify();
    };
    StravistiX.prototype.handleDisplayFlyByFeedModifier = function () {
        if (!window.location.pathname.match(/^\/dashboard/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleDisplayFlyByFeedModifier()");
        var displayFlyByFeedModifier = new DisplayFlyByFeedModifier();
        displayFlyByFeedModifier.modify();
    };
    StravistiX.prototype.handleExtendedActivityData = function () {
        if (_.isUndefined(window.pageView)) {
            return;
        }
        var activityType = window.pageView.activity().get('type');
        var isTrainer = window.pageView.activity().get('trainer');
        if (activityType === 'Manual') {
            return;
        }
        this.activityProcessor.setActivityType(activityType);
        this.activityProcessor.setTrainer(isTrainer);
        if (env.debugMode)
            console.log("Execute handleExtendedData_()");
        var basicInfo = {
            activityName: this.vacuumProcessor.getActivityName(),
            activityTime: this.vacuumProcessor.getActivityTime()
        };
        var extendedDataModifier;
        switch (activityType) {
            case 'Ride':
                extendedDataModifier = new CyclingExtendedDataModifier(this.activityProcessor, this.activityId, activityType, this.appResources, this._userSettings, this.athleteId, this.athleteIdAuthorOfActivity, basicInfo, AbstractExtendedDataModifier.TYPE_ACTIVITY);
                break;
            case 'Run':
                extendedDataModifier = new RunningExtendedDataModifier(this.activityProcessor, this.activityId, activityType, this.appResources, this._userSettings, this.athleteId, this.athleteIdAuthorOfActivity, basicInfo, AbstractExtendedDataModifier.TYPE_ACTIVITY);
                break;
            default:
                break;
        }
        var updatedToEvent = {
            categorie: 'Analyse',
            action: 'openedActivityType',
            name: activityType
        };
        follow('send', 'event', updatedToEvent.categorie, updatedToEvent.action, updatedToEvent.name);
    };
    StravistiX.prototype.handleExtendedSegmentEffortData = function () {
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (!Strava.Labs) {
            return;
        }
        var activityType = window.pageView.activity().get('type');
        var isTrainer = window.pageView.activity().get('trainer');
        if (activityType === 'Manual') {
            return;
        }
        this.activityProcessor.setActivityType(activityType);
        this.activityProcessor.setTrainer(isTrainer);
        var view = Strava.Labs.Activities.SegmentLeaderboardView;
        if (activityType === ('Run' || 'Hike' || 'Walk')) {
            view = Strava.Labs.Activities.SegmentEffortDetailView;
        }
        if (!view) {
            return;
        }
        var functionRender = view.prototype.render;
        var that = this;
        view.prototype.render = function () {
            var r = functionRender.apply(this, Array.prototype.slice.call(arguments));
            var basicInfo = {
                activityName: that.vacuumProcessor.getActivityName(),
                activityTime: that.vacuumProcessor.getActivityTime()
            };
            var extendedDataModifier;
            switch (activityType) {
                case 'Ride':
                    extendedDataModifier = new CyclingExtendedDataModifier(that.activityProcessor, that.activityId, activityType, that.appResources, that._userSettings, that.athleteId, that.athleteIdAuthorOfActivity, basicInfo, AbstractExtendedDataModifier.TYPE_SEGMENT);
                    break;
                case 'Run':
                    extendedDataModifier = new RunningExtendedDataModifier(that.activityProcessor, that.activityId, activityType, that.appResources, that._userSettings, that.athleteId, that.athleteIdAuthorOfActivity, basicInfo, AbstractExtendedDataModifier.TYPE_SEGMENT);
                    break;
                default:
                    break;
            }
            return r;
        };
    };
    StravistiX.prototype.handleNearbySegments = function () {
        var _this = this;
        if (!this._userSettings.displayNearbySegments) {
            return;
        }
        var segmentData = window.location.pathname.match(/^\/segments\/(\d+)$/);
        if (_.isNull(segmentData)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleNearbySegments()");
        var segmentId = parseInt(segmentData[1]);
        var segmentProcessor = new SegmentProcessor(this.vacuumProcessor, segmentId);
        segmentProcessor.getNearbySegmentsAround(function (jsonSegments) {
            if (env.debugMode)
                console.log(jsonSegments);
            var nearbySegmentsModifier = new NearbySegmentsModifier(jsonSegments, _this.appResources);
            nearbySegmentsModifier.modify();
        });
    };
    StravistiX.prototype.handleActivityBikeOdo = function () {
        if (!this._userSettings.displayBikeOdoInActivity) {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (window.pageView.activity().attributes.type != "Ride") {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleActivityBikeOdo()");
        var bikeOdoProcessor = new BikeOdoProcessor(this.vacuumProcessor, this.athleteIdAuthorOfActivity);
        bikeOdoProcessor.getBikeOdoOfAthlete(function (bikeOdoArray) {
            var activityBikeOdoModifier = new ActivityBikeOdoModifier(bikeOdoArray, bikeOdoProcessor.getCacheKey());
            activityBikeOdoModifier.modify();
        });
    };
    StravistiX.prototype.handleActivitySegmentTimeComparison = function () {
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        var activityType = window.pageView.activity().get('type');
        if (activityType !== "Ride" && activityType !== "Run") {
            return;
        }
        var isMyOwn = (this.athleteId == this.athleteIdAuthorOfActivity);
        if (env.debugMode)
            console.log("Execute handleActivitySegmentTimeComparison()");
        var activitySegmentTimeComparisonModifier = new ActivitySegmentTimeComparisonModifier(this._userSettings, this.appResources, activityType, isMyOwn);
        activitySegmentTimeComparisonModifier.modify();
    };
    StravistiX.prototype.handleActivityBestSplits = function () {
        var _this = this;
        if (!this._userSettings.displayActivityBestSplits) {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (window.pageView.activity().attributes.type != "Ride") {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleActivityBestSplits()");
        this.vacuumProcessor.getActivityStream(function (activityCommonStats, jsonResponse, athleteWeight, hasPowerMeter) {
            Helper.getFromStorage(_this.extensionId, StorageManager.storageSyncType, 'bestSplitsConfiguration', function (response) {
                var activityBestSplitsModifier = new ActivityBestSplitsModifier(_this.activityId, _this._userSettings, jsonResponse, hasPowerMeter, response.data, function (splitsConfiguration) {
                    Helper.setToStorage(_this.extensionId, StorageManager.storageSyncType, 'bestSplitsConfiguration', splitsConfiguration);
                });
                activityBestSplitsModifier.modify();
            });
        });
    };
    StravistiX.prototype.handleRunningGradeAdjustedPace = function () {
        if (!this._userSettings.activateRunningGradeAdjustedPace) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleRunningGradeAdjustedPace()");
        var runningGradeAdjustedPace = new RunningGradeAdjustedPaceModifier();
        runningGradeAdjustedPace.modify();
    };
    StravistiX.prototype.handleRunningHeartRate = function () {
        if (!this._userSettings.activateRunningHeartRate) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleRunningHeartRate()");
        var runningHeartRateModifier = new RunningHeartRateModifier();
        runningHeartRateModifier.modify();
    };
    StravistiX.prototype.handleRunningCadence = function () {
        if (!this._userSettings.activateRunningCadence) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleRunningCadence()");
        var runningCadenceModifier = new RunningCadenceModifier();
        runningCadenceModifier.modify();
    };
    StravistiX.prototype.handleRunningTemperature = function () {
        if (!this._userSettings.activateRunningTemperature) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        if (window.pageView.activity().attributes.type != "Run") {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (env.debugMode)
            console.log("Execute handleRunningHeartRate()");
        var runningTemperatureModifier = new RunningTemperatureModifier();
        runningTemperatureModifier.modify();
    };
    StravistiX.prototype.handleActivityQRCodeDisplay = function () {
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        if (_.isUndefined(window.pageView)) {
            return;
        }
        var activityQRCodeDisplayModifier = new ActivityQRCodeDisplayModifier(this.appResources, this.activityId);
        activityQRCodeDisplayModifier.modify();
    };
    StravistiX.prototype.handleVirtualPartner = function () {
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        var virtualPartnerModifier = new VirtualPartnerModifier(this.activityId);
        virtualPartnerModifier.modify();
    };
    StravistiX.prototype.handleGoogleMapsComeBackModifier = function () {
        if (window.location.pathname.match(/\/truncate/)) {
            return;
        }
        if (!this._userSettings.reviveGoogleMaps) {
            return;
        }
        if (!window.location.pathname.match(/^\/activities/)) {
            return;
        }
        var googleMapsComeBackModifier = new GoogleMapsComeBackModifier(this.activityId, this.appResources, this._userSettings);
        googleMapsComeBackModifier.modify();
    };
    StravistiX.prototype.handleTrackTodayIncomingConnection = function () {
        var userHasConnectSince24Hour = (StorageManager.getCookie('stravistix_daily_connection_done') == 'true');
        if (env.debugMode)
            console.log("Cookie 'stravistix_daily_connection_done' value found is: " + userHasConnectSince24Hour);
        if (_.isNull(this.athleteId)) {
            if (env.debugMode)
                console.log("athleteId is empty value: " + this.athleteId);
            return;
        }
        if (!userHasConnectSince24Hour) {
            var accountType = 'Free';
            var accountName = this.athleteName;
            if (!_.isNull(this.isPremium) && this.isPremium === true) {
                accountType = 'Premium';
            }
            if (!_.isNull(this.isPro) && this.isPro === true) {
                accountType = 'Pro';
            }
            var eventAction = 'DailyConnection_Account_' + accountType;
            var eventName = accountName + ' #' + this.athleteId + ' v' + this.appResources.extVersion;
            if (env.debugMode)
                console.log("Cookie 'stravistix_daily_connection_done' not found, send track <IncomingConnection> / <" + accountType + "> / <" + eventName + ">");
            if (!env.debugMode) {
                follow('send', 'event', 'DailyConnection', eventAction, eventName);
            }
            StorageManager.setCookie('stravistix_daily_connection_done', true, 1);
        }
        else {
            if (env.debugMode)
                console.log("Cookie 'stravistix_daily_connection_done' exist, DO NOT TRACK IncomingConnection");
        }
    };
    Object.defineProperty(StravistiX.prototype, "userSettings", {
        get: function () {
            return this._userSettings;
        },
        enumerable: true,
        configurable: true
    });
    StravistiX.instance = null;
    return StravistiX;
}());
