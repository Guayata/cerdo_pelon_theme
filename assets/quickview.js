//Quick View

$(document).ready(function () {
  $.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function() {
    quickView();
  });
});

function quickView() {
        $(document).on("click", "#qv-add-button", function () {
            var product_handle = $('#quick-view').attr('class');
          var qty = $('.qv-quantity').val();
          var selectedOptions = '';
          var var_id = '';
          $('#quick-view select').each(function (i) {
            if (selectedOptions == '') {
              selectedOptions = $(this).val();
            } else {
              selectedOptions = selectedOptions + ' / ' + $(this).val();
            }
          });
          jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
            $(product.variants).each(function (i, v) {
              if (v.title == selectedOptions) {
                var_id = v.id;
                processCart();
              }
            });
          });
          function processCart() {
            jQuery.post('/cart/add.js', {
              quantity: qty,
              id: var_id
            },
                        null,
                        "json"
                       ).done(function () {
              $('body').trigger('added.ajaxProduct', $('#qv-add-button'));
                      document.dispatchEvent(new CustomEvent('ajaxProduct:added', {
                        detail: {
                          product: var_id
                        }
                      }));
              $.fancybox.close();
              /*$('.qv-add-to-cart-response').addClass('success').html('<span>' + $('#qv-product-title-principal').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');*/
            })
            .fail(function ($xhr) {
              var data = $xhr.responseJSON;
              $('.qv-add-to-cart-response').addClass('error').html('<span><b>ERROR: </b>' + data.description);
            });
          }
        });
  
  function showModal(product, productVariant, product_handle){
    console.log(product);
    var contProd = product.description.split("|");
    /*IZQUIERDO*/
    $("#quick-view .grid__item").css('background-image', 'url(' + product.media[product.media.length-1].src + ')');
    $(".content-buttons-buy").css('background-image', 'url(' + product.media[product.media.length-1].src + ')');
    /*if(productVariant.variants.length == 0){
      $('#qv-product-title-principal').text(product.title +' · '+ productVariant.gramaje);
    }else{
      $('#qv-product-title-principal').text(product.title +' · '+ productVariant.variants[0].gramaje);
    }*/
    $('.page-content--product').attr('data-limoniapps-discountninja-product-handle', product.handle);
    $('#qv-product-title-principal').text(product.title);
    $('.qv-product-subtitle').text(contProd[2].replace(/<[^>]*>?/gm, ''));
    /*IZQUIERDO*/
    /*DERECHO*/
    $('#qv-product-info').append(contProd[3]);
    if(productVariant.variants.length == 0){
      $('#qv-product-title-blank').text(product.title +' · '+ productVariant.gramaje);
      $('#qv-product-neto').text(productVariant.presentacion);
    }else{
      $('#qv-product-title-blank').text(product.title +' · '+ productVariant.variants[0].gramaje);
      $('#qv-product-neto').text(productVariant.variants[0].presentacion);
    }
    $('#qv-ideal-para').append(contProd[4]);
    $('#qv-ideal-desc').append(contProd[5]);
    /*VARIANTES*/

    /*VARIANTES*/
    if(contProd[6].replace(/<[^>]*>?/gm, '').length == 1){
      $('#qv-acidometro-title').addClass("collapse");
      $('#qv-acidometro-imagen').addClass("collapse");
    }else{
      $('#qv-acidometro-title').text(contProd[6].replace(/<[^>]*>?/gm, ''));
      $('#qv-acidometro-imagen').append(contProd[7]);
      $('#qv-acidometro-title').removeClass("collapse");
      $('#qv-acidometro-imagen').removeClass("collapse");
    }
    $('#qv-ingredientes').text(contProd[8].replace(/<[^>]*>?/gm, ''));
    $('#qv-descripcion').text(contProd[9].replace(/<[^>]*>?/gm, ''));
    $('#qv-tabla-nutricional').text(contProd[10].replace(/<[^>]*>?/gm, ''));
    /*FALTA LA EXCEPCIÓN DE LA VARIANTE*/
    $('#qv-tabla-nutricional-imagen').append(contProd[11]); 
    /*FALTA LA EXCEPCIÓN DE LA VARIANTE*/
    $('#qv-imagen-product-end').append(contProd[12]);
    $('#qv-descripcion-product-end').append("<span style='background: #"+contProd[1].replace(/<[^>]*>?/gm, '')+";'>"+contProd[13].replace(/<[^>]*>?/gm, '')+"</span>");
    /*DERECHO*/

    var type = product.type;
    var price = 0;
    var original_price = 0;
    var desc = product.description;
    var images = product.images;
    var variants = product.variants;
    var options = product.options;
    var url = '/products/' + product_handle;

    $('.view-product').attr('href', url);
    $('#qv-descripcion-product-url a').attr('href', url);
    
    var imageCount = $(images).length;
    $(images).each(function (i, image) {
      if (i <= (imageCount - 2)) {
        var image_embed = '<div><img class="lazyload" data-src="' + image + '"></div>';
        image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
        $('.qv-product-images').append(image_embed);
      }
    });
    $('.qv-product-images').slick({
      'dots': false,
      'arrows': true,
      'autoplay': true,
      'autoplaySpeed': 2000,	
      'respondTo': 'min',
      'useTransform': false
    }).css('opacity', '1');

    if(options[0].values.length>1){
      $('.qv-product-options').parent().show();
    }else{
      $('.qv-product-options').parent().hide();
    }
    $(options).each(function (i, option) {
      var opt = option.name;
      var selectClass = '.option.' + opt.toLowerCase();
      $('.qv-product-options').append('<select class="option-' + i + ' option ' + opt.toLowerCase() + '"></select>');
      $(option.values).each(function (i, value) {
        $('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
      });
    });
    $('#quick-view').find('.js-qty__wrapper').each(function() {
      new theme.QtySelector($(this), {
        namespace: '.product'
      });
    });
    $(product.variants).each(function (i, v) {
      if (v.inventory_quantity == 0) {
        $('#qv-add-button').prop('disabled', true).val('Sold Out');
        $('.qv-add-to-cart').hide();
        $('#qv-product-price').text('Sold Out').show();
        return true
      } else {
        price = parseFloat(v.price / 100).toFixed(2);
        original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
        $('#qv-product-price').text('$' + price);
        if (original_price > 0) {
          $('#qv-product-original-price').text('$' + original_price).show();
        } else {
          $('#qv-product-original-price').hide();
        }
        $('select.option-0').val(v.option1);
        $('select.option-1').val(v.option2);
        $('select.option-2').val(v.option3);
        return false
      }
    });  
  }
  
  $(".modalProductClic").click(function () {
    if ($('#quick-view').length == 0){$("body").append('<div id="quick-view"></div>');}
    var product_handle = $(this).data('handle');
    $('#quick-view').addClass(product_handle);
    var promesa1=jQuery.getJSON('/products/' + product_handle + '.js');
    var promesa2=jQuery.get('/products/' + product_handle + '?view=metafield');

    $.when (promesa1, promesa2).done(function (product,productVariant) {
      showModal(product[0], $.parseJSON(productVariant[0]), product_handle);
      $(document).on("change", "#quick-view select", function () {
        var selectedOptions = '';
        $('#quick-view select').each(function (i) {
          if (selectedOptions == '') {
            selectedOptions = $(this).val();
          } else {
            selectedOptions = selectedOptions + ' / ' + $(this).val();
          }
        });
        $(product[0].variants).each(function (i, v) {
          if (v.title == selectedOptions) {
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;
            $('#qv-product-price').text('$' + price);
            $('#qv-product-neto').text("Cont. Neto por pieza: "+ $.parseJSON(productVariant[0]).variants[i].gramaje);
            $('#qv-product-original-price').text('$' + original_price);
            if (v_inv == null) {
              $('#qv-add-button').prop('disabled', false).val('COMPRAR');
            } else {
              if (v.inventory_quantity < 1) {
                $('#qv-add-button').prop('disabled', true).val('NO DISPONIBLE');
              } else {
                $('#qv-add-button').prop('disabled', false).val('COMPRAR');
              }
            }
          }
        });
      });
    });

    $.fancybox({
      href: '#quick-view',
      maxWidth: 1265,
      maxHeight: 715,
      fitToView: true,
      width: '75%',
      height: '70%',
      autoSize: false,
      closeClick: false,
      openEffect: 'none',
      closeEffect: 'none',
      'beforeLoad': function () {
        
        $('.fancybox-wrap').css('overflow', 'hidden !important');
      },
      'afterShow': function () {
        $('#quick-view').hide().html(content).css('opacity', '1').fadeIn(function () {
          $('.qv-product-images').addClass('loaded');
        });
      },
      'afterClose': function () {
        $('#quick-view').removeClass().empty();
      }
    });
  });
};

$(window).resize(function () {
  if ($('#quick-view').is(':visible')) {
    $('.qv-product-images').slick('setPosition');
  }
});