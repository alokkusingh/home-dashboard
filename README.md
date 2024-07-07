# Home Dashboard 

Home dashboard

## Available Scripts

### Start App Locally
```shell
npm start
```

### Launch Test Nunner
```shell
npm test
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Build app for production
```shell
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
App is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
### Protobuf
#### Install pbf Globally to generate .js from .proto
```shell
npm install -g pbf
```
#### Install pbf locally to be used as dependent lib
```shell
npm install pbf --save
```
#### Generate JS from PROTO
```shell
pbf src/proto/getInvestmentsResponse.proto  >src/proto/getInvestmentsResponse.js
pbf src/proto/getInvestmentsRorMetricsResponse.proto  >src/proto/getInvestmentsRorMetricsResponse.js
pbf src/proto/getRawInvestmentsResponse.proto  >src/proto/getRawInvestmentsResponse.js
```
### Docker Build and Deploy
1. Build
```shell
docker build -t alokkusingh/home-dashboard:latest -t alokkusingh/home-dashboard:1.4.0 .
```
2. Push
```shell
docker push alokkusingh/home-dashboard:latest
```
```shell
docker push alokkusingh/home-dashboard:1.4.0
```
2. Deploy
```shell
docker run -d -p 8083:80 --rm --name home-dashboard alokkusingh/home-dashboard
```
## Open Distributed Tracing with Jaeger
1. Compiled and included ngx_http_opentracing_module
2. Enabled Jaeger header propagation
3. Enabled connection to Jaeger agent

## Sequence Diagram
```mermaid
sequenceDiagram
  participant web as Home Dashboard
  participant idp as Google IdP
  participant authorizer as Authorizer Service
  participant homeapi as Home API Service
  participant homeetl as Home ETL Service
  participant db as MySQL
  participant sheet as Google Sheet
  participant backup as Github
  web->>idp: Get ID Token for Home Service?
  alt login success
    idp->>web: ID Token (including email)
    web->>authorizer: Validate ID Token
    authorizer->>authorizer: Validate Token Integrity
    authorizer->>authorizer: Validate Email
    alt user authorized
      authorizer->>web:User ID and Email
      web->>homeapi:Get Metrics
      alt has access to API
        homeapi->>db:Get Records
        db->>homeapi:Records
        homeapi->>homeapi:Aggregate Metrics
        homeapi->>web:Metrics
      else dont have access to API
        homeapi->>web:Unauthorized Access
      end
      web->>homeetl:Upload Statement
      alt has access to API
        homeetl->>homeetl:Parse File
        homeetl->>db:Add Records
        homeetl->>web:Success
      else dont have access to API
        homeetl->>web:Unauthorized Access
      end
      web->>homeetl:Refresh data
      alt has access to API
        homeetl->>sheet:Get Sheet Records
        sheet->>homeetl:Records
        homeetl->>db:Delete Records
        homeetl->>db:Add Records
        homeetl->>web:Success
      else dont have access to API
        homeetl->>web:Unauthorized Access
      end
    else user not authorized
      authorizer->>web:User Not Authorized 
    end
  else login failed
    idp->>web: Login failed
  end
```