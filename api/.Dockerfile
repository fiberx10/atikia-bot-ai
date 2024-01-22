FROM node:20-alpine3.18
WORKDIR /usr/src/app
COPY ./api/package*.json ./
RUN npm install
COPY ./api/ .
RUN npm run build
EXPOSE 3000
EXPOSE 8080
CMD ["npm", "start"]
