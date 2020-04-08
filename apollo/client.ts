import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/link-batch-http";
import fetch from "isomorphic-fetch";

// Sometimes Creating the client causes issues on the server / at build time
// because it relies on having a global fetch
if (typeof window === "undefined") {
  (global as any).fetch = fetch;
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new BatchHttpLink({
    uri: "https://maine-go-ladder.herokuapp.com/v1/graphql",
  }),
});

export default client;
