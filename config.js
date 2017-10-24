module.exports = {
  dbUrl: "mongodb://razrlab:gameofthrones@ds060009.mlab.com:60009/communicationdb",
  // dbUrl: "mongodb://razrlab:gameofthrones@ds143542.mlab.com:43542/razrgen",
  listener: {
    ip: function () {
      // return '10.0.1.99'
    },
    //ports
    ports: {
      web: "80",
      falcom: "6101",
      falcomJSON: "6201",
      shadow: "3102",
      shadowSBD: "3001",
      maestro: "8100",
      http:"8081"
    },
    //load balancer
    loadbalancer: {
      sourcePort: 6101,
      targets: [
        {
          host: "127.0.0.1",
          port: 3000
        }
      ]
    }
  },
  distribution: {
    com: {
      ip: '127.0.0.1',
      port: 4100
    }
  }
};
