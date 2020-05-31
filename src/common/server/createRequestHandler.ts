import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export interface RequestHandlers {
  [method: string]: NextApiHandler;
}

const createRequestHandler = (handlers: RequestHandlers) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const handler = req.method && handlers[req.method];
  if (!handler)
    return res
      .status(405)
      .json({ message: `Method ${req.method} not supported` });
  try {
    return await handler(req, res);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).send(err.message);
    }

    console.error(err);
    return res.status(500).send("Unknown Error");
  }
};

export default createRequestHandler;
