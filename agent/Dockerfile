FROM node:12-alpine
WORKDIR /app/agent
RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*
COPY ./agent/package.json /app/agent/
COPY ./agent/package-lock.json /app/agent/
COPY ./agent/tsconfig.json /app/agent/
COPY ./agent/src /app/agent/src
COPY './@types' '/app/@types'
RUN npm install
RUN npm run build
EXPOSE 8080
ENTRYPOINT ["node", "./dist/index.js"]
