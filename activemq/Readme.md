# [ActiveMQ](https://activemq.apache.org/)

An open-source, multi-protocol, embeddable, high performance asynchronous messaging system
from the [Apache Foundation](https://apache.org/).

ActiveMQ comes in two varieties - **classic** and **Artemis**. This project uses the latter.

ActiveMQ runs as a standalone message broker with its own ultra high performance persistence
layer. This storage is used for messages, logs and other system files. Messages can be sent
to and retrieved from this server over common messaging protocols such as AMQP, MQTT, STOMP,
OpenWire etc.

Scheduled delivery of message is a contentious subject for message brokers/queues and is
either outright impossible (such as in Kafka) or requires expensive workarounds (as in
RabbitMQ). Where there is controversy, there is Java ecosystem, and ActiveMQ does not
disappoint. It natively support exactly what we need - **scheduled delivery of messages**.

## Scheduled Delivery

Typically, a message broker immediately delivers received events/messages to subscribers.
Scheduled delivery allows a message publisher to delay this until a specified time in the
future.

To achieve this in ActiveMQ, set `_AMQ_SCHED_DELIVERY` message property to a positive `long`
corresponding to the desired delivery time in Unix epoch milliseconds.

```java
// Encode some stringified JSON into a message
TextMessage message = session.createTextMessage("{...}");
// Delay message delivery by 5 seconds
message.setLongProperty("_AMQ_SCHED_DELIVERY", System.currentTimeMillis() + 5000)
```

## Demo

```shell
# Run ActiveMQ broker in the background
docker compose up broker -d

# When that's up and running, run pub/sub simulators
docker compose up publisher subscriber
```

The `publisher` script sends a few events completely out of order to the message broker. `subscriber`
latches on to the message queue and prints messages as they are received. You'll find that they arrive
in order and at the right time.
