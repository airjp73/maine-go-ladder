import fetch from "isomorphic-fetch";

async function graphql<T>(query: string): Promise<T> {
  const data = await fetch("https://maine-go-ladder.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });
  const result = await data.json();
  return result.data;
}

export default graphql;
