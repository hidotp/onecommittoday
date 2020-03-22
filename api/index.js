const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const Router = require('koa-router');
const Knex = require('knex');
const passport = require('koa-passport');
const fetch = require('node-fetch');
const cron = require('node-cron');
const OAuth2Strategy = require('passport-oauth2');

const PORT = parseInt(process.env.PORT || '') || 3001;
const DB_URI = process.env.DB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const PUBLIC_HOST = process.env.PUBLIC_HOST || ('localhost:' + PORT);
const URL_LOGIN_SUCCESS = process.env.URL_LOGIN_SUCCESS || 'http://localhost:8080';
const URL_LOGIN_FAILURE = process.env.URL_LOGIN_FAILURE || 'http://localhost:8080';

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
  callbackURL: 'http://' + PUBLIC_HOST + '/auth/github/callback',
  scope: '', // grant read-only access to public information
}, async (accessToken, unusedRefreshToken, unusedProfile, done) => {
  const profileData = await getProfileData(accessToken);

  const count = await knex('users')
    .count('name', {as: 'count'})
    .where('name', profileData.name) // TODO identify by id, not by name
    .then(result => result[0].count);

  const user = {
    ...profileData,
    access_token: accessToken,
    story: '',
    kudos: 0,
  };

  if (count == 0) {
    await knex('users').insert(user);
    console.log('registered ' + profileData.name);
  } else {
    // store new access token
    await knex('users').update(user).where('name', profileData.name);
    console.log('updated ' + profileData.name);
  }

  // put name into ctx.state.user
  done(null, profileData.name);
}));

// serialize ctx.state.user <-> cookie
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

async function getProfileData(accessToken) {
  const outbreak = '2020-03-11T00:00:00Z'; // the WHO officially declares the coronavirus outbreak to be a pandemic
  const now = new Date().toISOString();
  const query = `
    query {
      viewer {
        login
        avatarUrl
        contributionsCollection(from: "${outbreak}", to: "${now}") {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  const { data } = await response.json();

  // data.viewer.contributionsCollection.contributionCalendar is sorted
  const days = [].concat(...data.viewer.contributionsCollection.contributionCalendar.weeks.map(week => week.contributionDays.contributionCount));
  const { streak } = days
    .reverse()
    // streak = count consecutive commits backwards from today
    // do not break streak if no commit for today yet (index == 0)
    .reduce(({ streak, end }, commits, index) => commits == 0 || end ? { streak, end: index > 0 } : { streak: streak + 1, end },
      { streak: 0, end: false });

  return {
    name: data.viewer.login,
    avatar_url: data.viewer.avatarUrl,
    streak,
  }
}

async function updateUsers() {
  const accessTokens = await knex('users').select('access_token');
  console.log('updating streaks for ' + accessTokens.length + ' users');
  await Promise.all(accessTokens.map(async ({ access_token }) => {
    try {
      knex('users')
        .update(await getProfileData(access_token))
        .where('access_token', access_token)
    } catch (error) {
      console.error(error);
    }
  }));
}

// frontend redirects to this URL.
// redirect the user to the GitHub login screen
router.get('/auth/github', passport.authenticate('oauth2'));

// then, GitHub redirects to this URL
router.get('/auth/github/callback',
  // set a cookie
  passport.authenticate('oauth2', {
    // redirect the user back to the frontend
    successRedirect: URL_LOGIN_SUCCESS,
    failureRedirect: URL_LOGIN_FAILURE,
  }));

// clear the cookie
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
  console.log('gave a kudo to ' + name);
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

  await knex('users')
    .update({ story })
    .where('name', name);

  ctx.body = await knex('users').where('name', name);
  console.log('updated story for ' + name);
});

router.get('/feed', async ctx => {
  const { limit = 10, offset = 0 } = ctx.query;
  ctx.body = await knex('users')
    .select('name', 'story', 'kudos', 'streak','avatar_url')
    .limit(Math.min(100, limit))
    .offset(offset);
});

app.use(router.routes());
app.use(router.allowedMethods());

async function startup() {
  if (!await knex.schema.hasTable('users')) {
    await knex.schema.createTable('users', (table) => {
      table.string('name').notNullable().primary();
      table.string('avatar_url').notNullable();
      table.string('access_token').notNullable();
      table.integer('streak').unsigned().notNullable();
      table.text('story').notNullable();
      table.bigInteger('kudos').notNullable();
    });

    await knex('users').insert([
      // names are from https://gist.github.com/paulmillr/2657075
      { name: 'andrew', avatar_url: 'https://avatars3.githubusercontent.com/u/1060?s=400&u=d4790e0ec60657f07aae1a398d7171f167b8d8d0&v=4', access_token: '', story: 'I develop a Corona Virus dashboard', kudos: 1, streak: 1 },
      { name: 'taylorotwell', avatar_url: 'https://avatars3.githubusercontent.com/u/463230?s=400&u=0c486fbe3a30dadd5c5981a9fbc3a0d269ca0c33&v=4', access_token: '', story: 'I lost my job.', kudos: 0, streak: 5 },
      { name: 'egoist', avatar_url: 'https://avatars0.githubusercontent.com/u/8784712?s=400&u=13d2426fa24c97d0f3d44c0f9a5cb8315bd1909e&v=4', access_token: '', story: 'Since I can\'t go out, I spend my free time contributing to open source projects', kudos: 123, streak: 10 },
      { name: 'ornicar', avatar_url: 'https://avatars3.githubusercontent.com/u/140370?s=400&v=4', access_token: '', story: 'I am afraid of the future', kudos: 2, streak: 3 },
    ])
  }

  cron.schedule('0 * * * *', updateUsers); // every hour
  app.listen(PORT || 3001, () => console.log(`Server running on http://localhost:${PORT}/`));
}

startup().catch(console.error);
