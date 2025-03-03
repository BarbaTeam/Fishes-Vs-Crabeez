# Starter Quiz

## Installation

1) Install [NodeJS Installer](https://nodejs.org/en/download/)

Note, for those using linux, you can find instruction to install NodeJS [here](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) (install the latest LTS Version 20.11.1).

2) Clone your repository

```
git clone git@github.com:2019-2020-ps6/2023-2024-ps6-NAME_OF_YOUR_TEAM.git
```

3) Install the dependencies

Open command prompt inside the cloned repository and run: 

```
npm install
```

If you have an error saying that npm is not a known command, it means that NodeJS is not installed. 

4) Install angular/cli

```
npm install -g @angular/cli
```

5) Install playwright

```
npm install --save-dev playwright @playwright/test
```

## Run the app

```
npm start
```
Then navigate to `http://localhost:4200/` to see the application. The app will automatically reload if you change any of the source files.

You can also use the command `ng serve` to start the app and also `ng serve --open` to open directly the app in the browser.

## Install end-to-end tests framework

1) Run `npm i -D @playwright/test playwright`
2) Run `npx playwright install`

## Run the end to end tests

Before running the tests, you need to run your front-end and back-end:

1) Run your back-end: `npm run start:e2e`
2) Run your front-end: `npm run start`
3) Run the tests:  `npm run test:e2e`


## Angular documentation

The best documentation is the [Official Angular Documentation](https://angular.io/docs). 
It contains everything and it is always up to date.

#### Important note 
We are working with Angular version 2+ (here Angular 8). When you look for some documentation, add "Angular 2" in your 
research to be sure to find the right documentation. You might find documentation about AngularJS, run if it's the case! 
It's a very old version totally different from our version.

## Documentation - Links

Documentation Angular: 

- [Directives](https://angular.io/docs/ts/latest/guide/attribute-directives.html)
- [Pipes](https://angular.io/docs/ts/latest/guide/pipes.html)
- [Services](https://angular.io/docs/ts/latest/tutorial/toh-pt4.html)
- [HTTP Request with Angular](https://angular.io/docs/ts/latest/guide/server-communication.html)
- [NgOnInit](https://angular.io/docs/ts/latest/tutorial/toh-pt4.html#the-ngoninit-lifecycle-hook)
- [@Input and @Ouput](https://angular.io/docs/ts/latest/cookbook/component-communication.html)

Documentation on Observables:

- [Official Documentation rxjs](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)
- [Video Tutorial for beginers - FR](http://www.meanjs.fr/rxjs-tutoriel-1-creer-un-observable/)
- [Tutorial FR](http://home.heeere.com/tech-intro-programmation-reactive.html)

## Questions?

Any question? Do not hesitate to contact us on slack for any question. 

## Additional commands available

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
