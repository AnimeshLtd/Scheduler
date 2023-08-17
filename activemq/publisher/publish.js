import Stompit from "stompit"

const logbook = [
  {
    timestamp: "16 Aug 2023 20:32:10 GMT",
    message: "Third"
  },
  {
    timestamp: "16 Aug 2023 20:32:05 GMT",
    message: "Second"
  },
  {
    timestamp: "16 Aug 2023 20:32:15 GMT",
    message: "Fourth"
  },
  {
    timestamp: "16 Aug 2023 20:32:00 GMT",
    message: "First"
  }
]

let oldestEntry = logbook[0]
for (let entry of logbook) {
  // Valid date strings when sorted alphabetically match their chronological order
  // Sorting a list of string alphabetically then will also give us oldest data
  if (oldestEntry.timestamp > entry.timestamp) {
    oldestEntry = entry
  }
}

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

  logbook.forEach(entry => {
    // Events with dates in the past (negative value for sendAfterMilliseconds) will be
    // published immediately all at once.
    // Let's shift "now" (t = 0) to the time of oldestEntry instead
    // That way all sendAfter values will be 0 or more, giving us replayability and
    // preserving the interval between past events.
    const sendAfterMilliseconds = Date.parse(entry.timestamp) - Date.parse(oldestEntry.timestamp)
    const sendParams = {
      AMQ_SCHEDULED_DELAY: sendAfterMilliseconds,
      destination: "/queue/car1234", // unique for each car (or test run); used by subscriber
      "content-type": "application/json"
    }
  
    const frame = client.send(sendParams);
    frame.end(JSON.stringify(entry))
    console.log(`Message sent: ${entry.message}`)
  })

  client.disconnect(function (error) {
    if (error) {
      console.error(`Error while disconnecting: ${error.message}`)
      return
    }
  })
})