# Capstone Project - Multiplayer webpage game
## Author: E Zhang
#### Requirements 
- NodeJS with NPM installed.
- socket.IO.
- Express.

#### Dependencies installion
Run the following command to download all the dependencies:

```
npm install
```

#### Running the Server
Then run the server with the following command:

```
npm start
```

You can access the game at `http://localhost:3000` The default port is `3000`, however this can be changed in **config.json** file

#### Project Design 
For detail project design, check word design doc

#### File intro 
* client & server source code located in **src/** folder 
* **gulpfile.js** has all the project build function code
* **webpack.ks** will be needed for gulp building mission
* **config.json** is one of the souce code that is needed in server.js