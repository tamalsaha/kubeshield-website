const Backbone = require('backbone');
const $ = require('jquery');
const braintree = require('braintree-web');
Backbone.$ = $;
const atoastr = require('./common/toastr');
const countryName = require('./common/country-names.json');
const stateName = require('./common/state-name.json');
const _ = require('lodash');

module.exports = Backbone.View.extend({
  el: '.org-create',
  paymentMethodFormSecond: 'bt-form-nunj.html',
  paymentMethodStateReq: 'pm-state-req.html',
  paymentMethodStateNotReq: 'pm-state-not-req.html',
  events: {
    'change #country-code': 'changeCountryCode',
    'click #skip-add-pm': 'skipAddPaymentMethod'
  },
  initialize(options) {
    this.org = options.org;
    let flag = false;

    if (_.isEmpty(this.org.get('email'))) {
      flag = true;
    }
    if (_.isEmpty(this.org.get('username'))) {
      flag = true;
    }
    if (_.isEmpty(this.org.get('password'))) {
      flag = true;
    }
    if (_.isEmpty(this.org.get('teamname'))) {
      flag = true;
    }
    if (_.isEmpty(this.org.get('subdomain'))) {
      flag = true;
    }
    if (_.isEmpty(this.org.get('clientToken'))) {
      flag = true;
    }

    if (flag) {
      this.close();
      Backbone.history.navigate('', { trigger: true });
      return;
    }
    this.fieldInfos = [
      {
        'label-class': 'number-sm-error',
        'input-id': 'card-number'
      },
      {
        'label-class': 'expirationDate-sm-error',
        'input-id': 'expiration-date'
      },
      {
        'label-class': 'cvv-sm-error',
        'input-id': 'cvv'
      },
      {
        'label-class': 'postalCode-sm-error',
        'input-id': 'postal-code'
      }
    ];
    this.$el.html(global.nunjucksEnv.render(this.paymentMethodFormSecond, options));
  },
  render() {
    this.$secondForm = $('#second-form');
    this.$formButtonSubmit = $('#second-btn-payment');
    this.$countryCode = $('#country-code');
    this.$stateSection = $('#state-section');
    this.$cardImage = $('#card-image');
    this.appendCountryName();
    this.getClientToken();
  },
  appendCountryName() {
    _.each(countryName, (value, key) => {
      this.$countryCode.append(`<option value="${key}">${value}</option>`);
    });
    this.$countryCode.val('840');
    this.appendStates();
  },
  appendStates() {
    this.$stateSection.html(global.nunjucksEnv.render(this.paymentMethodStateReq));
    this.$stateSelect = $('#state');
    _.each(stateName, (value, key) => {
      this.$stateSelect.append(`<option value="${key}">${value}</option>`);
    });
  },
  submitToBraintree(e) {
    e.preventDefault();
    this.getClientToken();
  },
  getClientToken() {
    const clientTkn = this.org.get('clientToken');
    this.braintreeCall(clientTkn);
  },
  braintreeCall(resp) {
    const that = this;
    const submit = document.querySelector('#second-btn-payment');
    braintree.client.create({
      authorization: resp
    }, (clientErr, clientInstance) => {
      if (clientErr) {
        return;
      }

      braintree.hostedFields.create({
        client: clientInstance,
        styles: {
          input: {
            'font-size': '9pt',
            'font-weight': '500',
            'font-family': 'Roboto , sans-serif'
          },
          'input.invalid': {
            color: '#f00',
            border: '2px solid #f00'
          },
          'input.valid': {
            color: '#3bb878',
            border: '2px solid #3bb878'
          }
        },
        fields: {
          number: {
            selector: '#card-number',
            placeholder: '4111 1111 1111 1111'
          },
          cvv: {
            selector: '#cvv',
            placeholder: '123'
          },
          expirationDate: {
            selector: '#expiration-date',
            placeholder: '10/2019'
          },
          postalCode: {
            selector: '#postal-code',
            placeholder: '11111'
          }
        }
      }, (hostedFieldsErr, hostedFieldsInstance) => {
        if (hostedFieldsErr) {
          return;
        }
        const cvvLabel = document.querySelector('label[for="cvv"]');

        hostedFieldsInstance.on('cardTypeChange', (event) => {
          let cvvText;
          that.$cardImage.removeClass();
          if (event.cards.length === 1) {
            cvvText = event.cards[0].code.name;
            that.$cardImage.addClass(event.cards[0].type);
          } else {
            cvvText = 'CVV';
          }
          cvvLabel.innerHTML = cvvText;
          hostedFieldsInstance.setAttribute({
            field: 'cvv',
            attribute: 'placeholder',
            value: cvvText === 'CID' ? '1234' : '123'
          });
        });
        hostedFieldsInstance.on('validityChange', (event) => {
          const field = event.fields[event.emittedBy];
          $(`#${field.container.id}`).removeClass('invalid');
          $(`#${field.container.id}`).removeClass('valid');
          if (field.isValid) {
            $(`#${field.container.id}`).addClass('valid');
            $(`#${field.container.id}-error`).addClass('hidden');
          } else if (field.isPotentiallyValid) {
            $(`#${field.container.id}`).addClass('valid');
            $(`#${field.container.id}-error`).addClass('hidden');
          } else {
            $(`#${field.container.id}`).addClass('invalid');
            const fieldId = field.container.id + '-error';
            $(`#${fieldId}`).removeClass('hidden');
            if (field.isEmpty) {
              $(`#${fieldId}`).html('This field is required.');
            } else {
              $(`#${fieldId}`).html('This field is invalid.');
            }
          }
        });
        submit.removeAttribute('disabled');
        submit.addEventListener('click', (event) => {
          event.preventDefault();
          if (!that.$secondForm.valid()) {
            return;
          }
          const billingAddressValid = true;
          if (!billingAddressValid) {
            atoastr.showError('Invalid Billing Address Information', 'Billing Address');
            return;
          }
          hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
            if (tokenizeErr) {
              if (tokenizeErr.code === 'HOSTED_FIELDS_FIELDS_EMPTY') {
                _.each(this.fieldInfos, (it) => {
                  $(`.${it['label-class']}`).removeClass('hidden');
                  $(`.${it['label-class']}`).css('display', 'block');
                  $(`.${it['label-class']}`).html('This field is required.');
                  $(`#${it['input-id']}`).removeClass('valid');
                  $(`#${it['input-id']}`).addClass('invalid');
                });
              } else if (tokenizeErr.code === 'HOSTED_FIELDS_FIELDS_INVALID') {
                const invalidFields = tokenizeErr.details.invalidFieldKeys;
                _.each(this.fieldInfos, (it) => {
                  const fieldKey = it['label-class'].split('-')[0];
                  if (invalidFields.indexOf(fieldKey) !== -1) {
                    $(`.${fieldKey}-sm-error`).removeClass('hidden');
                    $(`.${fieldKey}-sm-error`).css('display', 'block');
                    $(`.${fieldKey}-sm-error`).html('This field is invalid.');
                    $(`#${it['input-id']}`).removeClass('valid');
                    $(`#${it['input-id']}`).addClass('invalid');
                  }
                });
              } else if (tokenizeErr.code === 'HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED') {
                $('.cvv-sm-error').removeClass('hidden');
                $('.cvv').removeClass('valid');
                $('.cvv').addClass('invalid');
                $('.cvv-sm-error').css('display', 'block');
                $('.cvv-sm-error').html('This field is invalid.');
              }
              return;
            }
            that.createPaymentMethod(payload.nonce);
          });
        }, false);
      });
    });
  },
  createPaymentMethod(nonce) {
    const billingAddress = {};
    _.each(this.$secondForm.serializeArray(), (it) => {
      billingAddress[it.name] = it.value;
    });
    this.org.set('paymentMethodNonce', nonce);
    this.org.set('billingAddress', billingAddress);
    Backbone.history.navigate('#/confirm');
  },
  changeCountryCode(e) {
    e.preventDefault();
    if (e.target.value === '840') {
      this.appendStates();
    } else {
      this.$stateSection.html(global.nunjucksEnv.render(this.paymentMethodStateNotReq));
    }
  },
  skipAddPaymentMethod(e) {
    e.preventDefault();
    Backbone.history.navigate('#/confirm');
  },
  close() {
    this.unbind();
    this.undelegateEvents();
  }
});
