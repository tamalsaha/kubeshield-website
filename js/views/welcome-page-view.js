const Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.org-create',

  // Cache the template function for a single item.
  WelcomeTemplate: 'welcome.html',

  initialize(options) {
    this.model = options.org;
  },

  render(o) {
    const username = o.username;
    this.$el.html(global.nunjucksEnv.render(this.WelcomeTemplate, {username}));
  }
});
