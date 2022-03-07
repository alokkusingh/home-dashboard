FROOM arm64v8/node as builder

WORKDIR /app
COPY package.json .

RUN npm install
COPY . .
RUN npm build

FROM arm64v8/nginx:1.19.2-alpine
COPY --from=builder /app/build /usr/share/nginx/html