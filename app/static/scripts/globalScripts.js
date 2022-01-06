// TODO:
// url_path needs to be updated at each view change

// page load = check url and display correct view

let view_list = [];

// this will hold all the views, their callbacks, statuses, etc
class View {
  constructor(view_name, setupCallback, displayCallback, hideCallback) {
    this.setup = setupCallback;
    this.display = displayCallback;
    this.hide = hideCallback;

    this.isSetup = false;
    this.name = view_name;

    this.addToViewList();
  }

  addToViewList() {
    view_list.push(this);
  }

  async asyncDisplay() {
    console.log(this.isSetup);
    if(!this.isSetup) {
      const await_setup = await this.setup();
      this.display();
    } else {
      this.display();
    }

  }

}

// creation of new view
const home_view = new View('home', homepageSetup, displayHomepage, hideHomepage);
const services_view = new View('services', servicesSetup, displayServices, hideServices);

animateLogo();
// uses gsap to type out company name.
function animateLogo() {
  // create new timeline object from Class TimlineMax...
  var timeline = new TimelineMax({ repeat: -1 });
  initCursorBlink();

  let svg_group = document.getElementById("svgGroup");
  let path_elements = svg_group.children;

  let path_count = path_elements.length;
  let first_loop_length = 14;
  let next_x_position = 0;

  // index corresponds to settings of each loop to be performed
  let loop_lengths = [ 3,   6,   1   ,3  , 3 ,  8,   2]; // total should = 26
  let loop_delays = [  400, 100, 200 ,100 ,300, 100, 400 ];

  // starts a recursive function that pulls it's params from the two lists above
  intervalLoops(0,0);

  function intervalLoops(current_position, loop_count) {
    let stopping_position = current_position + loop_lengths[loop_count];
    let position = current_position;

    // check for overstepping the overall animation length
    if (position > path_count) {
      return;
    }

    let loopingInterval = setInterval(() => {
      // looping for each path element
      if (position < stopping_position) {
        incrementCursor(position);
      } else {
        clearInterval(loopingInterval);
        // calling next function with position as current_position
        intervalLoops(position, loop_count + 1);
        return;
      }
      // increment counter for each path evaluated
      position += 1;

    }, loop_delays[loop_count]);
  }

  // gets the svg path element and applies the gsap timeline func or css to it
  function incrementCursor(current_position) {
    let svg_path = path_elements[current_position];
    let svg_path_rect = svg_path.getBBox();
    let svg_path_right_x = svg_path_rect.x + svg_path_rect.width;

    // on second pass, start to display the previous path right before the cursor moves
    if (current_position > 0) {
      let previous_path = path_elements[current_position - 1];

      previous_path.style.opacity = "1";
    }
    moveTo(next_x_position);
    next_x_position = svg_path_right_x;

    function moveTo(position) {
      gsap.to("#logo-cursor", 0, {
        x: position,
        opacity: 1,
      });
    }
  }

  // applies gsap func to cursor element
  function initCursorBlink() {
    //this is blinking the cursor, indefinitely
    timeline.from("#logo-cursor", 0.4, {
      opacity: 0,
      ease: Power2.easeOut,
      delay: 0.8,
    });
  }
}

// global app state to be updated as views change. still in progress
var app_state = {
  'view':'home',
  'prev_view':''
};

// we need to read the incoming url here. 
let incoming_pathname = window.location.pathname;
let incoming_view_name = incoming_pathname.slice(1);
console.log('incoming view name = ', incoming_view_name);

// if server responds, it is a valid view name. so no need to check that.
if(incoming_view_name != '') {
  app_state.view = incoming_view_name;
  // call load view here?
  load_new_page_view();

} else {
  // set initial window state with no specified path, (state_object, page title, url_path)
  window.history.replaceState(app_state, 'STS | Home', "");
  
  load_new_page_view();
}

// function to be run on back/forward button press
window.onpopstate = page_state_pop;
// may be able to just change this to run the load view function...


nvabar_click_listeners();
// setup listeners on the navbar buttons to change page state
function nvabar_click_listeners() {

  let navbar_link_divs = document.getElementsByClassName("navbar-link-div");

  for (let link_div of navbar_link_divs) {
    
    link_div.addEventListener('click', page_state_push);
    
  }
}

// compares current state to var attributes, sets classes of navbar divs
function update_navbar_active_dots() {

  let current_state_name = app_state.view;
  let previous_state_name = app_state.prev_view;
  let navbar_link_divs = document.getElementsByClassName('navbar-link-div');

  for( let link_div of navbar_link_divs) {
    let link_div_var = link_div.getAttribute('var');
    let link_div_children = link_div.children;
    let link_div_label = link_div_children[1];
    let link_div_dot = link_div_children[2];

    if( link_div.classList.contains('active')) {
      link_div.classList.remove('active');
      link_div_dot.classList.remove('active');
      setTimeout(()=>{
        link_div_label.classList.remove('active');
      }, 500);
    }

    if (link_div_var == current_state_name) {
      link_div.classList.add('active');
      link_div_label.classList.add('active');
      setTimeout(()=>{
        link_div_dot.classList.add('active');
      }, 500);
    }
  }
}

// change of page state by user clicking on page item
function page_state_push() {
  
  let button = this;
  let next_state = button.getAttribute('var');

  // if you clicked on the view state you're already looking at
  if(app_state.view == next_state) {
    return;
  }

  app_state.prev_view = app_state.view;
  app_state.view = next_state;

  window.history.pushState(app_state, null, "");

  load_new_page_view();

}

// change of page state with back or forward browser buttons
// ** the browser stores all past/future app states when user uses the back/forward buttons.
function page_state_pop(event) {

  let updated_state = event.state.view;
  let updated_prev_state = event.state.prev_view;

  if(app_state.view == updated_state) {
    return;
  }

  app_state.view = updated_state;
  app_state.prev_view = updated_prev_state;

  load_new_page_view();
}


// check the global. apply css to appropriately id'ed elements to initiate the view swap.
function load_new_page_view() {
  // change active view dots
  update_navbar_active_dots();

  let current_view_list = document.getElementsByClassName('active-view');
  let current_view = current_view_list[0];
  // if current_view = undefined, there is no current view loaded yet.
  if(current_view != undefined) {
    // search for view object to pull hide function
    for( let view of view_list) {
      if(view.name == app_state.prev_view) {
        view.hide();
      }
    }
  }

  // ** build timer in here? possibly based on a view.transition_time variable
  // def needs to be dynamic. like when their is no previous view (ie on page load, it should be as fast as possible)
  // if not timed right, it will cut off the outgoing animation/transition

  setTimeout(()=>{
    // loop through view list and display next view
    for( let view of view_list ) {
      if(view.name == app_state.view) {
        console.log('run async display');
        view.asyncDisplay();
      }
    }
  }, 500);


  // async timeline for changing views
  const view_change = async () => {
    // just say, remove active view or no


  }
}

// sizing and formatting for homepage items
function homepageSetup() {
    let demo_phone_height_margin_value = 15;

    let homepage_div = document.getElementById('home');
    homepage_div.classList.add('active-view');
  
    // sizing the demo phone outline
    let demo_phone_div = document.getElementById('demo-phone');
    let demo_phone_top = demo_phone_div.offsetTop;
    let navbar_container = document.getElementById('navbar-container');
    let navbar_top = navbar_container.offsetTop;
    let demo_phone_height = navbar_top - demo_phone_top;
    demo_phone_div.style.height = demo_phone_height - demo_phone_height_margin_value + 'px';
    let demo_phone_width = demo_phone_height * (9/19.5);
    demo_phone_div.style.width = demo_phone_width + 'px';

    // phone outline is hidden until the width/height are set
    demo_phone_div.classList.add('loaded');

    // position the notch
    let demo_notch = document.getElementById('demo-notch');
    let notch_width = demo_notch.offsetWidth;
    demo_notch.style.left = ((demo_phone_width / 2) - (notch_width/2)) + 'px';

    // position the swipe bar
    let demo_swipe_bar = document.getElementById('demo-swipe-bar');
    let swipe_bar_width = demo_swipe_bar.offsetWidth;
    demo_swipe_bar.style.left = (demo_phone_width / 2) - (swipe_bar_width / 2) + 'px';

    // demo-header-clock setup
    let demo_header_clock = document.getElementById('demo-header-clock');
    setDemoPhoneClock(demo_header_clock);

    // recursive function for getting time for the demo phone clock
    function setDemoPhoneClock(clock_element) {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        m = addZero(m);
        clock_element.innerHTML =  h + ":" + m;
        let time_till_next_minute = (61 - s) * 1000;
        console.log('time set');
        setTimeout(() => setDemoPhoneClock(clock_element), time_till_next_minute);

        // adds a string '0' to numbers less than 10
        function addZero(i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
            return i;
        }
    }

    return 'homepage_setup';
  }

function displayHomepage() {
    // check homepage to see if it's active, as it could have been hidden previously
    let homepage_div = document.getElementById('home');
    if(!homepage_div.classList.contains('active-view')) {
      homepage_div.classList.add('active-view');
    }

    let demo_phone_div = document.getElementById('demo-phone');

    setTimeout(() => {
      // trigger initial phone rotate out
      demo_phone_div.classList.add('show');
    }, 100);

    // adding class 'show' to phone child elements
    setTimeout(function(){
        let demo_phone_elements = demo_phone_div.children;
        for(let element of demo_phone_elements) {
            element.classList.add('show');
        }
    }, 500);

    // at finish of animation, show the contact button
    let hp_contact_form_div = document.getElementById('homepage-contact-form-div');
    setTimeout(function() {
      // only do these later animations if the view is still active
      if(homepage_div.classList.contains('active-view') && demo_phone_div.classList.contains('show')) {
        demo_phone_div.classList.add('display-button');

        hp_contact_form_div.classList.add('show');
      }
    }, 11000);
}

function hideHomepage() {
  let homepage_div = document.getElementById('home');
  let div_children = homepage_div.children;

  div_children[1].classList.remove('show');

  let demo_phone_div = document.getElementById('demo-phone');

  // start to hide the phone elements immediately
  let demo_phone_elements = demo_phone_div.children;
  for(let element of demo_phone_elements) {
      element.classList.remove('show');
  }

  setTimeout(function(){
    demo_phone_div.classList.remove('show');
    demo_phone_div.classList.remove('display-button');
  }, 100);

  setTimeout(function(){
    homepage_div.classList.remove('active-view');

  }, 1000);

}


// sizing and formatting for services view
function servicesSetup() {
  // the services div height needs to be set
  let services_div = document.getElementById('services');
  let services_div_top = services_div.offsetTop;
  let navbar_container = document.getElementById('navbar-container');
  let navbar_top = navbar_container.offsetTop;
  let services_div_height = navbar_top - services_div_top;
  services_div.style.height = services_div_height + 'px';

}

function displayServices() {
  let services_div = document.getElementById('services');
  let service_wrappers = services_div.children;

  // classname identifier
  services_div.classList.add('active-view');

  setTimeout(()=>{
    for( let serv_wrapper of service_wrappers ) {
      serv_wrapper.classList.add('show');
    }
  }, 300);

  setTimeout(()=>{
    for( let serv_wrapper of service_wrappers ) {
      serv_wrapper.classList.add('straighten');
    }
  }, 800);

}

function hideServices() {

  let services_div = document.getElementById('services');
  let service_wrappers = services_div.children;

  for( let serv_wrapper of service_wrappers ) {
    serv_wrapper.classList.remove('straighten');
  }
  setTimeout(()=>{
    for( let serv_wrapper of service_wrappers ) {
      serv_wrapper.classList.remove('show');
    }
  }, 500);

  setTimeout(()=>{
    services_div.classList.remove('active-view');
  },1500);
}