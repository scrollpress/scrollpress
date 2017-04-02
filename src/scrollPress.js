/*
 * plugin name: scrollpress
 * Author: el-oz
 * Github: https://github.com/scrollpress/scrollpress
 * Description: Make smooth animation on scrollTop
 * License: MIT
*/

;(function ( $, window, document, undefined ) {
    'use strict';
    
    var $window = $(window),
        
        $docRoot = $('body'),
        
        dh = document.body.scrollHeight - $window.innerHeight(),
        
        /**
         * Codes for keyboard scrolling keys
        */
        keyCodes = {
            up: 38,
            down: 40,
            pageup: 33,
            pagedown: 34,
            home: 36,
            end: 35,
            space: 32
        },
        
        /**
         * Length in pixel for keyboard scolling keys
         * @type {Opject}
        */
        scroll_Len = {
            arrow_scroll: 60,
            pg_scroll: $window.innerHeight(),
            home_scroll: 0
        },
        
        /**
         * change target on window load to current scrollTop
         * incase of reloading page while scrollTop greater than 0
         * @type {Number}
        */
        target = $window.scrollTop(),
        
        settings,
        scrollBtn,
        clickBubbleContainer,
        clickBubble,
        spreadBorder,
        
        scrollBtnStyle;
    
    // IE 11 fix
    if (/trident+.*\.net/i.test(window.navigator.appVersion)) {
        $docRoot = $('html');
        target = document.documentElement.scrollTop;
        
        // in case of reloading page
        setTimeout(function () {
            target = window.pageYOffset;
        }, 100);
    }
    
    /**
     * scrollpress plugin
     * @type {Function}
    */
    $.fn.scrollPress = function (options) {
        
        /**
         * scrollpress default settings
         * @type {Opject}
        */
        var defaults = {
            
            /**
             * trigger scroll functions 
             * when press on any key that makes change on scrollTop (pg up/space/...)
             * @type {Boolean}
            */
            scrollPress: true,
            
            // Global animation duration
            duration: 1000,
            
            // Global animation timing function
            easing: 'easeInOutCubic',
            
            /**
             * scroll to top button
             * @type {Object}
            */
            btn: {
                state: true,
                
                outerHTML: "<div class='scroll-btn'><div class='sb-layer' style='z-index:998;'></div></div><!--/.scroll-btn-->",
                
                /**
                 * Button icon
                 * @type {String}
                */
                icon: "<i class='fa fa-angle-up'></i>",
                
                /**
                 * new container for scroll to top button
                 * should be relative position
                 * @type {JQuery selector}
                */
                container: null,

                // threshold to show button when scrollTop passes it
                threshold: $window.innerHeight() / 3,
                
                inlineStyle: true,
                
                style: {
                    zIndex: '999',

                    // 100% if continer enabled
                    width: '40px',
                    height: '40px',
                    
                    // absolute if container enabled
                    position: 'fixed',
                    
                    // auto if container true
                    right: '20px',
                    bottom: '20px',
                    left: 'auto',
                    top: 'auto',
                    
                    backgroundColor: 'white',
                    borderRadius: '14%',
                    transition: 'all 1s ease',
                    animationDelay: ''
                },
                
                // trigger when scroll top pass threshold
                fadeAnimation: {
                    slide: true,
                    scale: true,
                    bounce: false,
                    rotate: false,
                },
                
                // class added when scrollTop greater than btn.threshold
                fadeInClass: '',
                
                /**
                 * animation added on mousedown event
                 * @type {Object}
                */
                clickAnimation: {
                    
                    bounce: false,
                    
                    bubble: {
                        state: true,
                        outerHTML: '<div class="click-bubble-container"><div class="click-bubble"></div></div><!--/.click-bubble-->',
                        
                        inlineStyle: true,
                        zIndex: '999',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#96d0ff',
                        borderRadius: null
                    },
                    
                    spreadBorder: {
                        state: true,
                        outerHTML: '<div class="spread-border"></div>\<!--/.spread-border-->',
                        
                        inlineStyle: true,
                        zIndex: '997',
                        width: '100%',
                        height: '100%',
                        borderWidth: '4px',
                        borderStyle: 'solid',
                        borderColor: '#e1e1e1',
                        borderRadius: null
                    }
                },      
                
                /**
                 * to tigger css animation on hover
                 * @type {String}
                */
                clickClass: '',
            },
            
            /*
             * scroll to target offset when click on selector
            */
            scrollOnClick: {
                
                /**
                 * @type {JQuery selector} 
                */ 
                clickOn: null,
                
                /**
                 * unique selector(preferred id)
                 * @type {JQuery selector} 
                */
                scrollTo: null,
                
                duration: 1400,
                
                easing: null,
                
                autoDetect: true
            },
            
            scrollOnClick_multi: {
                0: {
                    clickOn: null,
                    scrollTo: null,
                    duration: null,
                    easing: null
                },
                1: {
                    clickOn: null,
                    scrollTo: null,
                    duration: null,
                    easing: null
                }
            },      
            
            /**
             * @type {Boolean}
            */
            btn_state: null,
            
            /**
             * btn arrow icon
            */
            btn_icon: null,
            
            /**
             * @type {Jquery selector}
            */
            btn_container: null,
            
            /**
             * @type {Number}
            */
            btn_threshold: null,
            
            /**
             * disable incase of styling with external stylesheet
            */
            btn_inlineStyle: null,
            
            /**
             * @type {Object}
            */
            btn_style: {},
            
            /**
             * @type {Object}
            */
            btn_fadeAnimation: {},
            
            /**
             * @type {String}
            */
            btn_fadeInClass: null,
            
            /**
             * @type {Boolean}
            */
            btn_clickAnimation_bounce: null,
            
            /**
             * @type {Object}
            */
            btn_clickAnimation_bubble: {},
            
            /**
             * @type {Object}
            */
            btn_clickAnimation_spreadBorder: {},
            
            /**
             * @type {String}
            */
            btn_clickClass: null,
        };
        
        /**
         * extend options
        */
        settings = $.extend(true, defaults, options);
        
        
        (defaults.btn_state != null) ? defaults.btn.state = defaults.btn_state : $.noop();
        
        (defaults.btn_icon != null) ? defaults.btn.icon = defaults.btn_icon : $.noop();
        
        (defaults.btn_container != null) ? defaults.btn.container = defaults.btn_container : $.noop();
        
        (defaults.btn_threshold != null) ? defaults.btn.threshold = defaults.btn_threshold : $.noop();
        
        (defaults.btn_inlineStyle != null) ? defaults.btn.inlineStyle = defaults.btn_inlineStyle : $.noop();
        
        for (var key in defaults.btn_style) {
            if (defaults.btn_style[key]) {
                defaults.btn.style[key] = defaults.btn_style[key];
            }
        }
        
        for (var key in defaults.btn.fadeAnimation) {
            if (defaults.btn_fadeAnimation[key]) {
                defaults.btn.fadeAnimation[key] = defaults.btn_fadeAnimation[key];
            }
        }

        (defaults.btn_fadeInClass != null) ? defaults.btn.fadeInClass = defaults.btn_fadeInClass : $.noop();
        
        (defaults.btn_clickAnimation_bounce != null) ? defaults.btn.clickAnimation.bounce = defaults.btn_clickAnimation_bounce : $.noop();

        for (var st in defaults.btn.clickAnimation.bubble) {
            if (defaults.btn_clickAnimation_bubble[st]) {
                defaults.btn.clickAnimation.bubble[st] = defaults.btn_clickAnimation_bubble[st];
            }
        }
        for (var st in defaults.btn.clickAnimation.spreadBorder) {
            if (defaults.btn_clickAnimation_spreadBorder[st]) {
                defaults.btn.clickAnimation.spreadBorder[st] = defaults.btn_clickAnimation_spreadBorder[st];
            }
        }

        (defaults.btn_clickClass != null) ? defaults.btn.clickClass = defaults.btn.btn_clickClass : $.noop();
        
        if ( defaults.btn.state ) {
            
            /*  HTML
            -------------------------------------------
               * append animations outer html if enabled
               * add custom class to btn HTML
               * append Button HTMLs to body
            -------------------------------------------
            */
            
            if (defaults.btn.icon) {
                defaults.btn.outerHTML = 
                    defaults.btn.outerHTML.replace(/(<\/div><\!--\/\.scroll-btn-->)/, function (e) {
                        return defaults.btn.icon + e;
                    });
            }
            
            // bubble animation html
            if ( defaults.btn.clickAnimation.bubble.state ) {
                defaults.btn.outerHTML = defaults.btn.outerHTML.replace(/(<\/div><\!--\/\.scroll-btn-->)/, function (e) {
                    return defaults.btn.clickAnimation.bubble.outerHTML + e;
                });
            }
            
            // spread border html
            if ( defaults.btn.clickAnimation.spreadBorder.state ) {
                defaults.btn.outerHTML = defaults.btn.outerHTML.replace(/(<\/div><\!--\/\.scroll-btn-->)/, function (e) {
                    return defaults.btn.clickAnimation.spreadBorder.outerHTML + e;
                });
            }
            
            // append btn to body 
            $docRoot.append(defaults.btn.outerHTML);
            
            var scrollBtn = $('.scroll-btn'),
                sbLayer = scrollBtn.find('.sb-layer');
            
            // append scrollBtn to container
            if(defaults.btn.container) {
                scrollBtn.appendTo(defaults.btn.container);  
            }
            
            /*  Css
            ------------------------------------
                * Button default style
                * Button click animation
            ------------------------------------
            */
            
            if (defaults.btn.inlineStyle) {
                var btnCss = '',
                    fp;
                
                // set button fadeIn animation-delay
                if (defaults.btn.style.transition) {
                    
                    var transDur = defaults.btn.style.transition.split(' ')[1], 
                        tdua = transDur.split('.');
                    
                    // if splited.length === 1 // no dot in duration (string)
                    if (tdua.length === 1) {
                        defaults.btn.style.animationDelay = 
                            tdua[0].replace(/\d/g, function (e) {
                                return parseInt(e) * .5;
                            });
                        
                    //if first element not null or 0
                    } else if (tdua[0]) {
                        defaults.btn.style.animationDelay = (tdua[0] * .5) + 's';
                    
                    //if floated number
                    } else if (tdua[1]) {
                        defaults.btn.style.animationDelay = 
                            tdua[1].replace(/\d/g, function (e) {
                                return (parseInt(e) >= 2) ? (parseInt(e) * .5)/10 : .1;
                            });
                    }
                }
                
                if (defaults.btn.container) {
                    
                    /**
                     * change fixed position to absolute
                     * change button position to top/left of the container
                     * change button width/height to 100%
                    */

                    for (let p in defaults.btn.style) {
                        
                        if (defaults.btn.style[p]) {
                            fp = p;
                            if (/[A-Z]/g.test(p)) {
                                fp = p.replace(/[A-Z]/g, function (e) {
                                    return '-' + e.toLowerCase();
                                });
                            }
                          
                            if (/^(position)/i.test(p)) {
                                btnCss += fp + ': ' + 'absolute' + ';';
                            } else if (/^(top|left)/i.test(p)) {
                                btnCss += fp + ': 0px;';
                            } else if (/^(right|bottom)/i.test(p)) {
                                btnCss += fp + ': auto;';
                            } else if (/^(width|height)/i.test(p)) {
                                btnCss += fp + ': 100%;';
                            } else {
                                btnCss += fp + ': ' + defaults.btn.style[p] + ';';
                            }
                        }
                    }
                    
                    defaults.btn.container.css({
                        position: 'relative'
                    });
                    
                } else {
                    for (let sp in defaults.btn.style) {
                        if (defaults.btn.style[sp]) {
                            fp = sp;
                            if (/[A-Z]/g.test(sp)) {
                                fp = sp.replace(/[A-Z]/g, function (e) {
                                    return '-' + e.toLowerCase();
                                });
                            }
                            btnCss +=  fp + ': ' + defaults.btn.style[sp] + ';';
                        }
                    }
                }
                
                scrollBtnStyle = "<style type='text/css'> .scroll-btn {"+ btnCss +"} </style>";
                sbLayer.css({borderRadius: defaults.btn.style.borderRadius});
            }
            
            /**
             * Button click animation css
            */
            
            // click bubble
            
            if (defaults.btn.clickAnimation.bubble.state) {
                clickBubbleContainer = $('.click-bubble-container');
                clickBubble = $('.click-bubble');
                
                var clickBblCss = ".click-bubble-container {" + 
                                        'z-index:'+ defaults.btn.clickAnimation.bubble.zIndex +
                                        ';width:'+ defaults.btn.style.width +
                                        ';height:'+ defaults.btn.style.height +
                                        ';background-color: transparent'+
                                        ';border-radius:'+ defaults.btn.style.borderRadius + '; }'+
                                  ".click-bubble {" + 
                                        'width:'+ defaults.btn.clickAnimation.bubble.width +
                                        ';height:'+ defaults.btn.clickAnimation.bubble.height +
                                        ';background-color:'+ defaults.btn.clickAnimation.bubble.backgroundColor +
                                        ';border-radius:'+ (defaults.btn.clickAnimation.bubble.borderRadius === null ? defaults.btn.style.borderRadius : defaults.btn.clickAnimation.bubble.borderRadius) + ';}';
                scrollBtnStyle = 
                    scrollBtnStyle.replace(/<\/style>/, function (e) { 
                        return clickBblCss + e; 
                    });
            }

            // spreadBorder
            if (defaults.btn.clickAnimation.spreadBorder.state) {
                spreadBorder = $('.spread-border');
                var spreadBorderCss =   ".spread-border {" + 
                                            'z-index:'+ defaults.btn.clickAnimation.spreadBorder.zIndex +
                                            ';width:'+ defaults.btn.style.width +
                                            ';height:'+ defaults.btn.style.height +
                                            ';background-color: transparent'+
                                            ';border-radius:'+ (defaults.btn.clickAnimation.spreadBorder.borderRadius === null ?
                                                                    defaults.btn.style.borderRadius :
                                                                    defaults.btn.clickAnimation.spreadBorder.borderRadius) +
                                            ';border-width:'+ defaults.btn.clickAnimation.spreadBorder.borderWidth +
                                            ';border-color:'+ defaults.btn.clickAnimation.spreadBorder.borderColor +
                                            ';border-style:'+ defaults.btn.clickAnimation.spreadBorder.borderStyle +
                                        ';}';
                scrollBtnStyle = 
                    scrollBtnStyle.replace(/<\/style>/, function (e) { 
                        return spreadBorderCss + e; 
                    });
            }
            
            //append btn style
            setTimeout (function () {
                document.head.insertAdjacentHTML('beforeend', scrollBtnStyle);
            });
            /*
            -----------------------
                 Button classes
            -----------------------
            */
            
            // button fade-in/out animation class
            
            if (defaults.btn.fadeAnimation.bounce) {
                defaults.btn.fadeInClass += ' bounce';
            }

            if (defaults.btn.fadeAnimation.rotate) {
                defaults.btn.fadeInClass += ' rotate';
            }
            
            
            
            // button click animation class
            
            if (defaults.btn.clickAnimation.bounce) {
                defaults.btn.clickClass += ' bounce';
            }
                   
            if (defaults.btn.clickAnimation.bubble) {
                defaults.btn.clickClass += ' bubble';
            }
            
            // add class to start spread border animation
            if (defaults.btn.clickAnimation.spreadBorder.state) {
                defaults.btn.clickClass += ' spread';
            }
            
            /*
            --------------------------
                * plugin Functions
            --------------------------
            */
            
            /**
             * check if scrollTop passed btn.threshold to fade button
            */ 
            function is_passed() {
                var isPassed = ( $docRoot.scrollTop() > defaults.btn.threshold );
                if ( isPassed ) {
                    // add fadeIn animations
                    if (defaults.btn.fadeAnimation.slide) {
                        scrollBtn.css('bottom', defaults.btn.style.bottom );
                    }

                    if (defaults.btn.fadeAnimation.scale) {
                        scrollBtn.css('transform', 'scale(1)');
                    }
                    
                    // add passed class to scrollBtn
                    scrollBtn.addClass(defaults.btn.fadeInClass);
                } else {
                    // add fadeOut animation
                    if (defaults.btn.fadeAnimation.slide) {
                        scrollBtn.css('bottom', '-' + defaults.btn.style.height);
                    }
                    if (defaults.btn.fadeAnimation.scale) {
                        scrollBtn.css('transform', 'scale(0)');
                    }
                    
                    // remove passed class from scrollBtn
                    scrollBtn.removeClass(defaults.btn.fadeInClass);
                }
            }
            
            is_passed();

            // Scroll to top on button click
            scrollBtn.on('click', function (e) {
                $docRoot.stop().animate({
                    scrollTop: 0 + 'px'
                }, defaults.duration, defaults.easing, function () {target = 0;});
            });
                         
            scrollBtn.on('touchstart mousedown', function (e) {
                scrollBtn.removeClass(defaults.btn.clickClass);
                
                // make bubble position relative to mouse click position
                if (defaults.btn.clickAnimation.bubble.state) {
                    var s = scrollBtn,
                        // bubble position
                        bpx = (e.pageX || e.originalEvent.touches[0].pageX) - s.offset().left - (clickBubble.width() / 2),
                        bpy = (e.pageY || e.originalEvent.touches[0].pageY) - s.offset().top - (clickBubble.height() / 2);
                    
                    clickBubble.css({ left: bpx + 'px', top: bpy + 'px' });
                }
                scrollBtn.addClass(defaults.btn.clickClass);
            });
            
            /*
            ----------------------------------
                * scroll on click functions
            ----------------------------------
            */
            
            if (defaults.scrollOnClick.duration === null)
                defaults.scrollOnClick.duration = defaults.duration;
            
            if (defaults.scrollOnClick.easing === null)
                defaults.scrollOnClick.easing = defaults.easing;
            
            // scroll on click auto detect function
            if (defaults.scrollOnClick.autoDetect) {
                $.each($('a'), function (i,el) {
                    $(el).on('click', function (e) {
                        var targetHref = $(el).attr('href'),
                            scrollOnClick_targetOT;
                        
                        if ( /^#/.test(targetHref) ) {
                            e.preventDefault();
                            scrollOnClick_targetOT = $(targetHref).offset().top;
                            
                            // fix scrollTop incase of target scrollTop greater then viewport scrollTop
                            if (scrollOnClick_targetOT < document.body.scrollHeight - $window.innerHeight()) {
                                
                                $docRoot.stop().animate({
                                    scrollTop: scrollOnClick_targetOT + 'px'
                                }, defaults.scrollOnClick.duration, defaults.scrollOnClick.easing, function () {target = $docRoot.scrollTop();} );
                            
                            } else {
                                $docRoot.stop().animate({
                                    scrollTop: document.body.scrollHeight - $window.innerHeight() + 'px'
                                }, defaults.scrollOnClick.duration, defaults.scrollOnClick.easing, function () {target = document.body.scrollHeight - $window.innerHeight();} );
                            }
                        }
                    });
                });
            }
            
            //scroll on click single element
            if (defaults.scrollOnClick.clickOn && defaults.scrollOnClick.scrollTo) {
                defaults.scrollOnClick.clickOn.on('click', function () {
                    var scrollToOffset = defaults.scrollOnClick.scrollTo.offset().top;
                    target = scrollToOffset;
                    
                    $docRoot.stop().animate({
                        scrollTop: (scrollToOffset >= document.body.scrollHeight - $window.innerHeight()) ? 
                                    document.body.scrollHeight - $window.innerHeight() + 'px' :
                                    scrollToOffset + 'px'
                    }, defaults.scrollOnClick.duration, defaults.scrollOnClick.easing);
                });
            }
            
            // scrollOnClick multiple element
            for (let socm in defaults.scrollOnClick_multi) {
                if (defaults.scrollOnClick_multi[socm].clickOn && defaults.scrollOnClick_multi[socm].scrollTo) {
                    
                    // if duration not null don't make change else equalize it with default.duration
                    if (defaults.scrollOnClick_multi[socm].duration === null)
                        defaults.scrollOnClick_multi[socm].duration = defaults.duration;
                        
                    // if easing not null don't make change else equalize it with default.easing
                    if (defaults.scrollOnClick_multi[socm].easing === null)
                        defaults.scrollOnClick_multi[socm].easing = defaults.easing;
                        
                    
                    defaults.scrollOnClick_multi[socm].clickOn.on('click', function (e) {
                        var scrollTOT = defaults.scrollOnClick_multi[socm].scrollTo.offset().top;
                        target = scrollTOT;
                        
                        $docRoot.stop().animate({
                            scrollTop: (scrollTOT >= document.body.scrollHeight - $window.innerHeight()) ? 
                            document.body.scrollHeight - $window.innerHeight() + 'px' :
                            scrollTOT + 'px'
                        }, defaults.scrollOnClick_multi[socm].duration, defaults.scrollOnClick_multi[socm].easing);
                    });
                }
            }
            
            
            /* ----------------------------
                * Window Events
            ---------------------------- */
            
            // Stop scroll animation when scroll with mouse
            $window.on('mousedown', function (e) {
                if (e.target.nodeName === 'HTML') {
                    $docRoot.stop();
                }
            });
            
            // Reset target position
            $window.on('mouseup', function (e) { 
                if (e.target.nodeName === 'HTML') {
                    target = window.pageYOffset;
                }
            });
            
            // Check if scrollTop passed btn-threshold on scroll
            $window.on('scroll', function () {
                is_passed();
            });
            
            // Change page height on resize
            $window.on('resize', function () {
                pageLen = $window.innerHeight();
                if (!is_elementHasScroll)
                    scrollBottomPos = document.body.scrollHeight - $window.innerHeight();
            });
            
            // Change target position when scroll with mousewheel
            window.onwheel = function (e) { 
                target = $window.scrollTop();
            };
            
        } //./defaults.btn
        
        
        if (defaults.scrollPress) {
            
            var scrollBottomPos = document.body.scrollHeight - $window.innerHeight(),
                pageLen = scroll_Len.pg_scroll,
                endLen = scroll_Len.end_scroll,
                parentLoopList = [],
                clickedElem, elemParent, parentWithScroll, elementToScroll,
                is_elementHasScroll = false, isActive_parentWithScroll = false;
            
            elementToScroll = $docRoot;
            /**
             * Scroll element which have visible scroll y till the end or up of it
            */
            
            function scrollDocOpts() {
                is_elementHasScroll = false;
                scrollBottomPos = document.body.scrollHeight - $window.innerHeight();
                pageLen = scroll_Len.pg_scroll;
                target = window.pageYOffset;
                elementToScroll = $docRoot;
            }
            
            function scrollElemOpts() {
                scrollBottomPos = clickedElem.scrollHeight - parentWithScroll.height();
                pageLen = parentWithScroll.height();
                elementToScroll = parentWithScroll;
            }
            
            function parents_loop(elem) {
                parentLoopList.push(elem);
                // clicked element
                clickedElem = parentLoopList[0];
                // Current parent
                elemParent = elem.parentNode;
                if (elemParent.nodeName != 'BODY') {
                    // if current parent height lower than clicked element height 
                    if ($(elemParent).height() < clickedElem.scrollHeight) {
                        parentWithScroll = $(elemParent);
                        is_elementHasScroll = true;
                    } else {
                        parents_loop(elemParent);
                    }
                } else {
                    scrollDocOpts();
                    isActive_parentWithScroll = false;
                }
            }
            
            $window.on('click', function (e) {
                parentLoopList = [];
                parents_loop(e.target);
                if (is_elementHasScroll)
                    target = parentWithScroll.scrollTop();
            });
            
            $(this).on('keydown', function (e) {
                if (is_elementHasScroll) {
                    // if parent scrolled to top and one of keys to up pressed
                    // or parent scrolled to down and one of keys to down pressed
                    // then scroll the document
                    
                    if (parentWithScroll.scrollTop() === 0 && /(38|33|36)/.test(e.which)
                        || parentWithScroll.scrollTop() === (clickedElem.scrollHeight - parentWithScroll.height()) && /(40|34|35|32)/.test(e.which)) 
                    {
                        scrollDocOpts();
                        isActive_parentWithScroll = true;
                    } else {
                        isActive_parentWithScroll = false;
                        scrollElemOpts();
                    }
                }
                
                if (isActive_parentWithScroll) {
                    // if parentWithScroll scrolled up and keydown pressed
                    // or parentWithScroll scrolled down and keyup pressed
                    if (parentWithScroll.scrollTop() === 0 && /(40|34|35|32)/.test(e.which) ||
                       parentWithScroll.scrollTop() === (clickedElem.scrollHeight - parentWithScroll.height()) && /(38|33|36)/.test(e.which)) 
                    {
                        target = parentWithScroll.scrollTop();
                        is_elementHasScroll = true;
                        scrollElemOpts();
                    }
                }
                
                /* Disable keys scroll on all inputs */
                if (!/(textarea|input)/i.test(document.activeElement.nodeName)) {
                    switch (e.which) {
                        case keyCodes.pagedown: 
                            e.preventDefault();
                            downKey(pageLen);
                            break;
                        case keyCodes.up:
                            e.preventDefault();
                            upKey(scroll_Len.arrow_scroll);
                            break;
                        case keyCodes.down:
                            e.preventDefault();
                            downKey(scroll_Len.arrow_scroll);
                            break;
                        case keyCodes.pageup:
                            e.preventDefault();
                            upKey(pageLen);
                            break;
                        case keyCodes.home:
                            e.preventDefault();
                            homeKey();
                            break;
                        case keyCodes.end:
                            e.preventDefault(document.body.scrollHeight - $window.innerHeight());
                            endKey();
                            break;
                        case keyCodes.space:
                            e.preventDefault();
                            downKey(pageLen);
                            break;
                        default:
                            $.noop();
                    }
                }
            });
            
            
            function downKey(l) {
                if (elementToScroll.scrollTop() + l > document.body.scrollHeight - $window.innerHeight()) {
                    elementToScroll.stop().animate({ scrollTop: document.body.scrollHeight - $window.innerHeight() + 'px' }, defaults.duration, defaults.easing);
                    target = document.body.scrollHeight - $window.innerHeight();
                } else if ( target <= document.body.scrollHeight - $window.innerHeight() ) {
                    target += l;
                    elementToScroll.stop().animate({ scrollTop: target + 'px' }, defaults.duration, defaults.easing);
                }
            }

            function upKey(l) {
                if (elementToScroll.scrollTop() - l < 0) {
                    elementToScroll.stop().animate({ scrollTop: 0 + 'px' }, defaults.duration, defaults.easing);
                    target = 0;
                } else if ( target >= 0 ) {
                    target -= l;
                    elementToScroll.stop().animate({ scrollTop: target + 'px'}, defaults.duration, defaults.easing);
                }
            }

            function homeKey(l) {
                if ( target > 0 ) {
                    target = 0;
                    elementToScroll.stop().animate({ scrollTop: target + 'px' }, defaults.duration, defaults.easing);
                } else {
                    return;
                }
            }

            function endKey(l) {
                if ( target < document.body.scrollHeight - $window.innerHeight() ) {
                    target = document.body.scrollHeight - $window.innerHeight();
                    elementToScroll.stop().animate({ scrollTop: target + 'px'}, defaults.duration, defaults.easing);
                } else {
                    elementToScroll.stop().animate({ scrollTop: document.body.scrollHeight - $window.innerHeight() + 'px'}, defaults.duration, defaults.easing);
                    return;
                }
            }
        }
    };
    
    /**
     * jqueryUi easing functions
    */ 
    $.extend($.easing, {
                def: 'easeOutQuad',

                swing: function (x, t, b, c, d) {
                    //alert($.easing.default);
                    return $.easing[$.easing.def](x, t, b, c, d);
                },
                easeInQuad: function (x, t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (x, t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (x, t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (x, t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (x, t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (x, t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (x, t, b, c, d) {
                
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (x, t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (x, t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (x, t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (x, t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (x, t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (x, t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (x, t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (x, t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (x, t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (x, t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (x, t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (x, t, b, c, d) {
                    return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
                },
                easeOutBounce: function (x, t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOutBounce: function (x, t, b, c, d) {
                    if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                    return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
    });
}( window.Zepto || window.jQuery, window, document));
