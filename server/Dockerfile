FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY quote-server/package*.json ./quote-server/
COPY server/package*.json ./server/
COPY transaction-server/package*.json ./transaction-server/

RUN cd quote-server && npm install
RUN cd server && npm install
RUN cd transaction-server && npm install
RUN npm install pm2 -g

COPY server ./server
COPY quote-server ./quote-server
COPY transaction-server ./transaction-server

EXPOSE 5000

CMD ["pm2-runtime", "start", "server/ecosystem.config.js"]