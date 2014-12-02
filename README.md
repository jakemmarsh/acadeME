acadeME
=======

An interactive e-Learning platform for University of Maine's senior Computer Science capstone project. Built using my [react-browserify-gulp-boilerplate](https://github.com/jakemmarsh/react-browserify-gulp-boilerplate).

![Screenshot of the user interface](https://raw.githubusercontent.com/jakemmarsh/acadeME/master/screenshot.png)

## To get up and running:

- Download this repo with `git clone https://github.com/jakemmarsh/acadeME.git`
- Install node.js and NPM globally if you have not before. [Instructions here](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
- Run `npm install` from root project directory
- Run `sudo npm install -g gulp` if you have never installed Gulp
- Run `sudo npm install -g supervisor` if you have never installed Supervisor
- Run `gulp prod` from root project directory to generate the `/build` directory (the compiled application)
- Run `npm start` from the root project directory to begin serving the application to `localhost:3000`
- Navigate to `localhost:3000` to view/use the application