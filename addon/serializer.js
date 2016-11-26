import DS from 'ember-data';
import Ember from 'ember';
import { singularize } from 'ember-inflector';

const { normalizeModelName } = DS;
const {
  get,
  inject: { service },
  String: { underscore }
} = Ember;

const DRUPAL_FIELD_PREFIX = 'field_';

const DrupalJSONAPISerializer = DS.JSONAPISerializer.extend({
  drupalMapper: service(),

  keyForAttribute: function(attr) {
    let mapper = get(this, 'drupalMapper');
    if (mapper.isField(attr)) {
      return DRUPAL_FIELD_PREFIX + underscore(attr);
    }
    return underscore(attr);
  },

  keyForModelAttribute: function(modelName, attr) {
    let mapper = get(this, 'drupalMapper');
    return mapper.fieldName(modelName, attr);
  },

  keyForModelRelationship: function(modelName, attr) {
    let mapper = get(this, 'drupalMapper');
    return mapper.fieldName(modelName, attr);
  },

  modelNameFromPayloadKey(key) {
    let parts = key.split('--');
    if (parts.length === 2) {
      let bundle = parts[1];
      return bundle;
    }
    return singularize(normalizeModelName(key));
  },

  /**
    @method extractAttributes
    @param {DS.Model} modelClass
    @param {Object} resourceHash
    @return {Object}
  */
  extractAttributes(modelClass, resourceHash) {
    let modelClassString = modelClass.toString(),
        modelName = modelClassString.split(':')[1];

    var attributes = {};

    if (resourceHash.attributes) {
      modelClass.eachAttribute((key) => {
        let attributeKey = this.keyForModelAttribute(modelName, key);
        if (resourceHash.attributes[attributeKey] !== undefined) {
          attributes[key] = resourceHash.attributes[attributeKey];
        }
      });
    }
    return attributes;
  },

  extractRelationships(modelClass, resourceHash) {
    let modelClassString = modelClass.toString(),
        modelName = modelClassString.split(':')[1];

    let relationships = {};

    if (resourceHash.relationships) {
      modelClass.eachRelationship((key) => {
        let relationshipKey = this.keyForModelRelationship(modelName, key);
        if (resourceHash.relationships[relationshipKey] !== undefined) {

          let relationshipHash = resourceHash.relationships[relationshipKey];
          relationships[key] = this.extractRelationship(relationshipHash);

        }
      });
    }

    return relationships;
  },
});

export default DrupalJSONAPISerializer;