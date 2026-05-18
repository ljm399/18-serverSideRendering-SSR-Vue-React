import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.query);
  console.log(req.body);

  if (req.method === "POST") {
    const userInfo = {
      name: "liujun",
      age: 18,
      token: "aabbcc",
    };

    res.status(200).send(userInfo);
  } else {
    res.status(405).end();
  }
}
