# Fisustaja

Application that is made for hosting fishing competitions (in Cup type setting, or standalone). Application was made for myself in a span of 6 years, and for the purpose of learning Node, MongoDB JavaScript and Vue 2 stack. It's definitely not the most efficient or the most clever design, because I wanted to explore different things and it has been made in the span of 6 years working on and off on it.

## What it does

- Can create competitions, and link them together in Cups
- Handles:
  - Signing of boats (into competition)
  - Weighting
  - Shows results
  - Shows statistics

## Frontend

<div>
    <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="40" height="40"/>&nbsp;
    <img src="https://github.com/devicons/devicon/blob/master/icons/vuejs/vuejs-original-wordmark.svg" title="Vue.js" \*\*alt="Vue.js" width="40" height="40"/>&nbsp;
    <img src="https://github.com/devicons/devicon/blob/master/icons/vuetify/vuetify-original.svg" title="Vuetify" \*\*alt="Vuetify" width="40" height="40"/>&nbsp;
    
</div>

## Backend

<div>
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original-wordmark.svg" title="NodeJS" alt="NodeJS" width="40" height="40"/>&nbsp;
  <img src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original-wordmark.svg" title="mongoDB" **alt="mongoDB" width="40" height="40"/>&nbsp;
</div>

## post-mortem?

If I would start this project from 0 right now, I would probably use Go for the backend and Svelte or Vue 3 without Vuetify for the frontend. Not because I know those technologies better, but I've heard Go is great for server stuff, and I'd like to learn Go and Svelte (or some other framework than Vue or React) more.

## Todo (if I want to dedicate more time on this)

- Use local database for developing
- Migrate from Vue 2 to Vue 3
- Dedicate more time for API design and authentication
- Improve old code, remove duplicate code and make templates for them
- Improve loading times, first loads feel slow and clunky
- Properly use state and it's functions
- Use cookies. Localstorage was just easy thing to use while developing.
- Caching?
- Docker?
- Tests
- Features mentioned in [todos.todo](https://github.com/purkkilo/FisuJS/blob/master/todos.todo)

## Setup

- Setup either [local](https://www.prisma.io/dataguide/mongodb/setting-up-a-local-mongodb-database) or [online](https://www.mongodb.com/docs/atlas/getting-started/) MongoDB database

- Use [template.env](https://github.com/purkkilo/FisuJS/blob/master/server/template.env), rename it to just .env and fill the information inside it accordingly.

### Install dependancies and run:

- "npm install" in root directory and in client directory

- "npm run dev" to run both concurrently in root directory, or separately with:
  - "npm run server" (in root directory)
  - "npm run server" (in client directory)
