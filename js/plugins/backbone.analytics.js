// source: https://github.com/kendagriff/backbone.analytics
const Backbone = require('backbone');

module.exports = (function() {
  const loadUrl = Backbone.History.prototype.loadUrl;

  Backbone.History.prototype.loadUrl = function() {
    const matched = loadUrl.apply(this, arguments);

    if (!this.options.silent) {
      this.options.silent = true;
      return matched;
    }

    const path = (window.location.pathname + window.location.hash).split('?')[0];

    // legacy version
    if (typeof window._gaq !== 'undefined') {
      window._gaq.push(['_trackPageview', path]);
    }

    // Analytics.js
    let ga;
    if (window.GoogleAnalyticsObject && window.GoogleAnalyticsObject !== 'ga') {
      ga = window.GoogleAnalyticsObject;
    } else {
      ga = window.ga;
    }

    if (typeof ga !== 'undefined') {
      ga('set', 'page', path);
      ga('send', 'pageview');
    }
    return matched;
  };
}());
