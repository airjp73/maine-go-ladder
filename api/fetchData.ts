import fetch from "isomorphic-fetch";
import { DocumentNode, print } from "graphql";

interface SuccessfulResponse<T> {
  data: T;
  errors: never;
}

interface FailedResponse {
  errors: { message: string }[];
  data: never;
}

type Response<T> = SuccessfulResponse<T> | FailedResponse;

async function fetchData<T>(
  query: DocumentNode,
  variables: object = {}
): Promise<T> {
  const data = await fetch("https://maine-go-ladder.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: print(query), variables }),
  });
  const result = (await data.json()) as Response<T>;
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
}

export default fetchData;
