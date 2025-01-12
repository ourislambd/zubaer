
$(function() {
$('#main-menu').each(function() {
		var iTms = $(this).find('.LinkList ul > li').children('a'),
			iLen = iTms.length;
		for(var i = 0; i < iLen; i++) {
			var i1 = iTms.eq(i),
				t1 = i1.text();
			if(t1.charAt(0) !== '_') {
				var i2 = iTms.eq(i + 1),
					t2 = i2.text();
				if(t2.charAt(0) === '_') {
					var l1 = i1.parent();
					l1.append('<ul class="sub-menu m-sub"/>');
				}
			}
			if(t1.charAt(0) === '_') {
				i1.text(t1.replace('_', ''));
				i1.parent().appendTo(l1.children('.sub-menu'));
			}
		}
		for(var i = 0; i < iLen; i++) {
			var i3 = iTms.eq(i),
				t3 = i3.text();
			if(t3.charAt(0) !== '_') {
				var i4 = iTms.eq(i + 1),
					t4 = i4.text();
				if(t4.charAt(0) === '_') {
					var l2 = i3.parent();
					l2.append('<ul class="sub-menu2 m-sub"/>');
				}
			}
			if(t3.charAt(0) === '_') {
				i3.text(t3.replace('_', ''));
				i3.parent().appendTo(l2.children('.sub-menu2'));
			}
		}
		$('#main-menu ul li ul').parent('li').addClass('has-sub');
		$('#main-menu .widget').addClass('show-menu');
	});
	$('#main-menu-nav').clone().appendTo('.mobile-menu');
	$('.mobile-menu .has-sub').append('<div class="submenu-toggle"/>');
	$('.mobile-menu ul > li a').each(function() {
		var $this = $(this),
			text = $this.attr('href').trim(),
			type = text.toLowerCase(),
			map = text.split('/'),
			label = map[0];
		if(type.match('mega-menu')) {
			$this.attr('href', '/search/label/' + label + '?&max-results=' + postPerPage);
		}
	});
	$('.slide-menu-toggle').on('click', function() {
		$('body').toggleClass('nav-active');
	});
	
	$('.show-search').on('click', function() {
		$('#nav-search').fadeIn(250).find('input').focus();
	});
	$('.hide-search').on('click', function() {
		$('#nav-search').fadeOut(250).find('input').blur();
	});
       $('.mobile-menu ul li a').each(function() {
        var $this = $(this),
            ltx = $this.attr('href'),
            title = $(this).data('title'),
            text = ltx.toLowerCase();
        if (text.match('getmega')) {
            $this.parent('li').append('<div class="getMega">' + ltx + '</div>');
            $this.parent('li').find(".getMega").shortcode({
                getMega: function() {
                    var label = this.options.label,
                        type = this.options.type;
                    switch (type) {
                        case 'mtabs':
                            $this.parent('li').addClass('has-sub').append('<div class="submenu-toggle"/>');
                            $this.attr('href', '#');
                            if (label != undefined) {
                                var label = label.split('/'),
                                    lLen = label.length,
                                    code = '<ul class="sub-menu m-sub">';
                                for (var i = 0; i < lLen; i++) {
                                    var tag = label[i],
                                        n = postPerPage;
                                    if (tag) {
                                        code += '<li><a href="/search/label/' + tag + '?&max-results=' + n + '">' + tag + '</a></li>';
                                    }
                                }
                                code += '</ul>';
                                $this.parent('li').append(code);
                                break;
                            }
                    }

                }
            });
        }
    });
$('.mobile-menu ul li .submenu-toggle').on('click', function($this) {
		if($(this).parent().hasClass('has-sub')) {
			$this.preventDefault();
			if(!$(this).parent().hasClass('show')) {
				$(this).parent().addClass('show').children('.m-sub').slideToggle(170);
			} else {
				$(this).parent().removeClass('show').find('> .m-sub').slideToggle(170);
			}
		}
	});
 function msgError() {
        return '<span class="no-posts">Error <b>[check the shortcode]</b></span>';
    }
    $('#main-menu li,#car-menu li').each(function() {
        var lc = $(this),
            ltx = lc.find('a'),
            am = ltx.attr('href'),
            st = am.toLowerCase(),
            $this = lc,
            li = $this,
            text = st;
        if (st.match('getmega')) {
            $this.append('<div class="getMega">' + am + '</div>');
        }
        $this.find('.getMega').shortcode({
            getMega: function() {
                var num = this.options.results,
                    label = this.options.label,
                    type = this.options.type;
                ajaxMega($this, type, num, label, text);
                if (type == 'mtabs') {
                    if (label != undefined) {
                        label = label.split('/');
                    }
                    megaTabs(li, type, label);
                }
            }
        });
    });
    function megaTabs(li, type, label) {
        if (type == 'mtabs') {
            if (label != undefined) {
                var lLen = label.length,
                    code = '<ul class="complex-tabs">';
                for (var i = 0; i < lLen; i++) {
                    var tag = label[i];
                    if (tag) {
                        code += '<div class="mega-tab" tab-ify="' + tag + '"/>';
                    }

                }
                code += '</ul>';
                li.addClass('has-sub mega-menu mega-tabs').append(code);
                li.find('a:first').attr('href', '#');
                $('.mega-tab').each(function() {
                    var $this = $(this),
                        label = $this.attr('tab-ify');
                    ajaxMega($this, 'megatabs', 4, label, 'getmega');
                });
                li.find('ul.complex-tabs').tabify();
            } else {
                li.addClass('has-sub mega-menu mega-tabs').append('<ul class="mega-widget">' + msgError() + '</ul>');
            }
        }
    }
    function getFeedUrl(type, num, label) {
        var furl = '';
        switch (label) {
            case 'recent':
                furl = '/feeds/posts/default?alt=json-in-script&max-results=' + num;
                break;
            case 'random':
                var index = Math.floor((Math.random() * num) + 1);
                furl = '/feeds/posts/default?max-results=' + num + '&start-index=' + index + '&alt=json-in-script';
                break;
            default:
                furl = '/feeds/posts/default/-/' + label + '?alt=json-in-script&max-results=' + num;
                break;
        }
        return furl;
    }

    function getPostLink(feed, i) {
        for (var x = 0; x < feed[i].link.length; x++)
            if (feed[i].link[x].rel == 'alternate') {
                var link = feed[i].link[x].href;
                break
            }
        return link;
    }

   function post_title(feed, i, link) {
		var n = feed[i].title.$t,
			code = '<a href="' + link + '">' + n + '</a>';
		return code;
	}

	function post_image(feed, i) {
		var n = feed[i].title.$t,
			p = feed[i].content.$t,
			u = $('<div>').html(p);
		if('media$thumbnail' in feed[i]) {
			var src = feed[i].media$thumbnail.url,
				s1 = src.replace('/s72-c', '/w680');
			          if (src.match('img.youtube.com')) {
				s1 = src.replace('/default.', '/hqdefault.');
			}
		} else if(p.indexOf('<img') > -1) {
			s1 = u.find('img:first').attr('src');
		} else {
			s1 = noThumbnail;
		}
		var code = '<img class="post-thumb" alt="' + n + '" src="' + s1 + '"/>';
		return code;
	}

	function post_info(feed, i) {
		var p = feed[i].content.$t,
			u = $("<div>").html(p),
			g = u.find('strike:contains("price/")'),
			h = u.find('strike:contains("off/")');
		if(g.length > 0) {
			var $text = g.text(),
				$sp = $text.split('/'),
				$price = $sp[1];
		}
		if(h.length > 0) {
			var $text = h.text(),
				$sp = $text.split('/'),
				$off = $sp[1];
		}
		if($price != undefined) {
			var code_price = '<span class="meta-price">' + $price + '</span>';
		} else {
			code_price = '';
		}
		if($off != undefined) {
			var code_off = '<span class="product_off show">' + $off + '</span>';
		} else {
			code_off = '';
		}
		var code = [code_price, code_off];
		return code;
	}


  

    function getAjax($this, type, num, label) {
        switch (type) {
            case 'megatabs':
            case 'slidetabs':
                if (label == undefined) {
                    label = 'geterror';
                }
                var furl = getFeedUrl(type, num, label);
                $.ajax({
                    url: furl,
                    type: 'GET',
                    cache: true,
                    dataType: 'jsonp',
                    success: function(data) {
                        var html = '';
                        switch (type) {
                            case 'megatabs':
                                html = '<ul class="mega-widget">';
                                break;
                        }
                        var entry = data.feed.entry;
                        if (entry != undefined) {
                            for (var i = 0, feed = entry; i < feed.length; i++) {
                                var link = getPostLink(feed, i),
                                    title = post_title(feed, i, link),
                                    image = post_image(feed, i),
								    info = post_info(feed, i);
                                var content = '';
                                switch (type) {
                                    case 'megatabs':
                                        content += '<div class="mega-item"><div class="mega-content"><div class="post-image-wrap"><a class="post-image-link" href="' + link + '">' + image + '</a>' + info[1] + '</div><h2 class="post-title">' + title + '</h2><div class="post-meta">' + info[0] + '</div><a class="mega-buy-now" href="' + link + '">Buy Now</a></div></div>';
                                        break;
                                }
                                html += content;
                            }
                        } else {
                            switch (type) {
                                case 'megatabs':
                                    html = '<ul class="mega-widget">' + msgError() + '</ul>';
                                    break;
                                default:
                                    html = msgError();
                                    break;
                            }
                        }
                        switch (type) {
                            default:
                                html += '</ul>';
                                $this.html(html);
                                break;
                        }
                    }
                });
        }
    }

    function ajaxMega($this, type, num, label, text) {
        if (text.match('getmega')) {
            if ( type == 'megatabs') {
                return getAjax($this, type, num, label);
            } else {
                $this.addClass('has-sub mega-menu');
            }
        }
    }
function ajaxCar($this, type, num, label, text) {
        if (text.match('carmega')) {
            if ( type == 'slidetabs') {
                return getAjax($this, type, num, label);
            } else {
                $this.addClass('has-sub mega-menu');
            }
        }
    }
	$('.post-shop-info').each(function() {
		var $this = $(this),
			$id = $this.data('id');
		$.ajax({
			url: '/feeds/posts/default/' + $id + '?alt=json',
			type: 'get',
			dataType: 'jsonp',
			success: function(a) {
				var $e = a.entry.content.$t,
					$c = $("<div>").html($e),
					$s_price = $c.find('strike:contains("price/")'),
					$s_off = $c.find('strike:contains("off/")');
				if($s_price.length > 0) {
					var $text = $s_price.text(),
						$sp = $text.split('/'),
						$price = $sp[1];
					$this.find('.meta-price').text($price).parent().addClass('show');
				}
				if($s_off.length > 0) {
					var $text = $s_off.text(),
						$sp = $text.split('/'),
						$off = $sp[1];
					$this.find('.product_off').text($off).addClass('show');
				}
			}
		});
	});
	$('.product-post .post-body').each(function() {
		var $this = $(this),
			$s_price = $this.find('strike:contains("price/")'),
 			$s_off = $this.find('strike:contains("off/")'),
            $s_size = $this.find('strike:contains("size/")');
		if($s_price.length > 0) {
			var $text = $s_price.text(),
				$sp = $text.split('/'),
				$price = $sp[1];
			$('.product-header').find('.meta-price').text($price).parent().addClass('show');
			$s_price.hide();
		}
		if($s_off.length > 0) {
			var $text = $s_off.text(),
				$sp = $text.split('/'),
				$off = $sp[1];
			$('.product-header').find('.product_off').text($off).addClass('show');
			$s_off.hide();
		}
       if($s_size.length > 0) {
      
			var $text = $s_size.text(),
				  $sp = $text.split('/'),
				  $size = $sp[1];
      for ( var i in $sp ) {
        if ( $sp[i] == 'size' ) { continue; }
        $('.product-header').find('.item_size').append('<option value=' + $sp[i] + '>' + $sp[i] + '</option>').addClass('show');
      }
			$s_size.hide();
		}
	});
	$('.item_add').click(function() {
		var $this = $(this);
		$this.toggleClass('productad');
	});
	$('.product-post .post-body').each(function() {
		$(this).find('img:first').remove();
		$(this).find('img').show();
	});
	$('.Label a, a.b-label').attr('href', function($this, href) {
		return href.replace(href, href + '?&max-results=' + postPerPage);
	});
	$('.avatar-image-container img').attr('src', function($this, i) {
		i = i.replace('/s35-c/', '/s45-c/');
		i = i.replace('//img1.blogblog.com/img/blank.gif', '//4.bp.blogspot.com/-uCjYgVFIh70/VuOLn-mL7PI/AAAAAAAADUs/Kcu9wJbv790hIo83rI_s7lLW3zkLY01EA/s55-r/avatar.png');
		return i;
	});
	$('.author-description a').each(function() {
		$(this).attr('target', '_blank');
	});
	$('.post-nav').each(function() {
		var getURL_prev = $('a.prev-post-link').attr('href'),
			getURL_next = $('a.next-post-link').attr('href');
		$.ajax({
			url: getURL_prev,
			type: 'get',
			success: function(prev) {
				var title = $(prev).find('.blog-post h1.post-title').text();
				$('.post-prev a .post-nav-inner p').text(title);
			}
		});
		$.ajax({
			url: getURL_next,
			type: 'get',
			success: function(next) {
				var title = $(next).find('.blog-post h1.post-title').text();
				$('.post-next a .post-nav-inner p').text(title);
			}
		});
	});
	$('.post-body strike').each(function() {
		var $this = $(this),
			type = $this.text();
		if(type.match('left-sidebar')) {
			$this.replaceWith('<style>.item #main-wrapper{float:right}.item #sidebar-wrapper{float:left}</style>');
		}
		if(type.match('right-sidebar')) {
			$this.replaceWith('<style>.item #main-wrapper{float:left}.item #sidebar-wrapper{float:right}</style>');
		}
		if(type.match('full-width')) {
			$this.replaceWith('<style>.item #main-wrapper{width:100%}.item #sidebar-wrapper{display:none}</style>');
		}
	});
	$('#main-wrapper, #sidebar-wrapper').each(function() {
		if(fixedSidebar == true) {
			$(this).theiaStickySidebar({
				additionalMarginTop: 30,
				additionalMarginBottom: 30
			});
		}
	});
	$('.back-top').each(function() {
		var $this = $(this);
		$(window).on('scroll', function() {
			$(this).scrollTop() >= 100 ? $this.fadeIn(250) : $this.fadeOut(250)
		}), $this.click(function() {
			$('html, body').animate({
				scrollTop: 0
			}, 500)
		});
	});
	$('#main-menu #main-menu-nav li').each(function() {
		var li = $(this),
			text = li.find('a').attr('href').trim(),
			$this = li,
			type = text.toLowerCase(),
			map = text.split('/'),
			label = map[0];
		ajaxPosts($this, type, 5, label);
	});
    $('#slider-section .widget-content').each(function() {
        var $this = $(this),
            text = $this.text().trim(),
            type = text.toLowerCase(),
            map = text.split('/'),
            num = map[0],
            label = map[1];
        ajaxPosts($this, type, num, label);
    });
	$('#hot-section .widget-content').each(function() {
		var $this = $(this),
			text = $this.text().trim(),
			type = text.toLowerCase(),
			map = text.split('/'),
			label = map[0];
		ajaxPosts($this, type, 4, label);
	});
	$('.common-widget .widget-content').each(function() {
		var $this = $(this),
			text = $this.text().trim(),
			type = text.toLowerCase(),
			map = text.split('/'),
			num = map[0],
			label = map[1];
		ajaxPosts($this, type, num, label);
	});
	$('.related-ready').each(function() {
		var $this = $(this),
			label = $this.find('.related-tag').data('label');
		ajaxPosts($this, 'related', 3, label);
	});

	function post_link(feed, i) {
		for(var x = 0; x < feed[i].link.length; x++)
			if(feed[i].link[x].rel == 'alternate') {
				var link = feed[i].link[x].href;
				break
			}
		return link;
	}

	
	function ajaxPosts($this, type, num, label) {
		if(type.match('mega-menu') || type.match('slider') || type.match('hot-posts') || type.match('post-list') || type.match('related')) {
			var url = '';
			if(label == 'recent') {
				url = '/feeds/posts/default?alt=json-in-script&max-results=' + num;
			} else if(label == 'random') {
				var index = Math.floor(Math.random() * num) + 1;
				url = '/feeds/posts/default?max-results=' + num + '&start-index=' + index + '&alt=json-in-script';
			} else {
				url = '/feeds/posts/default/-/' + label + '?alt=json-in-script&max-results=' + num;
			}
			$.ajax({
				url: url,
				type: 'get',
				dataType: 'jsonp',
				beforeSend: function() {
				     if (type.match('slider')) {
                        $this.html('<div class="loader"></div>').parent().addClass('show-slider');
                    } else if(type.match('hot-posts')) {
						$this.html('<div class="hot-loader"/>').parent().addClass('show-hot');
					}
				},
				success: function(json) {
					if(type.match('mega-menu')) {
						var kode = '<ul class="mega-menu-inner">';
					} else if (type.match('slider')) {
                        var kode = '<ul class="main-slider">';
                    } else if(type.match('hot-posts')) {
						var kode = '<ul class="hot-posts">';
					} else if(type.match('post-list')) {
						var kode = '<ul class="custom-widget">';
					} else if(type.match('related')) {
						var kode = '<ul class="related-posts">';
					}
					var entry = json.feed.entry;
					if(entry != undefined) {
						for(var i = 0, feed = entry; i < feed.length; i++) {
							var link = post_link(feed, i),
								title = post_title(feed, i, link),
								image = post_image(feed, i),
								info = post_info(feed, i);
							var kontent = '';
							if(type.match('mega-menu')) {
								kontent += '<div class="mega-item item-' + i + '"><div class="mega-content"><div class="post-image-wrap"><a class="post-image-link" href="' + link + '">' + image + '</a>' + info[1] + '</div><h2 class="post-title">' + title + '</h2>' + info[0] + '</div></div>';
							}  else if (type.match('slider')) {
                                kontent += '<li class="slider-item item-' + (i + 1) + '"><div class="slider-item-inner"><a class="post-image-link" href="' + link + '">' + image + '</a>' + info[1] + '<div class="post-info-wrap"><div class="post-info"><h2 class="post-title">' + title + '</h2><div class="post-meta">' + info[0] + '</div></div></div></div></li>';
                            } else if(type.match('hot-posts')) {
								kontent += '<li class="hot-item item-' + i + '"><div class="hot-item-inner"><a class="post-image-link" href="' + link + '">' + image + '</a>' + info[1] + '<div class="product-info"><h2 class="post-title">' + title + '</h2>' + info[0] + '</div></div></li>';
							} else if(type.match('post-list')) {
								kontent += '<li class="item-' + i + '"><div class="post-image-wrap"><a class="post-image-link" href="' + link + '">' + image + '</a>' + info[1] + '</div><div class="product-info"><h2 class="post-title">' + title + '</h2>' + info[0] + '</div><a class="mega-buy-now" href="' + link + '">Buy Now</a></div></li>';
							} else if(type.match('related')) {
								kontent += '<li class="related-item item-' + i + '"><div class="post-image-wrap"><a class="post-image-link" href="' + link + '">' + image + '</a>' + info[1] + '</div><h2 class="post-title">' + title + '</h2>' + info[0] + '</li>';
							}
							kode += kontent;
						}
						kode += '</ul>';
					} else {
						kode = '<ul class="no-posts">Error: No Posts Found <i class="fa fa-frown"/></ul>';
					}
					if(type.match("mega-menu")) {
						$this.addClass('has-sub mega-menu').append(kode);
						$this.find('a:first').attr('href', function($this, href) {
							if(label == 'recent' || label == 'random') {
								href = href.replace(href, '/search/?&max-results=' + postPerPage);
							} else {
								href = href.replace(href, '/search/label/' + label + '?&max-results=' + postPerPage);
							}
							return href;
						});
					} else if (type.match('slider')) {
                        $this.html(kode).parent().addClass('show-slider');
                        var $mainslider = $this.find('.main-slider');
                        $mainslider.owlCarousel({
                                    items: 1,
                                    animateIn: 'fadeInRight',
                                    animateOut: 'fadeOutRight',
                                    smartSpeed: 0,
                                    rtl: false,
                                    nav: true,
                                    navText: ['', ''],
                                    loop: true,
                                    autoplay: true,
                                    autoplayHoverPause: true,
                                    dots: false,
                                    mouseDrag: false,
                                    touchDrag: false,
                                    freeDrag: false,
                                    pullDrag: false
                                });
                    } else if(type.match('hot-posts')) {
						$this.html(kode).parent().addClass('show-hot');
					} else if (type.match('post-list')) {
                        $this.parent().find('.widget-title').append('<a class="view-all" href="/search/label/' + label + '?&max-results=' + postPerPage + '">' + messages.viewAll + '</a>');
                        $this.html(kode).parent().addClass('show-widget');
                    } else {
						$this.html(kode);
					}
				}
			});
		}
	}
	$('.blog-post-comments').each(function() {
		var system = commentsSystem,
			disqus_url = disqus_blogger_current_url,
			disqus = '<div id="disqus_thread"/>',
			current_url = $(location).attr('href'),
			facebook = '<div class="fb-comments" data-width="100%" data-href="' + current_url + '" data-numposts="5"></div>',
			sClass = 'comments-system-' + system;
		if(system == 'blogger') {
			$(this).addClass(sClass).show();
		} else if(system == 'disqus') {
			(function() {
				var dsq = document.createElement('script');
				dsq.type = 'text/javascript';
				dsq.async = true;
				dsq.src = '//' + disqusShortname + '.disqus.com/embed.js';
				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
			})();
			$('#comments, #gpluscomments').remove();
			$(this).append(disqus).addClass(sClass).show();
		} else if(system == 'facebook') {
			$('#comments, #gpluscomments').remove();
			$(this).append(facebook).addClass(sClass).show();
		} else if(system == 'hide') {
			$(this).hide();
		} else {
			$(this).addClass('comments-system-default').show();
		}
	});
   var minNumber = 1E9,
	maxNumber = 1E11,
	randomNumber = randomNumberFromRange(minNumber, maxNumber);

function randomNumberFromRange(a, b) {
	return Math.floor(Math.random() * (b - a + 1) + a)
};
   $(".soracustomform form")["change"]("input", function() {
        var a = $(".soracustomform form");
        var b = a["find"]("input.contact-form-name")["val"]()["trim"]();
        var c = a["find"]("input.contact-form-email")["val"]()["trim"]();
        var d = a["find"]("input.soracustomform-phone")["val"]()["trim"]();
        var e = a["find"]("input.soracustomform-postal")["val"]()["trim"]();
        var n = a["find"]("input.soracustomform-address")["val"]()["trim"]();
        var o = a["find"]("input.soracustomform-city")["val"]()["trim"]();
        var q = a["find"]("input.soracustomform-state")["val"]()["trim"]();
        var r = a["find"]("input.soracustomform-country")["val"]()["trim"]();
        var f = a["find"]("textarea.soracustomform-message")["val"]()["trim"]();
        var g = $(".itemRow");
        var h = g["find"](".item-name")["text"]()["trim"]();
        var i = g["find"](".item-quantity")["text"]()["trim"]();
        var j = g["find"](".item-price")["text"]()["trim"]();
        var k = g["find"](".item-size")["text"]()["trim"]();
        var s = $(".sora-cart-shipping")["find"](".simpleCart_shipping")["text"]()["trim"]();
        var t = $(".sora-cart-grand")["find"](".simpleCart_grandTotal")["text"]()["trim"]();
        var u = j + " + Shipping Fee( " + s + " ) = " + t + " Total";
        var m = "Product Name: " + h + "\n\nProduct Quantity: " + i + "\n\nProduct Size: " + k + "\n\nProduct Price: " + u + "\n";
        a["find"](".contact-form-email-message")["val"]("Order No: " + randomNumber + "\n\nPhone Number: " + d + "\n\nAddress: " + n + ", " + o + ", " + e + ", " + q + ", " + r + "\n\nNotes: " + f + "\n\n" + m);
        $(".soracustomform-ok")["click"](function() {
            if ("" != b) a["find"]("input.contact-form-name")["removeClass"]("error");
            else a["find"]("input.contact-form-name")["addClass"]("error");
            if ("" != c) a["find"]("input.contact-form-email")["removeClass"]("error");
            else a["find"]("input.contact-form-email")["addClass"]("error");
            if ("" != d) a["find"]("input.soracustomform-phone")["removeClass"]("error");
            else a["find"]("input.soracustomform-phone")["addClass"]("error");
            if ("" != e) a["find"]("input.soracustomform-postal")["removeClass"]("error");
            else a["find"]("input.soracustomform-postal")["addClass"]("error");
            if ("" != f) a["find"]("textarea.soracustomform-message")["removeClass"]("error");
            else a["find"]("textarea.soracustomform-message")["addClass"]("error");
            if ("" != n) a["find"]("input.soracustomform-address")["removeClass"]("error");
            else a["find"]("input.soracustomform-address")["addClass"]("error");
            if ("" != o) a["find"]("input.soracustomform-city")["removeClass"]("error");
            else a["find"]("input.soracustomform-city")["addClass"]("error");
            if ("" != q) a["find"]("input.soracustomform-state")["removeClass"]("error");
            else a["find"]("input.soracustomform-state")["addClass"]("error");
            if ("" != r) a["find"]("input.soracustomform-country")["removeClass"]("error");
            else a["find"]("input.soracustomform-country")["addClass"]("error");
            if ("" != (b && c && d && e && f && n && o && q && r)) a["find"](".contact-form-button-submit")["removeAttr"]("disabled")["removeClass"]("disabled");
            else a["find"](".contact-form-button-submit")["attr"]("disabled", "true")["addClass"]("disabled");
        });
        var p = $(".sora-checkout-wrap .simpleCart_grandTotal").text();
        $(".soraorderidsuccess").html(randomNumber);
        $(".soratotalsuccess").html(p);
        $(".soraorderdetails-name").html(h);
        $(".soraorderdetails-quantity").html(i);
        $(".soraorderdetails-size").html(k);
        $(".soraorderdetails-price").html(u);
        $(".cfullname").html(b);
        $(".soranamesuccess").html(b);
        $(".cemail").html(c);
        $(".cphone").html(d);
        $(".caddress").html(n);
	    $(".ccity").html(o);
        $(".cpostal").html(e);
        $(".cstate").html(q);
        $(".ccountry").html(r);
         if ($('#sora-cod').is(':checked')) {
                        if ('while' == 'while') {
                            $('.soramethodsuccess').html('<span>Cash on Delivery <img src="https://1.bp.blogspot.com/-IdAOZRualRM/XvDReVFAXBI/AAAAAAAAIx0/UYQMxsnCnnQmkXjRDTq2ASnX8gsJ45AbQCNcBGAsYHQ/s1600/cod.png"></span>')
                        }
                    }
                  if ($('#sora-upi').is(':checked')) {
                        if ('package' == 'package') {
                            $('.soramethodsuccess').html('<span> UPI Transfer <img src="https://4.bp.blogspot.com/-YC7RM3Ovek0/XvDwIYhwgSI/AAAAAAAAIzk/kJ67QyK-t4IkSE0lrA1yxk-bO8OJBHhowCK4BGAYYCw/s400/UPI.png"></span>')
                        }
                        $('.sora-upi-details').show()
                    }
                    if ($('#sora-bank').is(':checked')) {
                        if ('package' == 'package') {
                            $('.soramethodsuccess').html('<span>Bank Transfer <img src="//3.bp.blogspot.com/-uyVMdNWi2LQ/XvDwK6N90yI/AAAAAAAAIzs/z9QxTyWYMQgmJcdzmjKvdZemMyusxQvkgCK4BGAYYCw/s400/banktransfer.png"></span>')
                        }
                        $('.sora-bank-details').show()
                    }
        $(".contact-form-name,.contact-form-email,.soracustomform-phone,.soracustomform-postal,.soracustomform-message,.soracustomform-state,.soracustomform-country,.soracustomform-address,.soracustomform-city")["click"](function() {
            a["find"](".contact-form-button-submit")["attr"]("disabled", "true")["addClass"]("disabled");
        });
        $(".contact-form-name,.contact-form-email,.soracustomform-phone,.soracustomform-postal,.soracustomform-message,.soracustomform-state,.soracustomform-country,.soracustomform-address,.soracustomform-city")["keydown"](function() {
            a["find"](".contact-form-button-submit")["attr"]("disabled", "true")["addClass"]("disabled");
        });
    });
    $('input[id="sora-paypal"]').click(function(){
       $(".contact-form-button-submit").parent().addClass("simpleCart_checkout");
    });
     $('input[id="sora-cod"],input[id="sora-upi"],input[id="sora-bank"]').click(function(e){
              e.stopPropagation();
       $(".contact-form-button-submit").parent().removeClass("simpleCart_checkout");
       $('.contact-form-button-submit').click( function() {
         setTimeout(function(){$(".soracustomform").fadeOut()},1000);
         setTimeout(function(){$(".sorasuccessbox").fadeIn()},1100);
       });
    });
});

