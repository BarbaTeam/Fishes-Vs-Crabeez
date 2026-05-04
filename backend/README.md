# NodeJS Back-End Starter

## Install & Run

1) Install [NodeJS Installer](https://nodejs.org/en/download/) (you should already have NodeJS since it was a dependency of the Front-End)
2) install the dependencies `npm install`. If you see any vunerabilities after the installation, like `5 moderate, 1 high`, you don't need to fix them. The project will build correctly.
3) Run the application `npm run dev`

## Test your back

To test if your backend is running correctly, you first shouldn't see any error in the console, and you can then open postman (https://www.postman.com/downloads/) and launch the following request:

`GET on http://localhost:9428/api/status` : it should return `"ok"` and you should see a log appear in the console.

### Error on windows:

``` . is not recognized as an internal command```

To fix it, two options:
- Updating the `dev` command in the package.json as follow: `"dev": "%INIT_CWD%/node_modules/.bin/nodemon app/index.js",`
- In case it doesn't work:
1) Install nodemon: `npm install -g nodemon`
2) Run from git bash command line the nodemon command directly to start the server: `nodemon app/index.js`

## Development

During the development process, you should use `npm run dev` to have livereload each time you modify a file in `app` folder.

## Run the end to end tests

Before running the tests, you need to run your front-end and back-end:

1) Run your back-end: `npm run start:e2e`
2) Run your front-end: `npm run start`
3) Run the tests:  `npm run test:e2e`

## Run the linter

```
npm run lint
```
Note: The linter will be executed before each commit. If the linter fails then the commit will be canceled.

## Dependencies

The following libraries are used in this Node starter, we encourage you to have a look :
- Express (for building the http API) : https://www.npmjs.com/package/express
- Joi (for Schema validation) : https://www.npmjs.com/package/joi
