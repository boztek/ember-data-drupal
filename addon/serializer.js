import DS from 'ember-data';
import Ember from 'ember';
import { singularize } from 'ember-inflector';

const {
  JSONAPISerializer,
  normalizeModelName,
} = DS;

const {
  get,
  inject: { service },
  String: { underscore },
} = Ember;

const DRUPAL_FIELD_PREFIX = 'field_';

const DrupalJSONAPISerializer = JSONAPISerializer.extend({
  drupalMapper: service(),

  keyForModelAttribute: function(modelName, attr) {
    return get(this, 'drupalMapper').fieldName(modelName, attr);
  },

  keyForModelRelationship: function(modelName, attr) {
    return get(this, 'drupalMapper').fieldName(modelName, attr);
  },

  modelNameFromPayloadKey(key) {
    const parts = key.split('--');
    if (parts.length === 2) {
      const entity = parts[0];
      const bundle = parts[1];
      return this.get('drupalMapper').modelNameFor(entity, bundle) || singularize(normalizeModelName(bundle));
    }
    return singularize(normalizeModelName(key));
  },

  payloadKeyFromModelName(modelName) {
    const drupalMapper = this.get('drupalMapper');
    if (drupalMapper.isMapped(modelName)) {
      const entity = drupalMapper.entityFor(modelName);
      const bundle = drupalMapper.bundleFor(modelName);
      return `${entity}--${bundle}`;
    }
    return modelName;
  },

  extractAttributes(modelClass, resourceHash) {
    let modelClassString = modelClass.toString(),
        modelName = modelClassString.split(':')[1],
        attributes = {};
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
        modelName = modelClassString.split(':')[1],
        relationships = {};
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