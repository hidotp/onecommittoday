const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const Router = require('koa-router');
const Knex = require('knex');
const passport = require('koa-passport');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const cron = require('node-cron');

const PORT = parseInt(process.env.PORT || '') || 3001;
const DB_URI = process.env.DB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const PUBLIC_HOST = process.env.PUBLIC_HOST || ('localhost:' + PORT);

if (process.env.NODE_ENV == 'production' && DB_URI == undefined) {
  throw new Error('DB_URI must be set with production NODE_ENV');
}
if (SESSION_SECRET == undefined) {
  throw new Error('SESSION_SECRET must be set');
}
if (GITHUB_CLIENT_ID == undefined) {
  throw new Error('GITHUB_CLIENT_ID must be set');
}
if (GITHUB_CLIENT_SECRET == undefined) {
  throw new Error('GITHUB_CLIENT_SECRET must be set');
}

const app = new Koa();
const router = new Router();
const knex = Knex(process.env.NODE_ENV == 'production' ? DB_URI : {
  connection: { filename: ':memory:' },
  client: 'sqlite3',
  useNullAsDefault: true,
});

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://github.com/login/oauth/authorize',
  tokenURL: 'https://github.com/login/oauth/access_token',
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  userProfileURL: 'https://github.com/api/v3/user',
  callbackURL: 'http://' + PUBLIC_HOST + '/auth/github/callback',
}, (acccessToken, refreshToken, profile, done) => {
  done(null, profile);
  // knex('users') ...
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.keys = [SESSION_SECRET];
app.use(session({}, app));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: '*' }));

async function fetchGithubActivity(username, from, to) {
  const url = `https://github.com/${username}?tab=overview&from=${from}&to=${to}`;
  const data = await fetch(url);
  const $ = cheerio.load(await data.text());
  const $days = $('rect.day');

  return $days.get().reduce((o, day) => {
    const $day = $(day);
    const date = $day.attr('data-date');
    const count = parseInt($day.attr('data-count'), 10);
    return { ...o, [date]: count };
  }, {});
}

async function fetchStreak(username) {
  const from = '2020-03-11'; // the WHO officially declares the coronavirus outbreak to be a pandemic
  const to = new Date().toISOString().substring(0, 10);
  const activity = await fetchGithubActivity(username, from, to);
  // response is sorted
  const { streak } = [...Object.entries(activity)]
    .filter(([date, commits]) => date >= from && date <= to)
    .map(([date, commits]) => commits)
    .reverse()
    // streak = count consecutive commits backwards from today
    // do not break streak if no commit for today yet (index == 0)
    .reduce(({ streak, end }, commits, index) => commits == 0 || end ? { streak, end: index > 0 } : { streak: streak + 1, end },
      { streak: 0, end: false });
  return streak;
}

async function updateUserStreaks() {
  const names = await knex('users').select('name');
  console.log('updating streaks for ' + names.length + ' users');
  await Promise.all(names.map(async ({ name }) =>
    knex('users').update('streak', await fetchStreak(name)).where('name', name)
  ));
}

router.get('/auth/github', passport.authenticate('oauth2'));

router.get('/auth/github/callback', passport.authenticate('oauth2'), async ctx => {
  ctx.redirect('/'); // TODO
});

router.post('/logout', async ctx => ctx.logout());

router.post('/:user/kudos', async ctx => {
  const name = ctx.params.user;
  await knex('users')
    .where('name', name)
    .increment('kudos', 1);
  const [{ kudos }] = await knex('users')
    .select('kudos')
    .where('name', name);
  ctx.body = kudos;
});

router.post('/story', async ctx => {
  if (ctx.isUnauthenticated()) {
    return ctx.throw(403);
  }

  if (!('story' in ctx.request.body)) {
    return ctx.throw(400);
  }

  const story = ctx.request.body.story;
  const name = ctx.state.user;

  const count = await knex('users')
    .count('name', {as: 'count'})
    .where('name', name)
    .then(result => result[0].count);

  if (count) {
    await knex('users').update({ story });
  } else {
    await knex('users').insert({
      name,
      story,
      kudos: 0,
      streak: 0,
    });
  }

  ctx.body = '';
});

router.get('/feed', async ctx => {
  const { limit = 10, offset = 0 } = ctx.query;
  const users = await knex('users')
    .select('name', 'story', 'kudos', 'streak')
    .limit(Math.min(100, limit))
    .offset(offset);
  ctx.body = users;
});

app.use(router.routes());
app.use(router.allowedMethods());

async function startup() {
  if (!await knex.schema.hasTable('users')) {
    await knex.schema.createTable('users', (table) => {
      table.string('name').notNullable().primary();
      table.text('story').notNullable();
      table.bigInteger('kudos').notNullable();
      table.integer('streak').unsigned().notNullable();
    });

    await knex('users').insert([
      // names are from https://gist.github.com/paulmillr/2657075
      { name: 'andrew', story: 'I develop a Corona Virus dashboard', kudos: 1, streak: 1 },
      { name: 'taylorotwell', story: 'I lost my job.', kudos: 0, streak: 5 },
      { name: 'egoist', story: 'Since I can\'t go out, I spend my free time contributing to open source projects', kudos: 123, streak: 10 },
      { name: 'ornicar', story: 'I am afraid of the future', kudos: 2, streak: 3 },
      /*
      ...(Array.from(Array(20)).map((_, n) =>
        ({
          name: 'test' + n,
          story: 'Aut esse voluptates esse. Adipisci aut eos est consectetur voluptatem qui.',
          kudos: Math.floor(Math.random() * 100),
          streak: Math.floor(Math.random() * 30)
        })
      ))
      */
    ])
  }

  await updateUserStreaks();
  cron.schedule('0 * * * *', updateUserStreaks); // every hour
  app.listen(PORT || 3001, () => console.log(`Server running on http://localhost:${PORT}/`));
}

startup().catch(console.error);
