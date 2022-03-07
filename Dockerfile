FROM arm64v8/node as builder

WORKDIR /app
COPY package.json .

RUN npm install
COPY . .
RUN npm run build

FROM arm64v8/nginx:1.19.2-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf