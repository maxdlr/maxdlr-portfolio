FROM node:20-slim AS build
WORKDIR /usr/local/app
COPY . /usr/local/app/
# RUN npm install -g yarn 
RUN yarn install --immutable --no-cache
RUN yarn build

FROM nginx:latest
RUN apt update && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

COPY --from=build /usr/local/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 8080
CMD ["nginx", "-g", "daemon off;"]

