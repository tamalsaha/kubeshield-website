/* global ENTER_KEY, ESC_KEY */
const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  el: '.org-create',

  // Cache the template function for a single item.
  confirmTemplate: 'confirm-form.html',

  // The DOM events specific to an item.
  events: {
    'click a#email-4': 'updateEmail',
    'click a#username-4': 'updateUsername',
    'click a#teamname-4': 'updateTeamname',
    'click a#subdomain-4': 'updateSubdomain',
    'click a#product-sku-4': 'updateProductSKU',
    'click a#user-count-4': 'updateUserCount',
    'click #btn-p4': 'doConfirm'
  },

  initialize(options) {
    this.model = options.org;
    this.products = [];
    this.productsInd = {};
  },

  render() {
    if (this.model.get('email') === '' || this.model.get('username') === '' || this.model.get('password') === '' || this.model.get('teamname') === '' || this.model.get('subdomain') === '' || !this.model.get('products')) {
      Backbone.history.navigate('', {trigger: true});
      return;
    }

    const products = this.model.get('products');
    if (products) {
      this.$el.html(global.nunjucksEnv.render(this.confirmTemplate, this.model.toJSON()));
      // $('#product-sku').trigger('change');
    }
  },
  updateEmail() {
    this.$el.find('a#email-4').css({'color': '#fff'});
    $('input#email').removeAttr('disabled');
  },

  updateUsername() {
    this.$el.find('a#username-4').css({'color': '#fff'});
    $('input.username').removeAttr('disabled');
  },

  updateTeamname() {
    this.$el.find('a#teamname-4').css({'color': '#fff'});
    $('input.teamname').removeAttr('disabled');
  },

  updateSubdomain() {
    $('input.sub-domain').removeAttr('disabled');
  },

  updateProductSKU() {
    this.$el.find('a#product-sku-4').css({'color': '#fff'});
    $('select#product-sku').removeAttr('disabled');
    $('a#user-count-4').trigger('click');
  },

  updateUserCount() {
    this.$el.find('a#user-count-4').css({'color': '#fff'});
    $('input#user-count').removeAttr('disabled');
  }
});
