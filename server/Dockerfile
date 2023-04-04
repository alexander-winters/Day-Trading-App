FROM node:latest

WORKDIR /server

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g

COPY . .

EXPOSE 5000

CMD ["npm", "start"]