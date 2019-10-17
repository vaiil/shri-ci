FROM node:12-alpine
WORKDIR /app/agent
COPY ./agent/package.json /app/agent/
COPY ./agent/package-lock.json /app/agent/
COPY ./agent/tsconfig.json /app/agent/
COPY ./agent/src /app/agent/src
COPY './@types' '/app/@types'
RUN npm install
RUN npm run build
EXPOSE 8080
CMD [ "node", "dist/index.js" ]