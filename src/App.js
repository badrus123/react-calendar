import React from 'react'
import { ApolloProvider } from '@apollo/client'
import Calendar from './pages/Calendar'
import client from './graphql/connector'
function App() {
  return (
    <ApolloProvider client={client}>
      <Calendar />
    </ApolloProvider>
  )
}

export default App
