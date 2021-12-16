
from flask import Blueprint, render_template, flash

from flask import current_app as app

main_blueprint = Blueprint('main_blueprint', __name__) 

@main_blueprint.route('/home', strict_slashes=False)
@main_blueprint.route('/', strict_slashes=False)
def homepage():
    return render_template('/main/homepage.html')


