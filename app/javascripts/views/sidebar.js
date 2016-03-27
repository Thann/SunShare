
require('stylesheets/sidebar.css');

var rivets = require('rivets');

var UploadModal = require('views/upload_modal');

var RTCWrapper = require('utilities/rtc_wrapper.js');
var PresLoader = require('utilities/presentation_loader.js');

module.exports = Backbone.View.extend({
  template: `
    <div id="sidebarHeader">
      Presentations:
      <div class="pull-right">
        <span class="fa fa-refresh"></span>
        <span class="fa fa-upload"></span>
      </div>
    </div>
    <ul id="folders">
      <li rv-each-folder="folders | to_a">
        <span>{ folder.key }</span>
        <ul id="presentations">
          <li rv-each-item="folder.value | to_a" rv-data-path="folder.key |+ '/' |+ item.key">
            { item.key }
            <span>({ item.value | length })</span>
            <span class="fa fa-trash pull-right"><span>
          </li>
        </ul>
      </li>
    </ul>
    <div id="sidebarLoading" rv-hide="folders">Loading ....</div>
  `,
  events: {
    'click #presentations > li': function(e) {
      RTCWrapper.state.presentation = $(e.currentTarget).data('path');
      RTCWrapper.state.slide = 0;
      RTCWrapper.syncState();
    },
    'click .fa-refresh': function() {
      this.getList();
      this.scope.folders = null;
    },
    'click .fa-upload': function() {
      var m = (new UploadModal()).render();
    },
    'click .fa-trash': function(e) {
      var self = this;
      e.stopImmediatePropagation();
      PresLoader.delete($(e.currentTarget).parent().data('path'), function() {
        self.getList();
      });
    }
  },
  initialize: function() {
    this.getList();
    var self = this;
    RTCWrapper.onStateChange(function(old, newState) {
      if (old.presentation !== newState.presentation) {
        // Keep selection in sync.
        self.$('.selected').removeClass('selected');
        if (newState.presentation)
          self.$('li[data-path="'+newState.presentation+'"]').addClass('selected');
      }
    });
  },
  getList: function() {
    var self = this;
    PresLoader.getList(function(list) {
      self.scope.folders = list;
      self.render();
    });
  },
  render: function() {
    this.$el.html(this.template);
    rivets.bind(this.$el, this.scope);

    this.$('li[data-path="'+RTCWrapper.state.presentation+'"]').addClass('selected');
    return this;
  },
  scope: {}
});
