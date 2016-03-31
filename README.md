# SunShare

### Setup ###
  1. `npm install`
  2. `node server --watch`
  3. [https://localhost:9001](https://localhost:9001)

### Deployment ###
  1. Create a new AWS S3 bucket and IAM user.
  2. Give the IAM user full permissions on the bucket.
  3. Set bucket's permissions to allow everyone to list it.
  4. Set bucket's CORS policy to allow downloads from your domain (or *).
  5. Edit `app/config.json` to have the correct bucket name.
  6. Edit `keys/aws.json` to have the IAM creds like so:

```JSON
  {
    "id": "Put your AWS_ACCESS_KEY_ID here",
    "secret": "Put your AWS_SECRET_ACCESS_KEY here"
  }
```

Copyright (c) 2016 Jonathan Knapp and Charles Buhler.
