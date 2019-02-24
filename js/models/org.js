const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;

// Org Model
// ----------

module.exports = Backbone.Model.extend({
  // Default attributes for the org
  defaults: {
    email: '',
    username: '',
    password: '',
    teamname: '',
    subdomain: '',
    invitations: [],
    subscription: '',
    initialUsers: '',
    enableNewsletter: true,
    paymentMethodNonce: '',
    billingAddress: {}
  }
});
