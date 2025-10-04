"""Example script that creates Google Cloud Pub/Sub resources using the Python client library.

The script assumes that the Google Cloud CLI has been installed, `gcloud init` has been run to
select a project, and Application Default Credentials are available (via
`gcloud auth application-default login`).

Replace the placeholder values in the `PROJECT_ID`, `TOPIC_ID`, and `SUBSCRIPTION_ID` constants
with identifiers that match your Google Cloud project before running the script.
"""

from google.cloud import pubsub_v1

PROJECT_ID = "your-project-id"
TOPIC_ID = "demo-topic"
SUBSCRIPTION_ID = "demo-subscription"

def main() -> None:
    """Create a topic and a pull subscription if they do not already exist."""
    publisher_client = pubsub_v1.PublisherClient()
    subscriber_client = pubsub_v1.SubscriberClient()

    topic_path = publisher_client.topic_path(PROJECT_ID, TOPIC_ID)
    subscription_path = subscriber_client.subscription_path(PROJECT_ID, SUBSCRIPTION_ID)

    try:
        publisher_client.create_topic(request={"name": topic_path})
        print(f"Created topic: {topic_path}")
    except Exception as exc:  # pylint: disable=broad-exception-caught
        print(f"Topic may already exist or creation failed: {exc}")

    try:
        subscriber_client.create_subscription(
            request={
                "name": subscription_path,
                "topic": topic_path,
            }
        )
        print(f"Created subscription: {subscription_path}")
    except Exception as exc:  # pylint: disable=broad-exception-caught
        print(f"Subscription may already exist or creation failed: {exc}")


if __name__ == "__main__":
    main()
