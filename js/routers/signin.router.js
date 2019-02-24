const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;


module.exports = Backbone.Router.extend({
  constructor(options) {
    Backbone.Router.prototype.constructor.call(this, options);
    this.model = options.org;
  },

  routes: {
    '': 'signin'
  }
});
