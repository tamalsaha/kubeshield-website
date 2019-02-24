const Backbone = require('backbone');
const $ = require('jquery');
Backbone.$ = $;
require('../plugins/backbone.analytics.js');

const xhrConfig = require('grpc-xhr/config');
const origin = window.location.hostname;
if (origin.endsWith('appscode.com')) {
  xhrConfig.domain = 'https://api.appscode.com';
} else if (origin.endsWith('appscode.info')) {
  xhrConfig.domain = 'https://api.appscode.info';
} else {
  xhrConfig.domain = 'http://localhost:9877';
}

const Org = require('../models/org');
const OrgRouter = require('../routers/signin.router');
const SigninFormView = require('../views/signin-form-view');

global.ENTER_KEY = 13;
global.ESC_KEY = 27;


global.nunjucksEnv = new global.nunjucks.Environment(new global.nunjucks.PrecompiledLoader());
global.Backbone = Backbone;

const org = new Org();

const router = new OrgRouter({org});
const signinFormView = new SigninFormView({org});

router.on('route:signin', () => {
  signinFormView.render();
});
Backbone.history.start();
module.exports = signinFormView;

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
