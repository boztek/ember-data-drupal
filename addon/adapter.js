import Ember from "ember";
import DS from "ember-data";

const {
  get,
  inject: { service }
} = Ember;

export default DS.JSONAPIAdapter.extend({
  namespace: 'jsonapi',
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

  query(store, type, query) {
    let drupalQuery = { filter: {} },
        queryFields = Object.keys(query),
        mapper = get(this, 'drupalMapper');

    queryFields.forEach((field) => {
      let fieldName = mapper.fieldName(type.modelName, field);
      drupalQuery.filter[fieldName] = drupalQuery.filter[fieldName] || {};
      drupalQuery.filter[fieldName]['value'] = query[field];
    });

    var url = this.buildURL(type.modelName, null, null, 'query', drupalQuery);

    if (this.sortQueryParams) {
      query = this.sortQueryParams(drupalQuery);
    }

    return this.ajax(url, 'GET', { data: query });
  },
});
