const Backbone = require('backbone');
const $ = require('jquery');
const BtFormView = require('../views/bt-form-view');
Backbone.$ = $;
const _ = require('lodash');

const UserInfo = require('../views/user-info');
const TeamInfo = require('../views/team-info');

module.exports = Backbone.Router.extend({
  constructor(options) {
    Backbone.Router.prototype.constructor.call(this, options);
    this.model = options.org;
  },
  routes: {
    '(?*query)': 'userInfo',
    'team': 'teamInfo',
    'payment': 'addPaymentMethod',
    'username': 'username',
    'confirm': 'confirm',
    'invitation': 'invitation',
    'welcome?*query': 'welcome'
  },
  userInfo() {
    $.urlParam = (name) => {
      const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results) {
        return results[1] || 0;
      }
      return null;
    };
    const email = $.urlParam('email');
    const subscription = $.urlParam('subscription');
    const userInfo = new UserInfo({model: this.model, email: email, subscription});
    userInfo.render();
  },
  teamInfo() {
    const teamInfo = new TeamInfo({model: this.model});
    teamInfo.render();
  },
  addPaymentMethod() {
    console.log('Hello PM', BtFormView);
    if (!_.isUndefined(this.mainView)) {
      this.mainView.close();
    }
    this.mainView = new BtFormView({org: this.model});
    this.mainView.render();
  }
});
