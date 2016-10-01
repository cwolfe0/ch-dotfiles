var MenuModifier = (function () {
    function MenuModifier(athleteId, appResources) {
        this.athleteId = athleteId;
        this.appResources = appResources;
    }
    MenuModifier.prototype.modify = function () {
        var globalNav = $(".global-nav");
        var html = "<li class='drop-down-menu'>";
        var menuStyle = "style='font-size:20px; background-color: transparent; color: #fc4c02;'";
        var menuIcon = this.appResources.menuIconOrange;
        var styleSideRight = 'display: inline; float: right; border-top: 1px solid #DDD; border-left: 1px solid #DDD; width: 50%;';
        var styleSideLeft = 'border-top: 1px solid #DDD; width: 50%;';
        html += "<a title='Click Left > \"My Activity Feed\", click right > \"My Activities\"' href='https://www.strava.com/dashboard?feed_type=my_activity' class='selection' " + menuStyle + "><img style='vertical-align:middle' id='drop-down-menu_img' oncontextmenu='return false;' src='" + menuIcon + "'/></a>";
        html += "<script>document.getElementById('drop-down-menu_img').onmousedown = function(event) { if (event.which == 3) { window.location.href = 'https://www.strava.com/athlete/training?utm_source=top-nav';}}</script>";
        html += "<ul class='options' style='width: 300px; max-height: 650px !important; overflow:hidden;'>";
        html += "<li><a target='_blank' href='" + this.appResources.settingsLink + "'><img style='vertical-align:middle' src='" + this.appResources.settingsIcon + "'/> <span>StravistiX Settings</span></a></li>";
        html += "<li><a href='http://labs.strava.com/achievement-map/' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.komMapIcon + "'/> <span>KOM/CR Map</span></a></li>";
        html += "<li id='splus_menu_heatmap'><a href='#' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.heatmapIcon + "'/> <span>Heat Map</span></a></li>";
        html += "<li style='border-top: 1px solid #DDD;'><a style='font-style: italic;' href='" + this.appResources.settingsLink + "#/?showReleaseNotes=true' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.systemUpdatesIcon + "'/> <span><strong>" + this.appResources.extVersionName + "</strong> release notes</span></a></li>";
        html += "<li style='" + styleSideRight + "'><a style='font-style: italic;' href='https://chrome.google.com/webstore/detail/stravistix/dhiaggccakkgdfcadnklkbljcgicpckn/reviews' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.rateIcon + "'/> <span>Rate</span></a></li>";
        html += "<li style='" + styleSideLeft + "' ><a  style='font-style: italic;' href='https://twitter.com/champagnethomas' style='font-style: italic;' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.twitterIcon + "'/> <span>What's next?</span></a></li>";
        html += "<li style='" + styleSideRight + "'><a style='font-style: italic;' href='" + this.appResources.settingsLink + "#/?showDonation=true' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.donateIcon + "'/> <span>Donate</span></a></li>";
        html += "<li style='" + styleSideLeft + "'><a style='font-style: italic;' href='http://thomaschampagne.github.io/' target='_blank'><img style='vertical-align:middle' src='" + this.appResources.bikeIcon + "'/> <span> Author site</span></a></li>";
        html += "<li style='border-top: 1px solid #DDD;'><a target='_blank' href='" + this.appResources.settingsLink + "#/?showSharing=true'><img style='vertical-align:middle' src='" + this.appResources.shareIcon + "'/> <span>Share this extension</span></a></li>";
        html += "</ul>";
        html += "</li>";
        if (navigator.geolocation) {
            var splusMenuHeatmap_1 = $('#splus_menu_heatmap');
            navigator.geolocation.getCurrentPosition(function (position) {
                splusMenuHeatmap_1.find('a').attr('href', 'http://labs.strava.com/heatmap/#12/' + position.coords.longitude + '/' + position.coords.latitude + '/gray/both');
            }, function (error) {
                console.error(error);
                splusMenuHeatmap_1.find('a').attr('href', '#');
                splusMenuHeatmap_1.find('a').attr('target', '_self');
                splusMenuHeatmap_1.find('a').attr('onclick', 'alert("Some StravistiX functions will not work without your location position. Please make sure you have allowed location tracking on this site. Click on the location icon placed on the right inside the chrome web address bar => Clear tracking setting => Refresh page > Allow tracking.")');
            });
        }
        globalNav.children().first().before(html);
    };
    return MenuModifier;
}());
