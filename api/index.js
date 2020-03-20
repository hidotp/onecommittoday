const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const Router = require('koa-router');
const Knex = require('knex');
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

const PORT = parseInt(process.env.PORT || '') || 3001;
const DB_URI = process.env.DB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (process.env.NODE_ENV == 'production' && DB_URI == undefined) {
  throw new Error('DB_URI must be set with production NODE_ENV');
}
if (SESSION_SECRET == undefined) {
  throw new Error('SESSION_SECRET must be set');
}

const app = new Koa();
const router = new Router();
const knex = Knex(process.env.NODE_ENV == 'production' ? DB_URI : {
  connection: { filename: ':memory:' },
  client: 'sqlite3',
  useNullAsDefault: true,
});

passport.use(new LocalStrategy((username, password, done) => {
  if (username == 'doesnotexist') {
    return done(null, false);
  }
  if (username == 'error') {
    return done('error');
  }
  return done(null, username);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((name, done) => {
  done(null, name);
});

app.keys = [SESSION_SECRET];
app.use(session({}, app));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: '*' }));

router.post('/login', passport.authenticate('local'), async ctx => {
  ctx.body = '';
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
    });
  }

  ctx.body = '';
});

router.get('/feed', async ctx => {
  const { limit = 10, offset = 0 } = ctx.query;
  const users = await knex('users')
    .select('name', 'story', 'kudos')
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
    });

    await knex('users').insert([
      { name: 'tester1', story: 'I develop a Corona Virus dashboard', kudos: 1 },
      { name: 'ExampleUser', story: 'I lost my job.', kudos: 0 },
      { name: 'Tester', story: 'Since I can\'t go out, I spend my free time contributing to open source projects', kudos: 123 },
      { name: 'Citizen', story: 'I am afraid of the future', kudos: 2 },
      ...(Array.from(Array(20)).map((_, n) =>
        ({ name: 'dummy' + n, story: 'Aut esse voluptates esse. Adipisci aut eos est consectetur voluptatem qui.', kudos: Math.floor(Math.random() * 100) })
      ))
    ])
  }

  app.listen(PORT || 3001, () => console.log(`Server running on http://localhost:${PORT}/`));
}

startup().catch(console.error);
