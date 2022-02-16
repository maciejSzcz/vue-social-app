# How to run

Clone this repo :arrow_down:

```shell script
git@github.com:maciejSzcz/vue-social-app.git
```

## Server:

In server directory of the project, create `.env` file with specified environmental variables ([see below](#env-vars-server)) :page_facing_up:

In server directory

```shell script
npm start
```

<a name="env-vars-server"></a>

### Environmental variables

| Name         |      Required      |             Description              |
| ------------ | :----------------: | :----------------------------------: |
| `JWT_SECRET` | :heavy_check_mark: |  Secret used for signing jwt tokens  |
| `MONGO_URI`  | :heavy_check_mark: | Mongo database uri connection string |
| `PORT`       |        :x:         |   Default port for the app to run    |

## Client:

In client directory of the project, create `.env` file with specified environmental variables ([see below](#env-vars)) :page_facing_up:

In client directory Install dependencies using npm :package:

```shell script
npm install
```

Run the project :rocket:

```shell script
npm run serve
```

<a name="env-vars"></a>

### Environmental variables

| Name                   |      Required      | Description                     |
| ---------------------- | :----------------: | ------------------------------- |
| `VUE_APP_BACKEND_PATH` | :heavy_check_mark: | Base path for all http requests |
| `VUE_APP_SOCKET_URL`   | :heavy_check_mark: | Base path for all ws requests   |

### Environmental variables for local dev (.env.development)

| Name                   |      Required      | Description                       |
| ---------------------- | :----------------: | --------------------------------- |
| `VUE_APP_BACKEND_PATH` | :heavy_check_mark: | Path for devserver proxy requests |
| `VUE_APP_BACKEND_URL`  | :heavy_check_mark: | Backend url for devserver proxy   |
