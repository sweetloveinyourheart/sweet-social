###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /nest-server

COPY package.json ./

RUN yarn install

# Bundle app source
COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /nest-server

COPY package.json ./

COPY --from=development /nest-server/node_modules ./node_modules

COPY . .

RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production


###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --from=build /nest-server/node_modules ./node_modules
COPY --from=build /nest-server/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
