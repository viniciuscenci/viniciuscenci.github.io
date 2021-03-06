$(function(){
    var body = $('body');
    var overlay = null;
    var overlayContent = null;
    var corner = null;
    var closeOverlay = null;
    var isOverlayOpen = false;
    var Eden = {
        init: function(){
            body.append('<div id="overlay"></div><div id="overlayContent"></div><div id="corner"><a class="typcn typcn-times" href="#" id="closeOverlay"></a</div>');
            overlay = $('#overlay');
            overlayContent = $('#overlayContent');
            corner = $('#corner');
            closeOverlay = $('#closeOverlay');
            this.attachListeners();
            this.trackEscape();
            this.scrollLinks();
            this.responsive();
        },
        scrollLinks: function(){
            $('a[href*="#"]:not([href="#"])').click(function() {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                  var target = $(this.hash);
                  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                  if (target.length) {
                    $('html,body').animate({
                      scrollTop: target.offset().top - 50
                    }, 1000);
                    return false;
                  }
                }
            });
        },
        responsive: function(){
            function checkResponsive(ww){
                if(ww < 850)
                {
                    $('#gallery img').each(function(i,e){
                        var $this = $(e);
                        var src = $this.attr('src');
                        if(src.indexOf('-big-') <= -1){
                            $this.attr('src',src.replace('thumb-','thumb-big-'));
                        }
                    });
                }
            }
            $(window).resize($.debounce(100,function(){
                checkResponsive($(this).width());
            }));
            checkResponsive($(window).width());
        },
        trackEscape: function(){
            var _self = this;
            $(document).keyup(function(evt){
                if(evt.keyCode == 27){ //esc key
                    _self.closeOverlay();
                }
            });
        },
        attachListeners: function(){
            var _self = this;
            $('#location').click(function(){
                isOverlayOpen = true;
                _self.showOverlay("google");
                setTimeout(function(){
                    overlayContent.html('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3352.8626954595006!2d-52.204858012795604!3d-28.440869707956228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94e29ca44d91394d%3A0x6605a6e71e21b2f1!2sEden+Clube!5e1!3m2!1sen!2sbr!4v1453051532115" width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>').addClass('show');
                    corner.addClass('show google');
                },1000);
                return false;
            });
            closeOverlay.click(function(){
                _self.closeOverlay();
                return false;
            });
            $("#associados li a, .popup").click(function(){
                isOverlayOpen = true;
                _self.showOverlay();
                overlayContent.html($('#'+$(this).data('content')).html()).addClass('show assoc');
                corner.addClass('show');
                return false;
            });
            $('#contactSubmit').click(function(){
                var action = $(this).parent('form').attr('action');
                var nome = $('input#nome').val();
                var email = $('input#email').val();
                var mensagem = $('textarea#mensagem').val();
                var $messageContainer = $('#messages');

                if(nome == "" || email == "" || mensagem == ""){
                    $messageContainer.html('<p class="error"><span class="typcn typcn-warning"></span>Preencha todos os campos.</p>');
                    return false;
                }
                else{
                    $.ajax({
                        type: 'post',
                        url: action,
                        beforeSend: function(){
                            $messageContainer.html('<p><span class="typcn typcn-time"></span>Aguarde, enviando...</p>');
                        },
                        error: function(){
                            $messageContainer.html('<p class="error"><span class="typcn typcn-warning"></span>Ocorreu um erro. Tente novamente.</p>');
                        },
                        success: function(data){
                            if(data == "OK")
                                $messageContainer.html('<p class="success"><span class="typcn typcn-tick"></span>Mensagem enviada.</p>');
                            else
                                this.error();
                        }
                    });
                }
                return false;
            });
            $('#gallery a, .image-pop').click(function(){
                isOverlayOpen = true;
                var $this = $(this);
                var imgUrl = $this.attr('href');
                var caption = $this.find('img').attr('alt');
                caption = caption.length > 0 ? '<div id="photoCaption">'+caption+'</div>' : '';
                var image = new Image();
                image.classList.add('fadeIn');
                _self.showOverlay('gal');
                overlayContent.html('<div class="cssload-loader"></div>'+caption).addClass('show gal');
                corner.addClass('show');
                image.onload = function(){
                    $('.cssload-loader').remove();
                    overlayContent.find('img').remove();
                    overlayContent.append(image);
                };
                image.src = imgUrl;
                return false;
            });
        },
        showOverlay: function(classList){
            overlay.addClass("show "+classList);
            body.addClass('noOverflow');
        },
        closeOverlay: function(){
            if(!isOverlayOpen) return;
            corner.removeClass();
            overlay.removeClass();
            overlayContent.removeClass().html("");
            body.removeClass('noOverflow');
        }
    };
    Eden.init();
});

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);
