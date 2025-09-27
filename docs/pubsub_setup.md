# Google Cloud Pub/Sub Setup Guide

This document summarizes the steps required to configure the Google Cloud CLI, authenticate,
and install the Pub/Sub client library before creating resources via Python. These commands
were not executed in this environment because they require interactive authentication.

## 1. Install the Google Cloud CLI

```bash
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-458.0.1-linux-x86_64.tar.gz
tar -xf google-cloud-cli-458.0.1-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh
```

After installation, ensure the `gcloud` binary is on your `PATH` by sourcing the initialization script:

```bash
source ~/google-cloud-sdk/path.bash.inc
```

## 2. Initialize the CLI

Authenticate and select the desired project:

```bash
gcloud init
```

Follow the prompts in your browser to sign in and choose the active project.

## 3. Configure Application Default Credentials

```bash
gcloud auth application-default login
```

This command opens a browser to complete the OAuth flow. When it finishes, Application Default Credentials
are stored in `~/.config/gcloud/application_default_credentials.json`.

## 4. Install the Pub/Sub Client Library for Python

```bash
python -m pip install --upgrade google-cloud-pubsub
```

## 5. Use the Library to Create Pub/Sub Resources

See [pubsub_create_resources.py](./pubsub_create_resources.py) for a complete example that creates a topic
and subscription using the authenticated credentials.
