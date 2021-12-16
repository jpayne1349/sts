

// TODO: build out some other block-content type stuff.
        // use blocks like that as the pages, css transform or wahtever can be applied to the whole block.
    // block can additions added via js, etc. 
    // we need a block associated with each 'var' attribute that's able to be selected

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
  'view':''
};

// set initial window state, (state_object, page title, url_path)
window.history.replaceState(app_state, null, "");

// function to be run on back button press
window.onpopstate = page_state_push;

navbarListeners();
// setup listeners on the navbar buttons to change page state
function navbarListeners() {

  let navbar_link_divs = document.getElementsByClassName("navbar-link-div");

  for (let link_div of navbar_link_divs) {
    
    link_div.addEventListener('click', page_state_push);
    
  }
}

// change of page state by user clicking on page item
function page_state_push() {

  let button = this;
  let next_state = button.getAttribute('var');

  app_state.view = next_state;

  window.history.pushState(app_state, null, "");

  console.log(app_state);

}

// change of page state with back or forward browser buttons
function page_state_pop(event) {
  console.log(event.state.view);
}

// needs to cause the css to change, trigger ajax calls if necessary, etc.
function page_view_change() {



}
