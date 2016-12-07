# ember-data-drupal

Initial docs can be found at http://boris.com.au/ember-data-drupal.

## Installation

    ember install ember-data-drupal

## Usage

This addon provides an adapter and serializer that can be used application wide or on a per model basis in the usual way:

    // app/adapter/application.js
    import DrupalJSONAPIAdapter from 'ember-data-drupal/adapter';
    export default DrupalJSONAPIAdapter.extend();

    // app/serializer/application.js
    import DrupalJSONAPISerializer from 'ember-data-drupal/serializer';
    export default DrupalJSONAPISerializer.extend();

### Configuration

Mapping of Ember data models to Drupal entities is currently done in application config:

e.g.

    // config/environment.js
    module.exports = function(environment) {
      var ENV = {
        drupalEntityModels: {
          // Map 'article' ember data model to Drupal entity type 'node'.
          "article": { },
          // Map 'public-event' ember data model to Drupal entity type 'node',
          // entity bundle type 'event'.
          // Also map event model fields 'location' and 'relatedArticle' to
          // 'field_location' and 'field_related_article' payload keys respectively.
          "public-event": { entity: 'node', bundle: 'event', fields: ['location', 'relatedArticle'] },
        }
      }
    }

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
