import Bloodhound from 'typeahead.js';
import APIRequest from './ApiRequest';

var $searchXHR;

var SearchEngine = new Bloodhound({
  hint: true,
  highlight: true,
  minLength: 3,
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    rateLimitWait: 500,
    cache: false,
    url: 'search',
    prepare: function(query, settings) {
      var _settings = {
        query: query
      };
      return _settings;
    },

    transport: function(settings, onSuccess, onError) {
      if ($searchXHR) {
        $searchXHR.abort();
      }

      $searchXHR = APIRequest.get({
        resource: 'search',
        data: {
          q: settings.query
        }
      });

      $searchXHR.done(function(response, status, xhr) {
        onSuccess(response);
      }).fail(function(xhr, status, error) {
        onError(error);
      });
    },

    transform: function(response) {
      var items = [];
      if (response.data) {
        for (var i = 0; i < response.data.length; i++) {
          var item = response.data[i];
          var newItem = {
            id: item.id,
            name: 'Item type ' + item.type + ' is not supported',
            kind: 'Unsupported',
            data: item
          };

          switch (item.type) {
            case 'search_resources':
              newItem = {
                id: item.id,
                name: item.attributes.name,
                resource_type: item.attributes.resource_type,
                label: item.attributes.label,
                data: item
              };
              break;
            case 'tips':
              newItem = {
                id: item.id,
                name: item.attributes.title,
                kind: 'Card',
                data: item
              };
              break;
            case 'questions':
              newItem = {
                id: item.id,
                name: item.attributes.title,
                kind: 'Question',
                data: item
              };
              break;
            case 'topics':
              newItem = {
                id: item.id,
                name: item.attributes.title,
                kind: 'Topic',
                data: item
              };
              break;
            case 'users':
              newItem = {
                id: item.id,
                name: item.attributes.name,
                kind: 'User',
                data: item
              };
              break;
            case 'domain_members':
              newItem = {
                id: item.id,
                name: item.attributes.name,
                kind: 'User',
                data: item
              };
              break;
          }

          items.push(newItem);
        }
      }
      return items;
    }
  }
});

SearchEngine.initialize();

export default SearchEngine;
