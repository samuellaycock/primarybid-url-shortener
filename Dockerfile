FROM node:12 as build

COPY package.json .
COPY tsconfig.client.json .
COPY tsconfig.server.json .
COPY rollup.config.js .
COPY client client/
COPY server server/

RUN npm i
RUN npm run client:build
RUN npm run server:build

FROM node:12

COPY package.json .

RUN npm i --production

COPY --from=build dist dist/

CMD [ "npm", "start" ]
