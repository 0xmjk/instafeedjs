/*
 * InstaFeedJS
 *
 * Copyright (c) 2016 Michal J Kubski
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This module scrapes the Instagram(tm) web page and is not endorsed or certified by Instagram, Inc.
 * All Instagram(tm) logos and trademarks displayed on this module are property of Instagram, Inc.
 *
 */

// Utility for older browsers
if (typeof Object.create !== "function") {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

var InstaFeedJS = function(username) {
    this.username = username;
    this.jsonp_proxy = "http://whateverorigin.org/get";
};

InstaFeedJS.prototype.getRecentMedia = function(maxMedia, callback) {
    $.getJSON(this.jsonp_proxy + '?url=' + encodeURIComponent("https://www.instagram.com/" + this.username + "/") + '&callback=?', function(data) {
        var myRe = /window\._sharedData = (\{.*\})/;
        var lines = data.contents.split("\n");
        var instagram = undefined;
        for (var l in lines) {
            var r = myRe.exec(lines[l]);
            if (r) {
                instagram = JSON.parse(r[1]);
                break;
            }
        }
        result = new Array();
        if (instagram) {
            user = instagram["entry_data"]["ProfilePage"][0]["user"];
            media = user["media"]["nodes"];
            for (m in media) {
                if (m >= maxMedia)
                    break;
                image = media[m];
                r = {
                    imageCaption: image["caption"],
                    imageUrl: image["thumbnail_src"],
                    imageTarget: "https://www.instagram.com/p/" + image["code"],
                    isVideo: image["is_video"]
                };
                result.push(r);
            }
        }
        callback(result);
    });
};
