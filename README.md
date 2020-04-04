# TipHiveJS

Convert TipHiveAPP to javascript

### Notes:

Add `.env` file with following keys, modify them to suite the environment:

```
NODE_ENV=development
APP_ENV=development
REDUX_DEVTOOLS=true

APP_DOMAIN=friyayapp.localhost
APP_HOST=friyayapp.localhost
API_URL=http://api.tiphive.dev/v2

SUPPORT_URL=http://support.tiphive.dev
WELCOME_TOPIC_ID=1-welcome-hive
IDEAS_TOPIC_ID=2-hive-ideas

FILESTACK_API_KEY=

DROPBOX_API_KEY=
DROPBOX_SECRET_KEY=
DROPBOX_APP_AUTHORIZATION_URI=https://www.dropbox.com/1/oauth2/authorize
DROPBOX_APP_ACCESS_TOKEN_URI=https://api.dropboxapi.com/1/oauth2/token

GOOGLE_APP_KEY=
GOOGLE_APP_SECRET=
GOOGLE_APP_AUTHORIZATION_URI=https://accounts.google.com/o/oauth2/v2/auth
GOOGLE_APP_ACCESS_TOKEN_URI=https://www.googleapis.com/oauth2/v4/token

RECAPTCHA_SITE=
RECAPTCHA_SECRET=

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
```

#### Create a staging user

- Go to https://staging.tiphive.com
- Create a new user (**Note: you won't get an email**).

#### Changes you'll need to make

- You'll need to ask for the keys from an existing Friyay developer.
- You may have to add a `/etc/hosts` entry for `friyayapp.localhost`
- If you do not have a local version of our API running
  - you'll need to change `API_URL=https://stagingapi.tiphive.com/v2` in `.env`

#### Update your `/etc/hosts` file

- Add an entry for `127.0.0.1 friyayapp.localhost`
- Also, for each new Workspace you create, you'll need an entry: `127.0.0.1 <workspace name>.friyayapp.localhost`
  - For instance, if you create a Workspace called "uber", the entry would be `127.0.0.1 uber.friyayapp.localhost`
- These changes will allow you to access friyay app at http://friyayapp.localhost:5000 or http://uber.friyayapp.localhost:5000

Run `npm install` to install dependency modules.

Run `npm run build` to build development source and watch for changes.

And run `npm start` in another tab to start app server at port 5000 and goto http://friyayapp.localhost:5000

---

### FUTURE UPDATES - these are not needed at this time

#### Virtualbox

- Install Virtualbox: https://www.virtualbox.org/

#### Vagrant

- Install vagrant: https://www.vagrantup.com/docs/installation/
