import Ember from 'ember';
// import config from '../config/environment';

const {
  Service,
  String: { underscore }
} = Ember;

const DRUPAL_FIELD_PREFIX = 'field_';

export default Service.extend({
  init() {
    let config = Ember.getOwner(this).resolveRegistration('config:environment');    this._super(...arguments);
    this.map = config.drupalEntityModels || {};
  },
  entityFor(modelName) {
    if (undefined === this.map[modelName]) {
      return 'node';
    }
    let modelMap = this.map[modelName];
    return modelMap.entity;
  },
  bundleFor(modelName) {
    if (undefined === this.map[modelName]) {
      return modelName;
    }
    let modelMap = this.map[modelName];
    return modelMap.bundle;
  },
  fieldName(modelName, fieldName) {
    let modelMap = this.map[modelName] || {},
        fields = modelMap.fields || [];

    if (fields.includes(fieldName)) {
      return DRUPAL_FIELD_PREFIX + underscore(fieldName);
    }

    return underscore(fieldName);
  }
});
