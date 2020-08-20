# PrimaryBid URL Shortener

Simple full-stack application that provides URL shortening functionality

## Getting started

To get started, first clone this repo:

```bash
git clone https://github.com/samuellaycock/primarybid-url-shortener.git
```

Then install the project dependencies:
```bash
cd primarybid-url-shortener && npm install
```

You can run the project in "development" mode (with watch/live-reload on the client) by running:

```bash
npm run dev
```

## Running in Docker

The project contains a simple `docker-compose.yml` file that will build the [Docker](https://www.docker.com/) images for the project and provision its runtime dependencies ([MongoDB](https://www.mongodb.com/)).

To get started, run:

```bash
docker-compose up
```

This will build the project in "production" mode. Once the images are built and are running, you can navigate to http://localhost:8080 to see the client application.

## Running the test suite

The test suites are written in [Jest](https://jestjs.io/). They are split up into to self contained test suites:

- Client unit tests
- Server integration tests

These can be run together, via:

```bash
npm test
```

To run only the client unit tests, run:

```bash
npm run test:client
```

To run only the server integration tests, run:

```bash
npm run test:server
```
