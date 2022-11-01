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

const regions: Array<Env> = [
  // ...fill for development
];

interface Timings {
  startedAt: number;
  finishedAt: number;
}

interface QueryResult {
  result: any;
  connection?: Timings;
  query?: Timings;
  cache?: Timings;
};

async function queryDatabase(latitude, longitude, env: Env, ctx: ExecutionContext, useCache: boolean): Promise<QueryResult> {
  let startedAt = Date.now();

  const cacheKey = `https://${env.DB_HOST}/whs-${latitude}-${longitude}`;
  const cache = caches.default;

  if (useCache) {
    const cacheResp = await cache.match(cacheKey);
    if (cacheResp) {
      const result = await cacheResp.json();

      return {
        result,
        cache: {
          startedAt,
          finishedAt: Date.now(),
        },
      };
    }
  }

  const cacheTimings = useCache ? {
    startedAt,
    finishedAt: Date.now(),
  } : undefined;

  startedAt = Date.now();

  // create DB client
  const client = new Client({
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    hostname: env.DB_HOST,
    port: env.DB_PORT ?? 5432,
    database: env.DB_DATABASE ?? 'main',
  });

  // connect to DB
  await client.connect();

  const connectionTimings = {
    startedAt,
    finishedAt: Date.now(),
  };

  startedAt = Date.now();

  // run query
  const result = await client.queryObject`
    select 
      id_no, name_en, category,
      st_setsrid(st_makepoint(${longitude}, ${latitude}), 4326)::geography <-> location as distance
    from whc_sites_2021
    order by distance limit 10
  `;

  const queryTimings = {
    startedAt,
    finishedAt: Date.now(),
  };

  // put the result in the cache
  await cache.put(cacheKey, new Response(JSON.stringify(result), {
    headers: {
      'content-type': 'application/json',
    },
  }));

  // destroy DB connection, we don't need it anymore
  ctx.waitUntil(client.end());

  return {
    result,
    connection: connectionTimings,
    query: queryTimings,
    cache: cacheTimings,
  };
}

let globalRequestCount = 0;

export default {
  async fetch(request: Request, cfEnv: Env, ctx: ExecutionContext): Promise<Response> {
    const { searchParams } = new URL(request.url)
    const nocache = !!searchParams.get('nocache');

    let region = parseInt(searchParams.get('region')) || 0;
    if (region < 0 || region >= regions.length) {
      region = 0;
    }

    // use env from the code, if available
    const env = (regions.length == 0 ? cfEnv : regions[region]);

    // get IP-based location
    const latitude = request.cf.latitude ?? 37.818496;
    const longitude = request.cf.longitude ?? -122.473831;
    const city = request.cf.city ?? 'Unknown location (assuming San Francisco)';
    const country = request.cf.country ?? 'Earth';

    const { result, cache, connection, query } = await queryDatabase(latitude, longitude, env, ctx, !nocache);

    // generate markup
    const location = `${city}, ${country} (latitude ${latitude}, longitude ${longitude})`;
    const body = result.rows.map(row => `
      <li><a href="https://whc.unesco.org/en/list/${row.id_no}/" 
             style="background-image: url(https://whc.unesco.org/uploads/sites/gallery/google/site_${row.id_no}.jpg)">
        <span class="name">${htmlEscape(row.name_en)}</span>
        <span class="category">${htmlEscape(row.category)}</span>
        <span class="distance">${Math.round(row.distance / 1000)} km</span>
      </a></li>`).join('');

    const stats = {
      cache,
      connection,
      query,
      globalRequestCount,
      dbHostname: env.DB_HOST,
    };

    globalRequestCount++;
    
    // send page to user
    return new Response(template({ body, location, stats }), { headers: { 'Content-Type': 'text/html; charset=utf-8', } });
  },
};
