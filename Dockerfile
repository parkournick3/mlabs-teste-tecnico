FROM node:23 as build

ARG PORT=3000

WORKDIR /usr/usr/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build
# Omit the prepare script from the production build
RUN npm pkg delete scripts.prepare
RUN npm ci --only=production

FROM node:23-alpine3.19

WORKDIR /usr/usr/app

COPY --from=build /usr/usr/app/dist ./dist
COPY --from=build /usr/usr/app/node_modules ./node_modules
COPY --from=build /usr/usr/app/package.json ./package.json

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]