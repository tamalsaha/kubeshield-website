const Backbone = require('backbone');
const $ = require('jquery');
const _ = require('lodash');
Backbone.$ = $;
const apiClient = require('appscode-api-js-client').namespace.v1beta1;
const cowrypayCLient = require('cowrypay-client');

module.exports = Backbone.View.extend({
  el: '.org-create',

  teamTemplate: 'team-info.html',

  events: {
    'click #btn-p2': 'checkTeamId',
    'change #product-sku': 'updateDependentFields',
    'change #subdomain': 'updateFieldCSS'
  },

  initialize(options) {
    this.model = options.model;
    this.products = [];
    this.productsInd = {};
  },

  render() {
    if (this.model.get('email') === '' || this.model.get('username') === '' || this.model.get('password') === '') {
      Backbone.history.navigate('', { trigger: true });
      return;
    }
    const conf = { domain: global.cowrypayApiServer };
    const that = this;

    cowrypayCLient.product.v1beta1.productService.list({ namespace: global.cowrypayNamespace}, conf)
      .then((resp) => {
        if (_.has(resp, 'products')) {
          const products = resp.products;
          products.forEach((product) => {
            if (product.billing_model === 'FIXED_RECUR' || product.billing_model === 'PER_SEAT') {
              const o = {};
              o.sku = product.sku;
              o.cpid = product.cpid;
              o.displayName = product.display_name;
              o.billingModel = product.billing_model;
              o.useTrueUp = product.spec.use_true_up;
              o.trialPeriod = product.trial_period;
              that.products.push(o);
              that.productsInd[o.sku] = that.products.length - 1;
            }
          });
        }
        this.model.set({products: that.products});
        const o = {};
        o.products = that.products;
        if (this.model.get('subscription')) {
          o.subscription = this.model.get('subscription');
        }
        this.$el.html(global.nunjucksEnv.render(this.teamTemplate, o));
        this.updateDependentFields();
      })
      .catch((err) => {
        global.dangerMessg(err.response.message, 'Error');
      });
  },
  checkTeamId(e) {
    const that = this;
    e.preventDefault();
    const isValid = $('form').valid();

    if (isValid) {
      let subdomain = $('#subdomain').val();
      subdomain = subdomain.replace(/\s+/g, '').toLowerCase();

      apiClient.teams.isAvailable({name: subdomain})
        .then(() => {
          that.$el.find('#subdomain').closest('.form-group').removeClass('has-error').addClass('has-success');
          $('#subdomain1').removeClass('glyphicon-remove').addClass('glyphicon-ok');

          const hasError = that.$el.find('.has-error').html();
          if (isValid && typeof hasError === 'undefined') {
            that.model.set({teamname: that.$('#teamname').val()});
            that.model.set({subdomain: that.$('#subdomain').val()});
            that.model.set({subscription: that.$('#product-sku').val()});
            if ($('#user-count').is(':visible')) {
              that.model.set({initialUsers: $('#user-count').val()});
            }
            const currentUrl = Backbone.history.getFragment();
            if (currentUrl === 'team') {
              Backbone.history.navigate('#/payment', {trigger: true});
            } else if (currentUrl === 'confirm') {
              that.model.set({email: $('#email').val()});
              that.model.set({username: $('#username').val()});
              Backbone.history.navigate('#/invitation', {trigger: true});
            }
          }
        })
        .catch((err) => {
          that.$el.find('#subdomain').closest('.form-group').removeClass('has-success').addClass('has-error');
          $('#subdomain').removeClass('valid').addClass('error');
          $('#subdomain1').removeClass('glyphicon-ok').addClass('glyphicon-remove');
          global.dangerMessg(err.response.message, 'Error');
        });
    }
  },
  updateDependentFields() {
    const sku = $('#product-sku').val();

    // user-count field
    const prdct = this.products[this.productsInd[sku]];
    if (prdct.useTrueUp) {
      $('#user-count').closest('.form-group').removeClass('hidden');
    } else {
      $('#user-count').closest('.form-group').addClass('hidden');
      $('#user-count').val('');
    }
  },
  updateFieldCSS(e) {
    e.preventDefault();
    if ($('#subdomain').val() !== '') {
      $('#subdomain').closest('.form-group').removeClass('has-error').addClass('has-success');
    } else {
      $('#subdomain').closest('.form-group').removeClass('has-success').addClass('has-error');
    }
  }
});
