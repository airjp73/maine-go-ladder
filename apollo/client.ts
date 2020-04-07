import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/link-batch-http";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new BatchHttpLink({
    uri: "https://maine-go-ladder.herokuapp.com/v1/graphql",
  }),
});

export default client;
