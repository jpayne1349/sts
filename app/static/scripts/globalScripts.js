
// Navbar - with some helpers in case of major screen size change


var viewport_width = 0;
var media_query_setpoint = 1200;

initNavbar();

// page load , setup navbar according to window width
function initNavbar() {
    if(window.location.pathname == '/') {
        let navbar_home_link = document.getElementById('navbar-home-link');
        navbar_home_link.remove();
    }

    viewport_width = window.innerWidth;
    if( viewport_width < 1200 ){
        let mobile = true;
        let init = true;
        navbarSetup(mobile, init);
    } else {
        let mobile = false;
        let init = true;
        navbarSetup(mobile, init);
    }

    window.addEventListener('resize', updateNavbar);
}

// on page resize, check if a change need to be made to listeners
function updateNavbar() {

    let new_viewport_width = window.innerWidth;

    if( new_viewport_width > media_query_setpoint && viewport_width > media_query_setpoint ) {
        return
    }
    if( new_viewport_width < media_query_setpoint && viewport_width < media_query_setpoint ) {
        return
    }
    if( new_viewport_width > media_query_setpoint && viewport_width < media_query_setpoint ) {
        // changed to desktop
        console.log('navbar update to desktop');

        let mobile = false;
        let init = false;
        navbarSetup(mobile, init);

        viewport_width = new_viewport_width;
        return
    }
    if( new_viewport_width < media_query_setpoint && viewport_width > media_query_setpoint ) {
        // changed to mobile
        console.log('navbar update to mobile');

        let mobile = true;
        let init = false;
        navbarSetup(mobile, init);

        viewport_width = new_viewport_width;
        return
    }

}

// setup listeners on navbar based on device type passed in
function navbarSetup(mobile_bool, init_bool) {

    if(mobile_bool) {
        console.log('adding mobile listener');
        let burger = document.getElementById('navbar-burger');        
        burger.addEventListener('click', burgerToggle);
    }

    function burgerToggle() {
        let navbar_link_container = document.getElementById('navbar-link-container');

        this.classList.toggle('show');
        navbar_link_container.classList.toggle('show');

    }

    let navbar_link_divs = document.getElementsByClassName('navbar-link-div');

    for( let link_div of navbar_link_divs ) {
        let var_attr = link_div.getAttribute('var');
        if( var_attr == 'services' || var_attr == 'portfolio' ) {
            if(mobile_bool) {
                link_div.addEventListener('click', toggleSubLinks);
            }
            
            let navbar_link_div_children = link_div.children;
            let arrow = navbar_link_div_children[2];
            let sub_link_div = navbar_link_div_children[3];
            let sub_links = sub_link_div.children;
            
            // remove mobile listeners and classes
            if(!init_bool && !mobile_bool) {
                link_div.removeEventListener('click', toggleSubLinks);
                if(link_div.classList.contains('show')) {
                    link_div.classList.remove('show');
                    sub_link_div.classList.remove('show');
                    arrow.classList.remove('show');
                }
            }
            
            for( let sub_link of sub_links) {
                sub_link.addEventListener('click', goToLink);
            }

            continue;
        }

        link_div.addEventListener('click', goToLink);
    }

    function toggleSubLinks(evt) {
        // attempt to stop an underlying click to go to url
        evt.stopPropagation;
        let navbar_link_div_children = this.children;
        let arrow = navbar_link_div_children[2];
        let sub_link_div = navbar_link_div_children[3];

        sub_link_div.classList.toggle('display');
        setTimeout(()=>sub_link_div.classList.toggle('show'),100);

        arrow.classList.toggle('show');
        this.classList.toggle('show');
    }

    function goToLink() {
        let extension = this.getAttribute('var');

        window.location.href = extension;

    }

}
