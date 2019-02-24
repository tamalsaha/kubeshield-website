/* @flow */
const _ = require('lodash');
const toastr = require('toastr');

function parse(msg) {
  if (_.isString(msg)) {
    return msg ? msg : 'Failed to connect to api server. Please try again later.';
  }
  return _.get(msg, 'status.message', msg.status.status);
}

// msg: string or response object
function showWarning(msg, headline) {
  toastr.warning(parse(msg), headline || 'Warning', {
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-right',
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
}

// msg: string or response object
function showSuccess(msg, headline) {
  toastr.success(parse(msg), headline || 'Success', {
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-right',
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
}

// msg: string or response object
function showError(msg, headline) {
  toastr.error(parse(msg), headline || 'Error', {
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-right',
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
}

module.exports = {
  showWarning: showWarning,
  showSuccess: showSuccess,
  showError: showError
};
