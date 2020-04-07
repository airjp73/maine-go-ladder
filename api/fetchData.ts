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

// TODO: Consider a separate query method entirely for arrays
async function fetchData<T>(
  query: DocumentNode | DocumentNode[],
  operationName?: string,
  variables: object = {}
): Promise<T> {
  const body = Array.isArray(query)
    ? query.map((q) => ({
        query: print(q),
      }))
    : { query: print(query) };
  const data = await fetch("https://maine-go-ladder.herokuapp.com/v1/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    // body: JSON.stringify({
    //   query: Array.isArray(query)
    //     ? query.map((q) => ({ query: print(q) }))
    //     : print(query),
    //   variables,
    //   operationName,
    // }),
  });
  const result = (await data.json()) as Response<T>;
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
}

export default fetchData;
