# BUILD FOR LOCAL DEVELOPMENT
FROM node:16.18-alpine3.16 as development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn

COPY --chown=node:node . .

RUN yarn prisma:generate

RUN apk add libreoffice

RUN apk --no-cache add msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f

USER node


# BUILD FOR PRODUCTION
FROM node:16.18-alpine3.16 as build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN npm set-script prepare ""

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --frozen-lockfile --prod && yarn cache clean

USER node


# PRODUCTION
FROM node:16.18-alpine3.16 as production

RUN apk add libreoffice

RUN apk --no-cache add msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/Procfile ./Procfile

CMD [ "node", "dist/main.js" ]
