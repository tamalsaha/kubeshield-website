const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;
require('../plugins/backbone.analytics.js');
const cowrypayClient = require('cowrypay-client');


const xhrConfig = require('grpc-xhr/config');
const origin = window.location.hostname;
if (origin.endsWith('appscode.com')) {
  xhrConfig.domain = 'https://api.appscode.com';
  global.cowrypayApiServer = 'https://cowrypay-api.appscode.com';
  global.cowrypayNamespace = 'appscode';
} else if (origin.endsWith('appscode.info')) {
  xhrConfig.domain = 'https://api.appscode.info';
  global.cowrypayApiServer = 'https://cowrypay-api.appscode.info';
  global.cowrypayNamespace = 'appscode';
} else {
  xhrConfig.domain = 'http://localhost:9877/_appscode/api';
  global.cowrypayApiServer = 'http://localhost:9866';
  global.cowrypayNamespace = 'cowrypay';
}

const Org = require('../models/org');
const OrgRouter = require('../routers/signup.router');
const ConfirmFormView = require('../views/confirm-form-view');
const InvitationFormView = require('../views/invitation-form-view');
const WelcomePage = require('../views/welcome-page-view');

global.ENTER_KEY = 13;
global.ESC_KEY = 27;

global.nunjucksEnv = new global.nunjucks.Environment(new global.nunjucks.PrecompiledLoader());
global.Backbone = Backbone;

const org = new Org();

const router = new OrgRouter({org});
const confirmFormView = new ConfirmFormView({org});
const invitationFormView = new InvitationFormView({org});
const welcomeView = new WelcomePage({org});

router.on('route:confirm', ()=> {
  confirmFormView.render();
});

router.on('route:invitation', ()=> {
  invitationFormView.render();
});

router.on('route:welcome', ()=> {
  $.urlParam = (name) => {
    const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
  };
  const username = $.urlParam('username');
  welcomeView.render({username});
});

Backbone.history.start();

global.dangerMessg = (messg, headline)=> {
  global.toastr.error(messg, headline, {
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  });
};

(function getClientToken(orgg) {
  const conf = { domain: global.cowrypayApiServer };

  cowrypayClient.billing.v1beta1.paymentMethodService.clientToken({ namespace: global.cowrypayNamespace }, conf)
    .then((resp) => {
      orgg.set({clientToken: resp.token});
    })
    .catch((err) => {
      global.dangerMessg(err.response.message, 'Error');
    });
})(org);
