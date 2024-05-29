import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import gql from 'graphql-tag';
import fs from 'fs';

const Data = [
  {
    id: 1,
    title: 'Title 1',
  },
  {
    id: 2,
    title: 'Title 2',
  },
];

const typeDefs = gql(fs.readFileSync('./schema.graphql').toString());

function resolveUnionField(data) {
  return {
    __typename: data.id === 1 ? 'SubType1' : 'SubType2'
  }
}

const resolvers = {
  Query: {
    data: () => Data,
  },
  Data: {
    unionField: resolveUnionField,
    unionFieldCached: resolveUnionField,
  },
  SubType1: {
    id: () => 1,
    isFlagged: () => true
  },
  SubType2: {
    id: () => 2,
    isFlagged: () => false
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginCacheControl({ calculateHttpHeaders: true }),
  ],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.NODE_PORT || 4001 },
});

console.log(`🚀 ready at: ${url}`);


