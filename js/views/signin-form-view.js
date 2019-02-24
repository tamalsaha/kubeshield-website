const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;

const apiClient = require('appscode-api-js-client').namespace.v1beta1;

module.exports = Backbone.View.extend({
  el: '.org-create',
  signinTemplate: 'signin-form.html',
  events: {
    'click .continue': 'doSignin'
  },

  initialize(options) {
    this.model = options.org;
  },

  render() {
    this.$el.html(global.nunjucksEnv.render(this.signinTemplate));
  },

  doSignin(e) {
    const that = this;
    e.preventDefault();
    const isFormValid = $('form').valid();

    if (isFormValid) {
      let subdomain = $('#subdomain-signin').val();
      subdomain = subdomain.replace(/\s\s+/g, '').toLowerCase();

      apiClient.teams.get({name: subdomain})
        .then(() => {
          that.$el.find('#subdomain-signin').closest('.form-group').removeClass('has-error').addClass('has-success');
          $('#subdomain1').removeClass('glyphicon-remove').addClass('glyphicon-ok');

          const hasError = that.$el.find('.has-error').html();
          if (typeof hasError === 'undefined') {
            window.location.href = 'https://' + subdomain + '.appscode.io';
          }
        })
        .catch(() => {
          global.dangerMessg('Team not found.', 'error');
        });
    }
  }
});
