import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'

// const token = TOKEN
const cache = new InMemoryCache()
const httpLink = new HttpLink({
  uri: 'https://todolistapp.hasura.app/v1/graphql',
})

let setHeaders = ''
const authLink = setContext((_, { headers }) => {
  setHeaders = headers
  return {
    headers: {
      'X-Hasura-Role': 'admin',
      ...setHeaders,
      //   Authorization: `Bearer ${token}`,
    },
  }
})

const wsLink = new WebSocketLink({
  uri: 'wss://todolistapp.hasura.app/v1/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'X-Hasura-Role': 'admin',
        ...setHeaders,
        // Authorization: `Bearer ${token}`,
      },
    },
  },
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
})

export default client
