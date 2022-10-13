
To get the UNESCO data, download the `.xls` World Heritage List from https://whc.unesco.org/en/syndication/, open it in Excel, and save it as a CSV file inside the `data` folder.
 
Then, to import the data to Neon:

```bash
curl https://letsencrypt.org/certs/isrgrootx1.pem > /tmp/isrgrootx1.pem
psql 'postgres://username@adjective-noun-123.cloud.neon.tech:5432/main?sslmode=verify-full&sslrootcert=/tmp/isrgrootx1.pem' < data/import.psql
```

To set up and run:

* `npm install`
* Update the `DB_USER` and `DB_HOST` in `wrangler.toml`.
* Run `npx wrangler secret put DB_PASSWORD` and enter your Neon database password, for deployment time.
* Create `.dev.vars` containing `DB_PASSWORD=myneonpassword`, to support running locally.
* `npx wrangler dev` or `npx wrangler dev --local` to run locally.
* `npx wrangler publish` to deploy.

