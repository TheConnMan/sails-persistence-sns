var extend = require('extend');
var Promise = require('bluebird');
var AWS = require('aws-sdk');

var log4js = require('log4js');
var logger = log4js.getLogger('sails-persistence-sns');

var defaultOptions = {
  logger: logger,
  region: 'us-east-1'
};

module.exports = function(overrides) {
  var options = extend(true, {}, defaultOptions, overrides || {});
  AWS.config.update({
    region: options.region
  });
  var snsClient = new AWS.SNS();
  return {
    afterCreate: function(record, me) {
      return putRecord(snsClient, options, 'CREATE', me, record);
    },

    afterUpdate: function(record, me) {
      return putRecord(snsClient, options, 'UPDATE', me, record);
    },

    afterDestroy: function(records, me) {
      return Promise.all(records.map(record => {
        return putRecord(snsClient, options, 'DESTROY', me, record);
      }));
    }
  };
};

function putRecord(snsClient, options, action, me, record) {
  return new Promise((resolve, reject) => {
    snsClient.publish({
      Message: JSON.stringify({
        action,
        model: me.identity,
        record
      }),
      TargetArn: options.snsTopicArn
    }, (err, data) => {
      if (err) {
        if (options.logger) {
          logger.error('Error sending persistence event to SNS', err);
        }
        resolve(err);
      } else {
        resolve(data);
      }
    });
  });
}
