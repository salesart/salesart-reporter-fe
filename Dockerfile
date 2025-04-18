FROM node:lts-slim AS build
WORKDIR /src
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm ci

COPY . ./
RUN ng build --configuration=production

FROM nginx:stable AS final
EXPOSE 80

COPY --from=build /src/node_modules/@ckeditor /usr/share/nginx/html/assets/ckeditor
COPY --from=build src/dist/salesart-reporter-web/browser /usr/share/nginx/html
