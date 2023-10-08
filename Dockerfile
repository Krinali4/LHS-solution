FROM node:16.15.1 as base

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --legacy-peer-deps

COPY . ./

RUN npm run build --prod

FROM nginx:latest as final

COPY --from=base /app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"] 