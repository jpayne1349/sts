
from flask import Blueprint, render_template, flash

from flask import current_app as app

main_blueprint = Blueprint('main_blueprint', __name__) 

# sounds like we will have to make additional routes, but that communicate to the
# front end what view they want to see.
# so people can go back to specific pages


@main_blueprint.route('/home', strict_slashes=False)
@main_blueprint.route('/', strict_slashes=False)
def homepage():
    return render_template('/main/main.html')


