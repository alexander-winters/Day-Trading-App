FROM node:latest

WORKDIR /client

COPY package.json .

RUN npm i

COPY . .

RUN npm run build

# Expose the port mentioned in vite.config
EXPOSE 5173

CMD ["npm", "run", "dev"]