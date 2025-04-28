const { ApolloClient, InMemoryCache,gql } = require("@apollo/client");

const client = new ApolloClient({
    uri: "https://gql.hashnode.com/",
    cache: new InMemoryCache(),
})

export default client;