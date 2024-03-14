# Build stage
FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build


# Prod stage
FROM node:20

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist

COPY package*.json yarn.lock ./

RUN yarn install --production

RUN rm package*.json

EXPOSE 3000

CMD [ "node", "dist/main.js" ]
