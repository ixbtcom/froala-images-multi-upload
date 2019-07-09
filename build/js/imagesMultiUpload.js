'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @todo setTimeout in {@link ImageUpload.prototype.trigger}
 */

/* eslint-disable */
if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

/* global define:true */
!function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function (root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      return factory(jQuery);
    };
  } else {
    // Browser globals
    factory(window.jQuery);
  }
  /* eslint-enable */
}(function ($) {
  var PLUGIN_NAME = 'imagesMultiUpload';
  var POPUP_NAME = PLUGIN_NAME + '.popup';

  var dropZone = '\n    <div class="fr-image-upload-layer fr-active fr-layer fp-image-upload-dropzone">\n      <strong>\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435</strong><br>(\u0438\u043B\u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435)\n      <div class="fr-form">\n        <input type="file" multiple="" accept="image/jpeg, image/jpg, image/png, image/gif" \n            tabindex="-1" aria-labelledby="fr-image-upload-layer-1" role="button" dir="auto">\n      </div>\n    </div>';
  var multiUpload = '\n    <div class="multi-upload">\n    <div class="multi-upload__content"></div>\n    <div class="multi-upload__buttons">\n    <div class="multi-upload__upload-type-select">\n        <input type="radio" class="multi-upload__select-upload-type" id="select-upload-thumbnail" name="select-type" value="select-upload-thumbnail" checked>\n        <label for="select-upload-thumbnail">\u041F\u0440\u0435\u0432\u044C\u044E \u0441\u043E \u0441\u0441\u044B\u043B\u043A\u043E\u0439 \u043D\u0430 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B</label>\n        <input type="radio" class="multi-upload__select-upload-type" id="select-upload-resize" name="select-type" value="select-upload-resize">\n        <label for="select-upload-resize">\u0423\u043C\u0435\u043D\u044C\u0448\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443</label>\n    </div>\n    <div class="multi-upload__upload-optimize-select">  \n        <input type="checkbox" class="multi-upload__select-optimize" id="select-optimize" name="select-optimize" value="select-optimize" checked>\n        <label for="select-optimize">\u041E\u043F\u0442\u0438\u043C\u0438\u0437\u0430\u0446\u0438\u044F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F</label>\n        <input type="checkbox" class="multi-upload__select-optimize" id="select-keepfull" name="select-keepfull" value="select-keepfull">\n        <label for="select-keepfull">\u041E\u0441\u0442\u0430\u0432\u043B\u044F\u0442\u044C \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044B \u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 (\u0434\u043B\u044F \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0445 \u0444\u043E\u0442\u043E)</label>\n    </div>\n    <div class="multi-upload__upload-size-select"> \n        <span class="multi-upload__upload-size-select__label">\u0420\u0430\u0437\u043C\u0435\u0440\u044B \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F</span>\n        <input type="radio" class="multi-upload__select-size-radio" id="select-size-full" name="select-size" value="select-size-full" checked>\n        <label for="select-size-full">100%</label>\n        <input type="radio" class="multi-upload__select-size-radio" id="select-size-1_2" name="select-size" value="select-size-1_2">\n        <label for="select-size-1_2">1/2</label>\n        <input type="radio" class="multi-upload__select-size-radio" id="select-size-1_3" name="select-size" value="select-size-1_3">\n        <label for="select-size-1_3">1/3</label>\n        <input type="radio" class="multi-upload__select-size-radio" id="select-size-1_4" name="select-size" value="select-size-1_4">\n        <label for="select-size-1_4">1/4</label>\n    </div>\n        <button class="multi-upload__btn multi-upload__insert-btn" disabled>Insert images</button>\n        <button class="multi-upload__btn multi-upload__cancel-btn">Cancel</button>\n    </div></div>';
  var dropTemplate = '<div class="images-multi-upload">' + dropZone + multiUpload + '</div>';

  var IMAGE_UPLOAD_STATUS_PENDING = 1;
  var IMAGE_UPLOAD_STATUS_SUCCESS = 2;
  var IMAGE_UPLOAD_STATUS_ERROR = 3;

  var ImageUpload = function () {
    function ImageUpload(options) {
      _classCallCheck(this, ImageUpload);

      this.$el = $('\n      <div class="upload-image">\n        <div class="upload-image__container">\n        <div class="upload-image__progressbar"><div class="upload-image__progressbar-line"></div></div>\n        <div class="upload-image__image"></div>\n        <button title="remove" class="upload-image__close-btn">x</button>\n        </div></div>');
      this.editor = options.editor;
      this.$image = this.$el.find('.upload-image__image');
      this.$closeBtn = this.$el.find('.upload-image__close-btn');
      this.$progressLine = this.$el.find('.upload-image__progressbar-line');
      this.image = options.file;
      this.url = null;
      this.status = 0;
      this.xhr = null;

      this.handleEvents();
    }

    _createClass(ImageUpload, [{
      key: 'handleEvents',
      value: function handleEvents() {
        this.$closeBtn.on('click', this.onRemove.bind(this));
      }
    }, {
      key: 'getStatus',
      value: function getStatus() {
        return this.status;
      }
    }, {
      key: 'abortXhr',
      value: function abortXhr() {
        this.xhr.abort();
        return this;
      }
    }, {
      key: 'startLoading',
      value: function startLoading() {
        this.$el.addClass('upload-image--loading');
      }
    }, {
      key: 'stopLoading',
      value: function stopLoading() {
        this.$el.removeClass('upload-image--loading');
      }
    }, {
      key: 'readImage',
      value: function readImage() {
        var _this = this;

        if (ImageUpload.isFileReaderAvailable()) {
          var reader = new FileReader();
          reader.addEventListener('load', function (event) {
            _this.renderImage(event.target.result);
          });
          reader.readAsDataURL(this.image);
        }
      }
    }, {
      key: 'changeProgress',
      value: function changeProgress(progress) {
        this.$progressLine.css({ width: progress + '%' });
      }
    }, {
      key: 'renderImage',
      value: function renderImage(url) {
        this.renderUrl = url;
        this.$image.css({ backgroundImage: 'url(' + url + ')' });
      }
    }, {
      key: 'getUrl',
      value: function getUrl() {
        return this.url;
      }
    }, {
      key: 'error',
      value: function error() {
        this.$el.addClass('image-upload--error');
        this.setStatus(IMAGE_UPLOAD_STATUS_ERROR);
      }
    }, {
      key: 'upload',
      value: function upload() {
        var _this2 = this;

        if (!this.image) {
          console.error('Property `image` must be set');
          return;
        }
        this.readImage();
        this.setStatus(IMAGE_UPLOAD_STATUS_PENDING);
        this.startLoading();

        var formData = new FormData();
        formData.append(this.editor.opts.imageUploadParam, this.image, this.image.name);
        Object.keys(this.editor.opts.imageUploadParams).forEach(function (uploadParam) {
          formData.append(uploadParam, _this2.editor.opts.imageUploadParams[uploadParam]);
        });
        console.log(this.editor.opts.imageUploadURL);

        this.xhr = $.ajax({
          url: this.editor.opts.imageUploadURL,
          type: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          context: this,
          success: function success(data) {
            var response = data;
            if (typeof response === 'string') {
              response = JSON.parse(response);
            }
            if (!response.link) {
              _this2.error();
            }
            if (!ImageUpload.isFileReaderAvailable()) {
              _this2.renderImage(response.link);
            }
            _this2.url = response.link;
            _this2.setStatus(IMAGE_UPLOAD_STATUS_SUCCESS);
          },
          error: function error() {
            _this2.error();
          },
          complete: function complete() {
            _this2.stopLoading();
          },
          xhr: function xhr() {
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (evt) {
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total;
                percentComplete = parseInt(percentComplete * 100, 10);
                _this2.changeProgress(percentComplete);
              }
            }, false);
            return xhr;
          }
        });
      }
    }, {
      key: 'setStatus',
      value: function setStatus(status) {
        this.status = status;
        this.trigger('changeStatus', status);
      }
    }, {
      key: 'render',
      value: function render() {
        return this.$el;
      }
    }, {
      key: 'onRemove',
      value: function onRemove(event) {
        event.preventDefault();
        this.trigger('imageRemove', this);
      }
    }, {
      key: 'remove',
      value: function remove() {
        this.abortXhr();
        this.$el.remove();
      }
    }, {
      key: 'trigger',
      value: function trigger(eventName, data) {
        var _this3 = this;

        setTimeout(function () {
          _this3.$el.triggerHandler(eventName, data);
        }, 0);
      }
    }, {
      key: 'on',
      value: function on(event, handler) {
        this.$el.on(event, handler);
      }
    }], [{
      key: 'isFileReaderAvailable',
      value: function isFileReaderAvailable() {
        return window.File && window.FileReader && window.FileList && window.Blob;
      }
    }]);

    return ImageUpload;
  }();

  var ImageInsert = function () {
    function ImageInsert($img, editor) {
      _classCallCheck(this, ImageInsert);

      this.editor = editor;
      this.$el = $img;

      this.$el.addClass('image-insert');

      this.init();
    }

    _createClass(ImageInsert, [{
      key: 'init',
      value: function init() {
        var _this4 = this;

        var image = new Image();
        image.src = this.$el.data('uploaded_url');
        this.$el.addClass('image-insert--loading').attr('title', this.editor.language.translate('Loading image'));
        image.onload = function () {
          _this4.$el.removeClass('image-insert--loading').attr({ src: image.src, title: '' });
        };
        image.onerror = function () {
          _this4.$el.removeClass('image-insert--loading').addClass('image-insert--error');
        };
      }
    }]);

    return ImageInsert;
  }();

  var ImagesUpload = function () {
    function ImagesUpload(options) {
      _classCallCheck(this, ImagesUpload);

      this.$el = $(options.el);
      this.$content = this.$el.find('.multi-upload__content');
      this.$insertButton = this.$el.find('.multi-upload__insert-btn');
      this.$cancelButton = this.$el.find('.multi-upload__cancel-btn');
      this.editor = options.editor;
      this.images = [];
      this.dataAttrs = {};

      this.handleEvents();
    }

    _createClass(ImagesUpload, [{
      key: 'handleEvents',
      value: function handleEvents() {
        this.$insertButton.on('click.imagesUpload', this.onInsertButtonClick.bind(this));
        this.$cancelButton.on('click.imagesUpload,', this.onCancelClick.bind(this));
      }
    }, {
      key: 'clean',
      value: function clean() {
        this.abortXhr();
        this.images = [];
        this.$content.html('');
        this.checkInsertButton();
      }
    }, {
      key: 'abortXhr',
      value: function abortXhr() {
        this.images.forEach(function (image) {
          if (image.getStatus() !== IMAGE_UPLOAD_STATUS_SUCCESS) {
            image.abortXhr();
          }
        });
      }
    }, {
      key: 'onCancelClick',
      value: function onCancelClick() {
        this.editor.popups.hide(POPUP_NAME);
      }
    }, {
      key: 'onInsertButtonClick',
      value: function onInsertButtonClick() {
        if (!this.images || !this.images.length) {
          this.error('No images to insert');
          return;
        }
        this.editor.events.disableBlur();
        var uploadedImages = this.images.filter(function (image) {
          return image.getStatus() === IMAGE_UPLOAD_STATUS_SUCCESS;
        }).reverse();
        this.insertImages(uploadedImages);
        this.editor.events.enableBlur();
      }
    }, {
      key: 'error',
      value: function error(text) {
        console.error(text);
        return this;
      }
    }, {
      key: 'updateDataAttrs',
      value: function updateDataAttrs() {
        var c = this.$el;
        var attrs = {};
        attrs['select-type'] = c.find('[name=select-type]:checked').val();
        attrs['select-optimize'] = !!c.find('[name=select-optimize]:checked').length;
        attrs['select-keepfull'] = !!c.find('[name=select-keepfull]:checked').length;
        attrs['select-size'] = c.find('[name=select-size]:checked').val();
        this.dataAttrs = attrs;
      }
    }, {
      key: 'insertImages',
      value: function insertImages(images) {
        var _this5 = this;

        this.updateDataAttrs();
        var imgIndex = 0;
        this.editor.events.on('image.inserted', function ($img) {
          /* eslint-disable */
          new ImageInsert($img, _this5.editor);
          _this5.editor.selection.setAfter($img.get(0));
          /* eslint-enable */
          imgIndex += 1;
          if (!images[imgIndex]) {
            _this5.clean();
            return;
          }
          _this5.insertImage(images[imgIndex]);
        });
        this.insertImage(images[imgIndex]);
      }
    }, {
      key: 'insertImage',
      value: function insertImage(image) {
        var dataAttrs = this.dataAttrs;
        dataAttrs['uploaded_url'] = image.getUrl();
        this.editor.image.insert(image.renderUrl, false, dataAttrs, null);
      }
    }, {
      key: 'add',
      value: function add(files) {
        var _this6 = this;

        if (!files || !(files instanceof FileList)) {
          this.error('No files are to add');
          return;
        }

        if (!this.$el.length) {
          this.error('Container `el` must be set');
          return;
        }

        [].forEach.call(files, function (file) {
          if (_this6.validate(file)) {
            var image = new ImageUpload({ file: file, editor: _this6.editor });
            _this6.handleImageEvents(image);
            _this6.$content.append(image.render());
            image.upload();
            _this6.images.push(image);
          }
        });
      }
    }, {
      key: 'validate',
      value: function validate(file) {
        return this.editor.opts.imageAllowedTypes.indexOf(file.type.replace(/image\//g, '')) > -1 || file.size < this.editor.opts.imageMaxSize;
      }
    }, {
      key: 'handleImageEvents',
      value: function handleImageEvents(image) {
        image.on('imageRemove', this.onImageRemove.bind(this, image));
        image.on('changeStatus', this.onStatusChange.bind(this));
      }
    }, {
      key: 'onStatusChange',
      value: function onStatusChange() {
        this.checkInsertButton();
      }
    }, {
      key: 'checkInsertButton',
      value: function checkInsertButton() {
        var disabled = !this.images.find(function (image) {
          return image.status === IMAGE_UPLOAD_STATUS_SUCCESS;
        });
        this.$insertButton.prop('disabled', disabled);
      }
    }, {
      key: 'onImageRemove',
      value: function onImageRemove(image) {
        var index = this.images.indexOf(image);
        if (index === -1) {
          return;
        }
        this.images.splice(index, 1);
        this.editor.events.disableBlur();
        image.remove();
        this.checkInsertButton();
        this.editor.events.enableBlur();
      }
    }]);

    return ImagesUpload;
  }();

  var UploadPopup = function () {
    function UploadPopup(options) {
      _classCallCheck(this, UploadPopup);

      this.editor = options.editor;
      this.template = options.template;
      this.name = options.name;
      this.$popup = null;
      this.imagesUpload = null;

      this.init();
    }

    _createClass(UploadPopup, [{
      key: 'init',
      value: function init() {
        var template = {
          custom_layer: this.template
        };

        this.$popup = this.editor.popups.create(this.name, template);
        this.imagesUpload = new ImagesUpload({
          editor: this.editor,
          el: this.$popup.find('.multi-upload')
        });
        this.handleEvents();
        return this.$popup;
      }
    }, {
      key: 'show',
      value: function show() {
        var editor = this.editor;

        editor.popups.setContainer(this.name, editor.$tb);
        var $btn = editor.$tb.find('.fr-command[data-cmd="' + PLUGIN_NAME + '"]');
        var left = $btn.offset().left + $btn.outerWidth() / 2; // prettier-ignore
        var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);
        editor.popups.show(this.name, left, top, $btn.outerHeight());
      }
    }, {
      key: 'handleEvents',
      value: function handleEvents() {
        var _this7 = this;

        var editor = this.editor,
            $popup = this.$popup,
            imagesUpload = this.imagesUpload;


        editor.events.$on($popup, 'change', '.fr-image-upload-layer input[type="file"]', function (event) {
          var ed = $popup.data('instance') || editor;
          ed.events.disableBlur();
          imagesUpload.add(event.currentTarget.files);
          _this7.value = null; // reset input file
          ed.events.enableBlur();
        });

        editor.events.$on($popup, 'dragover dragenter', '.fr-image-upload-layer', function (event) {
          $(event.currentTarget).addClass('fr-drop');
          return false;
        }, true);

        editor.events.$on($popup, 'dragleave dragend', '.fr-image-upload-layer', function (event) {
          $(event.currentTarget).removeClass('fr-drop');
          return false;
        }, true);

        editor.events.$on($popup, 'drop', '.fr-image-upload-layer', function (event) {
          event.preventDefault();
          $(event.currentTarget).removeClass('fr-drop');
          var dataTransfer = event.originalEvent.dataTransfer;

          if (dataTransfer && dataTransfer.files) {
            var ed = $popup.data('instance') || editor;
            ed.events.disableBlur();
            imagesUpload.add(dataTransfer.files);
            ed.events.enableBlur();
          }
        }, true);

        if (editor.helpers.isIOS()) {
          editor.events.$on($popup, 'touchstart', '.fr-image-upload-layer input[type="file"]', function (event) {
            $(event.currentTarget).trigger('click');
          }, true);
        }
      }
    }]);

    return UploadPopup;
  }();

  var templates = {};
  templates[POPUP_NAME] = '[_CUSTOM_LAYER_]';
  $.extend($.FroalaEditor.POPUP_TEMPLATES, templates);

  /* eslint-disable */
  $.FroalaEditor.PLUGINS[PLUGIN_NAME] = function (editor) {
    /* eslint-enable */
    var uploadPopup = void 0;

    function showPopup() {
      if (!uploadPopup) {
        uploadPopup = new UploadPopup({
          editor: editor,
          template: dropTemplate,
          name: POPUP_NAME
        });
      }
      uploadPopup.show();
    }

    return {
      showPopup: showPopup
    };
  };

  var icon = PLUGIN_NAME + 'Icon';
  $.FroalaEditor.DefineIcon(icon, { NAME: 'file-image-o' });
  $.FroalaEditor.RegisterCommand(PLUGIN_NAME, {
    title: 'Загрузить галерею',
    icon: icon,
    undo: false,
    focus: false,
    plugin: PLUGIN_NAME,
    showOnMobile: true,
    callback: function callback() {
      this[PLUGIN_NAME].showPopup();
    }
  });
});