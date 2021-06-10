import {GraphQLDate} from 'graphql-iso-date'
import {Mutation} from './Mutation'
import { Query } from './Query';

export const resolvers = {
  Query,
  Mutation,
  Date:GraphQLDate
};
