  var aya = aya || {};
  (function($, window, document, undefined) {

      'use strict';

      var readAYAURL = function(input) {


          if (input.files && input.files[0]) {

              var filesArray = Array.prototype.slice.call(input.files);
              filesArray.forEach(function(fileElement) {

                  var reader = new FileReader();
                  reader.onload = function(e) {
                      var inputFilesArray = $(input).data('files') ? JSON.parse($(input).data('files')) : [];
                      var file = {
                          'name': fileElement.name,
                          'type': fileElement.type,
                          'doctype': $(input).attr('doctype')
                      }
                      var $wrapper = $(".thumbnails", $(input).closest('.file-explorer-wrapper'));
                      if ($wrapper.length <= 0) {
                          $(input).closest('.file-explorer-wrapper').append($("<div class='thumbnails' />"));
                          $wrapper = $(".thumbnails", $(input).closest('.file-explorer-wrapper'));
                      }
                      var $thumbnail = $("<div class='thumbnail'><a href='javascript:void(0)' class='close-btn'></a></div>");
                      var $img = $("<img />").attr('title', fileElement.name);
                      if (/\/pdf(?:\s|$)/.test(fileElement.type))
                          $img.attr('src', 'assets/img/sample/pdf.png');
                      else
                          $img.attr('src', e.target.result);
                      $thumbnail.find('a').append($img);
                      $wrapper.append($thumbnail);
                      file.base64Content = e.target.result;

                      inputFilesArray.push(file);
                      $(input).data('files', JSON.stringify(inputFilesArray));
                  };

                  reader.readAsDataURL(fileElement);
              });
          }
      };
      $(document).on('change', 'input[type="file"]', function() {
          console.log('das');
          var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
          $(this).siblings('input.file-explorer').val(filename).removeClass('error');
          if ($(this).hasClass('showthumb')) {
              readAYAURL(this);
          }
      });
      $(".file-explorer-wrapper").on('click', '.close-btn', function() {
          var title = $(this).find('img').attr('title');

          var input = $(this).closest('.file-explorer-wrapper').find('input[type="file"]');
          input.val('');
          input.prev('.file-explorer').val('');
          var inputFilesArray = input.data('files') ? JSON.parse(input.data('files')) : [];

          inputFilesArray = inputFilesArray.filter(function(value, index) {
              return value.name !== title;
          });
          $(input).attr('data-files', JSON.stringify(inputFilesArray));
          $(this).closest('.thumbnail').remove();
      });

      $(".form-section").on('click', '.form-section-heading .accordion-link', function() {
          $(this).toggleClass('fa-plus fa-minus');
          var $content = $(this).closest('.form-section-heading').siblings('.form-content').slideToggle();
      });


      /*  $(".form-submit").on("click", function() {
 var $form = $(this).closest('.form-validate');
      if ($form.length > 0) {
          $('html,body').animate({
              scrollTop: $form.offset().top - 150
          }, 10);

          var valid = fdf.form.validateForm($form);

          if (!valid) {
              return false;
          } else {
              var dataFiles = [];
              $('input[type="file"]', $form).each(function() {
                  var $th = $(this);
                  if ($th.data('files') && JSON.parse($th.data('files')).length > 0) {
                      dataFiles = dataFiles.concat(JSON.parse($th.data('files')));
                  }
              });
              var data = {
                  "Filesarray": {
                      "files": dataFiles,
                      "username": "kshankar",
                      "tragetlist": "/Lists/ArabYouthCreatorAttachments",
                      "tragetsite": "http://spnelson:2180/"
                  }
              };
              $('body').addClass('showLoader');
              $.ajax({
                  type: "GET",
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  crossDomain: true,
                  // data: JSON.stringify(data),
                  url: "http://spnelson:2180/_vti_bin/FDFAM/Upload/upload.svc/uploadfiles",
                  async: false,
                  success: function(msg) {
                      $('body').removeClass('showLoader');
                      return true;
                  },
                  error: function() {
                      $('body').removeClass('showLoader');
                      console.log('error');
                      return false;
                  }
              });
          }
      }

        }); */

  })(jQuery, window, document);