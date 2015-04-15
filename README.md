acadeME
=======

By [Jake Marsh](http://jakemmarsh.com), advised by Sudarshan Chawathe.

An interactive e-Learning platform for University of Maine's senior Computer Science capstone. The goal is to build upon the approaches taken by popular e-Learning sites, adding additional features and ideas to make the experience closer to that of the physical classroom. This is due to e-Learning's growing popularity and benefits but lack of interaction, feedback, or guidance.

Built using my [react-rocket-boilerplate](https://github.com/jakemmarsh/react-rocket-boilerplate).

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

Below is a `.env` file (with any actual keys/credentials removed). This same structure can be used to add any extra configuration information you may need, available at `process.env.*` while running on the server-side.

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

### Directory Structure

Below is an outline and description of this project's directory and file structure. This does **not** include installed or built files, which will be in the directories `/node_modules` and `/build`, respectively, after installing and building.

```
/api
  /__tests__     (All Mocha tests covering the API.)
  /models        (All SequelizeJS models used for interaction and saving in the database.)
  /routes        (All API endpoints logic.)
  /utils         (Helpers for the API.)
  index.js       (The Express-based API for interacting with the database.)
  passport.js    (User authentication logic and initialization.)
  queue.js       (Logic for processing the chat job queue.)
  sockets.js     (Logic for handling messages via WebSockets.)
/gulp
  /tasks         (All separate Gulp tasks, used for automating build processes.)
  /util          (Helpers for the Gulp tasks.)
  config.js      (Gulp configuration for file locations, credentials, etc.)
  index.js       (Loads all files within /tasks to be sent to the Gulpfile.js.)
/utils           (Helpers used by Mocha tests on the frontend and backend.)
/js              (The frontend logic shared between the server and client.)
  /__tests__     (All Mocha tests covering the frontend.)
  /actions       (RefluxJS actions for initiating API interaction and store updates.)
  /components    (Individual ReactJS components.)
  /mixins        (Individual ReactJS mixins.)
  /pages         (Entire ReactJS pages served by the router.)
  /stores        (RefluxJS stores responsible for client data syncing and storage.)
  /utils         (Helpers for any frontend logic.)
  App.jsx        (The parent ReactJS component of all pages.)
  Html.jsx       (The HTML used to wrap the ReactJS app, necessary for server-side rendering.)
  index.js       (The main Javascript file responsible for loading and running the application.)
  Routes.jsx     (The react-router logic and architecture for routing the application client-side.)
/lib
  /pdfjs         (Library used for PDF processing and display.)
/public
  /fonts         (Any fonts used by the frontend, to be copied to /build/fonts.)
  /images        (Any images used by the frontend, to be copied to /build/images.)
  /styles        (SASS files, automatically compiled into a single CSS file in /build/css.)
gulpfile.js      (Reads all Gulp tasks from /gulp/tasks and allows you to run them.)
package.json     (Project details, dependencies, and scripts.)
populateDb.js    (Populates the database with test data when in development mode.)
server.js        (Runs the node.js server, serving both the API and frontend.)
```