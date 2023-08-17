# Scheduler

## Requirement

- I want to schedule some tasks to take place at a later time.
- There is no periodicity in invocation.
- Intervals between two consecutive invocations will vary and are not known beforehand.

## Task

Given a list of tasks - each with a timestamp at which they need to be executed - write
a scheduler which can carry out execution as specified.

## Solutions

1. [ActiveMQ](activemq/Readme.md): DIY solution using ActiveMQ scheduled delivery feature
2. Google Cloud Tasks: Out-of-the-box solution for GCP users

## Google Cloud

Use Cloud Tasks with Cloud Functions to create a fully managed solution.

Cloud Tasks provides a queue for storing tasks (API calls) which can be triggered at a pre-defined
time (set dynamically during createTask API call). *"Make this API call at 2pm on 20th July 2023"*

Cloud Functions are Lambdas in GCP.

```text

Scheduler ---> Cloud Tasks --> Task Handler

Scheduler lambda
  - parse a logfile to create an array of log entries
  - create a Cloud Task for each log entry (to call a lambda or telemetry webhook)

Cloud Tasks (Google managed, nothing to do)

Task Handler lambda (not needed if using telemetry webhook in Cloud Task definition)
  - Triggered by Cloud Tasks with log entry payload
  - Call telemetry webhook used by car
  - Or do whatever else you'd like to here
```

Here are some tutorials:

- https://cloud.google.com/tasks/docs/dual-overview?hl=en
- https://cloud.google.com/tasks/docs/tutorial-gcf?hl=en
- https://cloud.google.com/tasks/docs/creating-http-target-tasks?hl=en
- The `scheduleTime` [property of a Cloud Task](https://cloud.google.com/tasks/docs/reference/rest/v2/projects.locations.queues.tasks?hl=en#Task.FIELDS.schedule_time) is the secret sauce
