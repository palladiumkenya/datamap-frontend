# Build Stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./

RUN npm config set registry http://registry.npmjs.org/
RUN npm config get proxy
RUN npm config rm proxy
RUN npm config rm https-proxy

RUN rm -rf node_modules
RUN npm install --legacy-peer-deps
RUN npm install --save-dev ajv@^7  --legacy-peer-deps
#RUN npm install ajv ajv-keywords

COPY . .
RUN npm run build
 
# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
