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
  await knex('users')
    .where('name', ctx.state.user)
    .increment('kudos', 1);
  ctx.body = '';
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
    .limit(Math.max(100, limit))
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
  }

  app.listen(PORT || 3001, () => console.log(`Server running on http://localhost:${PORT}/`));
}

startup().catch(console.error);
