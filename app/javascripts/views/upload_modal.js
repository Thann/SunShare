
require('stylesheets/upload_modal.css');

var rivets = require('rivets');

var PresLoader = require('utilities/presentation_loader.js');

module.exports = Backbone.View.extend({
  className: 'modal fade upload',
  template: `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Upload Presentation</h4>
        </div>

        <div class="modal-body">
          <form class="form-inline">
            <div class="form-group">
              <!-- <label for="presName"></label> -->
              <input id="presName" type="text" placeholder="Presentation Name" name="name" class="form-control">
            </div>
            <div class="btn-group" data-toggle="buttons">
              <label class="btn btn-default active">
                <input type="radio" name="options" id="option1" autocomplete="off" checked>
                Global
              </label>
              <label class="btn btn-default">
                <input type="radio" name="options" id="option2" autocomplete="off">
                User
              </label>
            </div>
            <span class="btn btn-default btn-file">
              Select File <input type="file">
            </span>
          </form>
          <div class="alert alert-danger" rv-show="errorMsg">
            <strong>Error:</strong> { errorMsg }
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary upload">Upload</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  `,
  events: {
    'hidden.bs.modal': function(e) {
      this.remove();
    },
    'click button.upload': function() {
      this.scope.errorMsg = "Not Yet Implemented =["
      // var self = this;
      // PresLoader.upload($(e.currentTarget).data('folder'), function() {
      //   self.getList();
      // });
    },
  },
  initialize: function() {
    this.scope = {};
  },
  render: function() {
    this.$el.html(this.template);
    rivets.bind(this.$el, this.scope);

    this.$el.modal();
    return this;
  },
  scope: {},
});
