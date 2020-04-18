import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export interface RequestHandlers {
  [method: string]: NextApiHandler;
}

const createRequetHandler = (handlers: RequestHandlers) => (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const handler = req.method && handlers[req.method];
  if (!handler)
    return res
      .status(405)
      .json({ message: `Method ${req.method} not supported` });
  return handler(req, res);
};

export default createRequetHandler;
