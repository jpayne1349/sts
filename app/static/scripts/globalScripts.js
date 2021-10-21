

// TODO: hide the home link when on the homepage?

navbarListeners();

// scripts for setting up navbar, currently only mobile...
function navbarListeners() {

    let burger = document.getElementById('navbar-burger');
    burger.addEventListener('click', burgerToggle);

    function burgerToggle() {
        let navbar_link_container = document.getElementById('navbar-link-container');

        this.classList.toggle('show');
        navbar_link_container.classList.toggle('show');

    }

    let navbar_link_divs = document.getElementsByClassName('navbar-link-div');

    for( let link_div of navbar_link_divs ) {
        let var_attr = link_div.getAttribute('var');
        if( var_attr == 'products' || var_attr == 'portfolio' ) {
            link_div.addEventListener('click', showSubLinks);
            continue;
        }

        link_div.addEventListener('click', goToLink);
    }

    // TODO: should this toggle the sub links instead?
    function showSubLinks() {
        let sub_link_div = this.nextElementSibling;
        sub_link_div.classList.add('show');

        let sub_links = sub_link_div.children;
        for( let link of sub_links ) {
            link.addEventListener('click', goToLink);
        }

        this.removeEventListener('click', showSubLinks);
        this.addEventListener('click', goToLink);
    }

    function goToLink() {
        let extension = this.getAttribute('var');

        window.location.href = extension;

    }

}