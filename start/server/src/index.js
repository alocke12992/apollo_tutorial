const { ApolloServer } = require('apollo-server');
const { createStore } = require('./utils');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) return { user: null };    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;

    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  engine: {
    apiKey: "service:alocke12992-tutorialGraph:izie1tD5oG8DAVVWHVfxCQ"
  },
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({ store })  
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});