import { Client } from '../pg/postgres';
import template from './template';
import htmlEscape from './htmlEscape';

interface Env {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT?: number;
  DB_DATABASE?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    // get IP-based location
    const { latitude, longitude } = request.cf;

    // create DB client
    const client = new Client({
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      hostname: env.DB_HOST,
      port: env.DB_PORT ?? 5432,
      database: env.DB_DATABASE ?? 'main',
    });

    // connect to and query DB
    await client.connect();
    const result = await client.queryObject`
      select 
        id_no, name_en, category,
        st_setsrid(st_makepoint(${longitude}, ${latitude}), 4326)::geography <-> location as distance
      from whc_sites_2021
      order by distance limit 10
    `;
    ctx.waitUntil(client.end());

    // generate markup
    const location = `${request.cf.city}, ${request.cf.country} (latitude ${latitude}, longitude ${longitude})`;
    const body = result.rows.map(row => `
      <li><a href="https://whc.unesco.org/en/list/${row.id_no}/" 
             style="background-image: url(https://whc.unesco.org/uploads/sites/gallery/google/site_${row.id_no}.jpg)">
        <span class="name">${htmlEscape(row.name_en)}</span>
        <span class="category">${htmlEscape(row.category)}</span>
        <span class="distance">${Math.round(row.distance / 1000)} km</span>
      </a></li>`).join('');

    // send page to user
    return new Response(template({ body, location }), { headers: { 'Content-Type': 'text/html; charset=utf-8', } });
  },
};
