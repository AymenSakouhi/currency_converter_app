FROM node:14
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install
CMD ["npm", "run", "start"]
#In case you want to check each build on its own:
# docker build -f Dockerfile -t client .
# docker run -it -p 3000:3000 client