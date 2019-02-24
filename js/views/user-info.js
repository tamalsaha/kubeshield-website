/* global ENTER_KEY, ESC_KEY */
const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  el: '.org-create',

  userInfoTemp: 'user-info.html',

  events: {
    'click #btn-p1': 'addUserInfo'
  },

  initialize(options) {
    this.model = options.model;
    this.email = options.email;
    this.subscription = options.subscription;
  },

  render() {
    if (this.subscription) {
      this.model.set({subscription: this.subscription});
    }

    this.$el.html(global.nunjucksEnv.render(this.userInfoTemp));
    if (this.email) {
      this.model.set({email: this.email});
      $('#email-section').hide();
    }
  },

  addUserInfo(e) {
    e.preventDefault();
    const isValid = $('form').valid();
    const hasError = this.$el.find('.has-error').html();
    let gRecaptchaVal = '';
    if (!this.model.get('gRecaptchaVal')) {
      gRecaptchaVal = $('#g-recaptcha-response').val();
      if (gRecaptchaVal) {
        this.model.set({gRecaptchaVal: gRecaptchaVal});
      }
    } else {
      gRecaptchaVal = this.model.get('gRecaptchaVal');
    }
    let msg = $('.strength_meter div').attr('data-info');

    if (msg === 'min-8') {
      msg = 'Password should have minimum 8 chars';
      global.dangerMessg(msg);
    } else if (msg === 'alphanum' || msg === 'medium') {
      msg = 'Password must contain a number, an upper and lower case character';
      global.dangerMessg(msg);
    } else {
      if (isValid && gRecaptchaVal && typeof hasError === 'undefined') {
        this.model.set({email: $('#email').val()});
        this.model.set({username: $('#username').val()});
        this.model.set({password: $('#password').val()});
        const check = $('#enable-newsletter').prop('checked');

        if (!check) {
          this.model.set({enableNewsletter: false});
        } else {
          this.model.set({enableNewsletter: true});
        }
        Backbone.history.navigate('#/team', {trigger: true});
      }
    }
  }
});
