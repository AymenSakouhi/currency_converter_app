FROM node:14
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install
CMD ["npm", "run", "start"]
#In case you want to check each build on its own:
#docker build -f Dockerfile -t server .
#docker run -it -p 8000:8000 server