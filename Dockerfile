FROM node:18.12.0
WORKDIR '/app'
COPY package.json .

RUN npm install

EXPOSE 3000
COPY . .


CMD [ "npm" , "run" , "start" ]