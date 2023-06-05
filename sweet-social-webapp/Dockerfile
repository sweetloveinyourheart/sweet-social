FROM node:18-alpine

WORKDIR /react-vite-app

EXPOSE 5173

COPY package.json yarn.lock ./

RUN yarn install --silent

COPY . .

CMD ["yarn", "dev"]