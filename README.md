# Sails Persistence SNS
[![NPM](https://nodei.co/npm/sails-persistence-sns.png)](https://nodei.co/npm/sails-persistence-sns/)

Automatically stream all Sails model persistence events to an SNS topic

## Install
`npm install --save sails-persistence-sns`

## Use
To use **Sails Persistence SNS** out of the box add the streamer to `config/models.js` default persistence hooks so it looks like the following example:

```javascript
var sailsPersistenceSns = require('sails-persistence-sns')();

module.exports.models = {
  afterCreate: function(record, cb) {
    sailsPersistenceSns.afterCreate(record, this).then(data => {
      cb();
    });
  },
  afterUpdate: function(record, cb) {
    sailsPersistenceSns.afterUpdate(record, this).then(data => {
      cb();
    });
  },
  afterDestroy: function(record, cb) {
    sailsPersistenceSns.afterDestroy(record, this).then(data => {
      cb();
    });
  }
};
```

## API
### `require('sails-persistence-sns')(options: Object)`
Initializes **Sails Persistence SNS** with the given options. All options are optional.
- `options.snsTopicArn`: SNS topic ARN (must exist already)
- `options.region`: (default: us-east-1) AWS region
- `options.logger`: Log4js compatible logger which **Sails Persistence SNS** will use (set to `null` for no logging)
