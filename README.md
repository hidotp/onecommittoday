# onecommit.today

[onecommit.today](https://onecommit.today)

## Deployment

  * Build frontend with `VUE_APP_API_URL=https://api.example.test`
  * Build backend
    * Set `DB_URI` to mysql connection string
    * Set `SESSION_SECRET` to random string
    * Create a GitHub OAuth application and set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
    * Set `GITHUB_HOST_URL` to the callback host
    * Set `FRONTEND_URL` to the redirect target
