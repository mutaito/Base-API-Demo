FROM node:12

COPY ["package.json","package-lock.json", "/app/"]

WORKDIR /app

# COPY package*json ./

RUN npm install

# COPY . .
#COPY [".", "app"]
COPY . /app

#EXPOSE 3001

CMD ["npx","nodemon", "index.js"]