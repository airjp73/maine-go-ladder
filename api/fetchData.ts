import fetch from "isomorphic-fetch";
import { DocumentNode, print } from "graphql";

async function fetchData<T>(query: DocumentNode): Promise<T> {
  const data = await fetch("https://maine-go-ladder.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: print(query) }),
  });
  const result = await data.json();
  return result.data;
}

export default fetchData;
