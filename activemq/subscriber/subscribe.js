import Stompit from "stompit"

const { ACTIVEMQ_HOST: host, ACTIVEMQ_USERNAME: username, ACTIVEMQ_PASSWORD: password } = process.env
const connectParams = {
  host,
  port: 61613,
  connectHeaders: {
    host,
    login: username,
    passcode: password
  }
}

Stompit.connect(connectParams, function (error, client) {
  if (error) {
    console.error(`Unable to connect: ${error.message}`)
    return
  }

  const subscribeHeaders = {
    destination: "/queue/car1234",
    ack: "client-individual"
  }
  
  client.subscribe(subscribeHeaders, function(error, message) {
    if (error) {
      console.log("subscribe error " + error.message)
      return
    }
    
    message.readString("utf-8", function(error, body) {
      if (error) {
        console.log("read message error " + error.message)
        return
      }
      console.log("received message: " + body)
      
      client.ack(message)
    })
  })
})