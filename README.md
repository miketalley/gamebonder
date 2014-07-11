Gamebonder v0.01
================

Gamebonder is a simple web application that allows you to search for two games and bond them together. A reason is provided when establishing each bond to describe how the games are alike. The games bonds are then shown visually through a D3 force chart.

View the app at http://gamebonder.herokuapp.com/


Features
--------
* Search for source and target to bond - uses asynchronous AJAX requests to [Giant Bomb API](http://api.giantbomb.com)
* Enter bond reason and submit - adds both games, the bond, and reason to PostgreSQL DB
* Visualize all games bonds or all games bonded(through multiple layers) to a specific game


Project Description
-------------------
This project was created for [General Assembly](http://www.generalassemb.ly)'s Web Development Immersive program. The
project utilizes [Angular JS](http://angularjs.org), [D3 JS](http://d3js.org/), [Ruby on Rails](http://rubyonrails.org/), Javascript, and [jQuery](http://jquery.com/).

This project was brainstormed, scoped and developed in one week.

Some future improvements include...
* Making recommendations of games based on specific criteria
* Weighting the size of bonded games based on bond strength
* AngularJS animations to improve UX


Installation
------------
API Keys:
You will need an API Key from Giant Bomb in order to make requests. Check out the [Giant Bomb Quick Start Guide](http://www.giantbomb.com/forums/api-developers-3017/quick-start-guide-to-using-the-api-1427959/)

Installed gems include:
* angularjs-rails
* d3-rails
* puma
* bootstrap-sass
* rails_12factor
* jquery-turbolinks
* pry-rails
* newrelic_rpm

To begin, run `bundle install`


Developed by: [Mike Talley](https://github.com/miketalley) - [michael.d.talley@gmail.com](mailto: michael.d.talley@gmail.com) - [michaeltalley.com](http://www.michaeltalley.com)
