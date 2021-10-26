// LOGO - trying out an svg animation

animateLogo();

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

// Navbar - with some helpers in case of major screen size change
// TODO: navbar screen size change-listeners is buggy, not high priority

var viewport_width = 0;
var media_query_setpoint = 1200;

initNavbar();

// page load , setup navbar according to window width
function initNavbar() {
  if (window.location.pathname == "/" || window.location.pathname == "/home") {
    let navbar_home_link = document.getElementById("navbar-home-link");
    navbar_home_link.remove();
  }

  viewport_width = window.innerWidth;
  if (viewport_width < 1200) {
    let mobile = true;
    let init = true;
    navbarSetup(mobile, init);
  } else {
    let mobile = false;
    let init = true;
    navbarSetup(mobile, init);
  }

  window.addEventListener("resize", updateNavbar);
}

// on page resize, check if a change need to be made to listeners
function updateNavbar() {
  let new_viewport_width = window.innerWidth;

  if (
    new_viewport_width > media_query_setpoint &&
    viewport_width > media_query_setpoint
  ) {
    return;
  }
  if (
    new_viewport_width < media_query_setpoint &&
    viewport_width < media_query_setpoint
  ) {
    return;
  }
  if (
    new_viewport_width > media_query_setpoint &&
    viewport_width < media_query_setpoint
  ) {
    // changed to desktop
    console.log("navbar update to desktop");

    let mobile = false;
    let init = false;
    navbarSetup(mobile, init);

    viewport_width = new_viewport_width;
    return;
  }
  if (
    new_viewport_width < media_query_setpoint &&
    viewport_width > media_query_setpoint
  ) {
    // changed to mobile
    console.log("navbar update to mobile");

    let mobile = true;
    let init = false;
    navbarSetup(mobile, init);

    viewport_width = new_viewport_width;
    return;
  }
}

// setup listeners on navbar based on device type passed in
function navbarSetup(mobile_bool, init_bool) {
  if (mobile_bool) {
    console.log("adding mobile listener");
    let burger = document.getElementById("navbar-burger");
    burger.addEventListener("click", burgerToggle);
  }

  function burgerToggle() {
    let navbar_link_container = document.getElementById(
      "navbar-link-container"
    );

    this.classList.toggle("show");
    navbar_link_container.classList.toggle("show");
  }

  let navbar_link_divs = document.getElementsByClassName("navbar-link-div");

  for (let link_div of navbar_link_divs) {
    let var_attr = link_div.getAttribute("var");
    if (var_attr == "services" || var_attr == "portfolio") {
      if (mobile_bool) {
        link_div.addEventListener("click", toggleSubLinks);
      }

      let navbar_link_div_children = link_div.children;
      let arrow = navbar_link_div_children[2];
      let sub_link_div = navbar_link_div_children[3];
      let sub_links = sub_link_div.children;

      // remove mobile listeners and classes
      if (!init_bool && !mobile_bool) {
        link_div.removeEventListener("click", toggleSubLinks);
        if (link_div.classList.contains("show")) {
          link_div.classList.remove("show");
          sub_link_div.classList.remove("show");
          arrow.classList.remove("show");
        }
      }

      for (let sub_link of sub_links) {
        sub_link.addEventListener("click", goToLink);
      }

      continue;
    }

    link_div.addEventListener("click", goToLink);
  }

  function toggleSubLinks(evt) {
    // attempt to stop an underlying click to go to url
    evt.stopPropagation;
    let navbar_link_div_children = this.children;
    let arrow = navbar_link_div_children[2];
    let sub_link_div = navbar_link_div_children[3];

    sub_link_div.classList.toggle("display");
    setTimeout(() => sub_link_div.classList.toggle("show"), 100);

    arrow.classList.toggle("show");
    this.classList.toggle("show");
  }

  function goToLink() {
    let extension = this.getAttribute("var");

    window.location.href = extension;
  }
}
