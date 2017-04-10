import Ember from 'ember';

const {
  getOwner,
  Service,
  String: { underscore }
} = Ember;

const DRUPAL_FIELD_PREFIX = 'field_';

export default Service.extend({
  init() {
    let config = getOwner(this).resolveRegistration('config:environment');
    this._super(...arguments);
    this.map = config.drupalEntityModels || {};
  },

  entityFor(modelName) {
    let modelMap = this.map[modelName] || {};
    return modelMap.entity || 'node';
  },

  bundleFor(modelName) {
    let modelMap = this.map[modelName] || {};
    return modelMap.bundle || modelName;
  },

  fieldName(modelName, fieldName) {
    let modelMap = this.map[modelName] || {},
        fields = modelMap.fields || [];
    if (fields.includes(fieldName)) {
      return DRUPAL_FIELD_PREFIX + underscore(fieldName);
    }
    return underscore(fieldName);
  },

  isMapped(modelName) {
    return this.map.hasOwnProperty(modelName);
  },

  modelNameFor(entity, bundle) {
    return Object.keys(this.map).find(modelName => {
      const modelMap = this.map[modelName];
      modelMap.entity = modelMap.entity || 'node';

      const bundleMatches = modelMap.bundle === bundle || modelMap.bundle === undefined && modelName === bundle;
      if (bundleMatches && modelMap.entity === entity) {
        return true;
      }
    });
  }
});