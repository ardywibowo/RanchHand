module.exports = {
  servers: {
    one: {
      host: 'ec2-52-14-207-27.us-east-2.compute.amazonaws.com',
      username: 'ubuntu',
      pem: "../server-key/RanchHand.pem",
      opts: {
          port: 22,
      }
    }
  },

  meteor: {
    name: 'ranch-hand',
    path: '../',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true,
    },
    env: {
      PORT: 80,
      ROOT_URL: 'http://ec2-52-14-207-27.us-east-2.compute.amazonaws.com',
      MONGO_URL: 'mongodb://localhost:27017/meteor'
    },

    dockerImage: 'abernix/meteord:base',
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    port: 27017,
    servers: {
      one: {},
    },
  },
};
