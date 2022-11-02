interface Timings {
  startedAt: number;
  finishedAt: number;
}

const fmtTimings = (timings: Timings, action: string) => {
  if (!timings) {
    return '';
  }

  const { startedAt, finishedAt } = timings;
  const duration = finishedAt - startedAt;
  return `${duration}ms to ${action}.`;
}

export default ({ body, location, stats }) => `
<!DOCTYPE html><html>
  <head>
    <title>World heritage sites</title>
    <meta name="viewport" content="initial-scale=.55">
    <style>
      body { margin: 0; padding: 2em 4em; background: #fff; font: 14px/1.25 sans-serif; }
      h1 { padding: 0 0 .33em; margin: 0 0 1em; border-bottom: 1px solid #ccc; }
      ul { margin: 0; padding: 0; }
      li { display: block; float: left; margin: 1ex; padding: 0; list-style-type: none; }
      a { text-decoration: none; color: #55e; }
      li a { display: block; width: 12em; height: 16em; padding: 0; border-radius: 1em; background-size: cover; background-color: #88e; color: #fff; }
      li a:hover .name { padding-top: 1.5em; }
      .name { display: block; font-weight: bold; padding: .9em 1em .1em; background: rgba(0, 0, 0, .4); border-top-left-radius: 1em; border-top-right-radius: 1em; transition: padding-top .2s; }
      .category { display: block; padding: .1em 1em; background: rgba(0, 0, 0, .4); }
      .distance { display: block; padding: .1em 1em .75em; background: rgba(0, 0, 0, .4); color: rgba(255, 255, 255, .75) }
      p { clear: both; padding-top: 1.5em; }
    </style>
    <link rel="icon" href="data:,"><!-- suppress favicon.ico fetching -->
  </head>
  <body>
    <h1>Your nearest world heritage sites</h1>
    <ul>${body}
    </ul>
    <p>
      Heritage site data copyright &copy; 1992 – ${new Date().getFullYear()} 
      <a href="https://whc.unesco.org">UNESCO/World Heritage Centre</a>. All rights reserved.
      Location derived from IP address: ${location}.
    </p>
    <p>
      Tech stats:
      ${fmtTimings(stats.cache, 'to access cache')}
      ${fmtTimings(stats.connection, 'to connect to database')}
      ${fmtTimings(stats.query, 'to query database')}
      This worker has served ${stats.globalRequestCount} requests.
      Database location ${stats.dbHostname}.
    </p>
  </body>
</html>
`;
