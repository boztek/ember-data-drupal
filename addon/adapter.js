import Ember from "ember";
import DS from "ember-data";

const {
  get,
  inject: { service }
} = Ember;

export default DS.JSONAPIAdapter.extend({
  namespace: 'api',
  drupalMapper: service(),

  pathForType(modelName) {
    let drupalMapper = get(this, 'drupalMapper'),
        entity = drupalMapper.entityFor(modelName),
        bundle = drupalMapper.bundleFor(modelName);
    return entity + '/' + bundle;
  },

  buildQuery(snapshot) {
    let query = this._super(...arguments);
    query._format = 'api_json';
    return query;
  },
});