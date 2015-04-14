acadeME
=======

An interactive e-Learning platform for University of Maine's senior Computer Science capstone project. Built using my [react-rocket-boilerplate](https://github.com/jakemmarsh/react-rocket-boilerplate).

![Screenshot of the user interface](https://raw.githubusercontent.com/jakemmarsh/acadeME/master/screenshot.png)

## To get up and running:

- Download this repo with `git clone https://github.com/jakemmarsh/acadeME.git`
- Install node.js and NPM globally if you have not before. [Instructions here](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
- Run `npm install` from root project directory
- Run `gulp prod` from root project directory to generate the `/build` directory (the compiled application)
- Ensure you have created a `.env` file of the format discussed below (must have a PostgreSQL database, a Redis store, and AWS credentials)
- Run `npm start` from the root project directory to begin serving the application to `localhost:3000`
- Navigate to `localhost:3000` to view/use the application

---

### Sample .env configuration file

Below is a `.env` file (with any actual keys/credentials removed). This same structure can be used to add any extra configuration information you may need, available at `process.env.*` while running.

```
DB_USER=''
DB_PASSWORD=''
DB_HOST=''
DB_PORT=0
DB_NAME=''

REDIS_PORT=0
REDIS_HOST='',
REDIS_AUTH=''

SECRET=''

AWS_KEY=''
AWS_SECRET=''
S3_BUCKET=''
```

---

## Directory Structure

Below is an outline and description of this project's directory and file structure. This does **not** include installed or built files, which will be in the directories `/node_modules` and `/build`, respectively, after installing and building.

```
/api
  /__tests__
  /models
  /routes
  /utils
  index.js
  passport.js
  queue.js
  sockets.js
/gulp
  /tasks
  /util
  config.js
  index.js
/helpers
  createAuthenticatedSuite.js
  stubRouterContext.js
  testHelpers.js
/js
  /__tests__
  /actions
  /components
  /mixins
  /pages
  /stores
  /utils
  App.jsx
  Html.jsx
  index.js
  Routes.jsx
/lib
  /pdfjs
/public
  /fonts
  /images
  /styles
gulpfile.js
package.json
populateDb.js
server.js
```