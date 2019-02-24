const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;

const apiClient = require('appscode-api-js-client');

module.exports = Backbone.View.extend({
  el: '.org-create',
  // Cache the template function for a single item.
  invitationTemplate: 'invitation-form.html',
  emailTemplate: 'email-row.html',
  // The DOM events specific to an item.
  events: {
    'click #add-invitation': 'addInvitationField',
    'click a.remove-email': 'removeEmailField',
    'click #btn-proceed': 'addAllInvitations',
    'click #btn-skip': 'skipInvitations'
  },
  initialize(options) {
    this.model = options.org;
  },

  render() {
    this.$el.html(global.nunjucksEnv.render(this.invitationTemplate));
    if (this.model.get('email') === '' || this.model.get('username') === '' || this.model.get('password') === '' || this.model.get('teamname') === '' || this.model.get('subdomain') === '' || this.model.get('subscription') === '') {
      Backbone.history.navigate('', {trigger: true});
      return;
    }
  },

  addInvitationField() {
    $('#email-group').append(global.nunjucksEnv.render(this.emailTemplate));
  },

  addAllInvitations(e) {
    e.preventDefault();

    const isValid = $('form').valid();
    const hasError = this.$el.find('.has-error').html();
    if (isValid && typeof hasError === 'undefined') {
      const that = this;
      $('#email-group input[type=email]').each((index, value)=> {
        const inputEmail = $(value).val();
        if (inputEmail !== '') {
          that.model.get('invitations').push(inputEmail);
        }
      });
      that.mailSubscribe();
    }
  },

  skipInvitations(e) {
    this.model.set({invitations: []});
    e.preventDefault();
    this.mailSubscribe();
  },

  createNamespace() {
    const that = this;
    const req = {
      'display_name': this.model.get('teamname'),
      'name': this.model.get('subdomain'),
      'email': this.model.get('email'),
      'user_name': this.model.get('username'),
      'password': this.model.get('password'),
      'invite_emails': this.model.get('invitations'),
      'subscription': this.model.get('subscription'),
      'payment_method_nonce': this.model.get('paymentMethodNonce'),
      'billing_address': this.model.get('billingAddress')
    };

    if (this.model.get('initialUsers') !== '') {
      req.initial_units = this.model.get('initialUsers');
    }

    apiClient.namespace.v1beta1.teams.create(req)
      .then(() => {
        const username = that.model.get('username');
        Backbone.history.navigate('/welcome?username=' + username, {trigger: true});
      })
      .catch((err) => {
        global.dangerMessg(err.response.message, 'Error');
        console.log('status: ', status, 'err: ', err);
      });
  },

  mailSubscribe() {
    const that = this;
    const check = that.model.get('enableNewsletter');
    if (check) {
      const email = that.model.get('email');
      apiClient.mailinglist.v1beta1.mailingList.subscribe({email: email})
        .then(() => {
          console.log('Mail subscription successful');
          that.createNamespace();
        })
        .catch((err) => {
          global.dangerMessg(err.response.message, 'Error');
          console.log('status: ', status, 'err: ', err);
        });
    } else {
      this.createNamespace();
    }
  },

  removeEmailField(e) {
    e.preventDefault();
    const html = e.target;
    $(html).closest('.form-group').remove();
  }
});
