# scrollpress
ScrollPress is a JQuery plugin to make smooth animations on scroll top.
> V 1.0

# setup
$(window).scrollPress({options});

# options
 Options   |  Type    |  Default value    |  Description
---------- | :------: | :---------------: | -------------
scrollPress | Boolean |        true       | To animate scrollTop when press on any key that makes changes on scrollTop (pg up/space/...)
duration    | Number  |        1000       | Duration of scrollTop animation
easing      | String  |   easeInOutCubic  | Easing function of scrollTop animation
btn_state   | Boolean |       true        | Scroll to top button
btn_icon    | String  | \<i class='fa fa-angle-up'>\</i> | Scroll to top arrow
btn_container | JQuery Selector | null | Scroll to top botton container, to make it relative to element instead of screen. example: to put button at footer.
btn_threshold | Number | $window.innerHeight()/3 | To show scroll to top button when scrollTop passes it.
btn_inlineStyle | Boolean | true | Disable incase of styling with external stylesheet
btn_style | Object | style properties | Scroll to top button style
btn_fadeAnimation | Object |  slide/ scale | Buttom animation when scroll to passes threshold
fadeInClass | String | btn_fadeAnimation classes | Class added to button when scroll to passes threshold
btn_clickAnimation_bounce | Boolean | false | Add bounce animtion when click on button
btn_clickAnimation_bubble | Object  |       | Add Bubble animtion when click on button
btn_clickAnimation_spreadBorder | Object  |       | Add spread border animtion when click on button
btn_clickClass | String | btn_clickAnimation classes | Add class when click on button
scrollOnClick | Object |    | scroll to target when click on element
<span>&emsp;&emsp;&emsp;&emsp;&emsp;autoDetect</span> | Boolean | true | To animate scrollTop when click on anchor that hold element id in it's href
<span>&emsp;&emsp;&emsp;&emsp;&emsp;clickOn</span> | JQuery selector | Null | To move scollTop to target when click on it
<span>&emsp;&emsp;&emsp;&emsp;&emsp;scrollTo</span> | JQuery selector | Null | clickOn Target
<span>&emsp;&emsp;&emsp;&emsp;&emsp;duration</span> | Number | 1400 | ScrollTop animation duration
<span>&emsp;&emsp;&emsp;&emsp;&emsp;easing</span> | String | easing | ScrollTop animation timing function
scrollOnClick_multi | Object |  | Like scrollOnClick but with putting options in another Object (label). Example: scrollOnClick_multi: { home: { clickOn: ... },</br> about: { ... } }


# Options in act

```javascript

$(window).scrollPress({
            scrollPress: true,
            
            // Global animation duration
            duration: 1000,
            
            // Global animation timing function
            easing: 'easeInOutCubic',
            
            btn_state: null,
            
            // btn arrow icon
            btn_icon: "<i class='fa fa-angle-up'></i>",
            
            /**
             * type {Jquery selector}
             * example: $('.footer-element-scrollToTop')
            */
            btn_container: null,
            
            // type {Number}
            btn_threshold: $window.innerHeight()/3,
            
            // disable incase of styling with external stylesheet
            btn_inlineStyle: true,
            
            btn_style: {
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
            
            btn_fadeAnimation: {
                slide: true,
                scale: true,
                bounce: false,
                rotate: false,
            },
            
            // type {String}
            btn_fadeInClass: null,
            
            // type {Boolean}
            btn_clickAnimation_bounce: false,
            
            btn_clickAnimation_bubble: {
                state: true,
                outerHTML: '<div class="click-bubble-container"><div class="click-bubble"></div></div><!--/.click-bubble-->',

                inlineStyle: true,
                zIndex: '999',
                width: '100%',
                height: '100%',
                backgroundColor: '#96d0ff',
                borderRadius: null,
            },
            
            btn_clickAnimation_spreadBorder: {
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
            },
            
            //type {String}
            btn_clickClass: null,
            
             /*
             * scroll to target offset when click on selector
            */
            scrollOnClick: {
                
                // type {JQuery selector} 
                clickOn: null,
                
                /**
                 * unique selector(preferred id)
                 * type {JQuery selector} 
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
            }
});
```
