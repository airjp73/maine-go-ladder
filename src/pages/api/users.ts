import knex from "../../common/server/knex";
import createRequestHandler from "../../common/server/createRequestHandler";
import { User } from "../../resources/users/User";

export default createRequestHandler({
  GET: async (req, res) => {
    const result = await knex
      .select("users.*")
      .distinctOn("users.id")
      .select("ladder_history.ladder_rung")
      .select("ladder_history.created_at as ladder_date")
      .from("users")
      .leftJoin("ladder_history", "users.id", "ladder_history.user")
      .where({ archived: false })
      .orderBy([
        { column: "users.id", order: "desc" },
        { column: "ladder_history.created_at", order: "desc" },
      ]);
    return res.json(result);
  },
  POST: async (req, res) => {
    const { ladder_rung, ...rest } = req.body;

    const finalResult = await knex.transaction(async (trx) => {
      const [user] = await trx("users")
        .insert({ ...rest, streak: 0 })
        .returning<User[]>("*");
      const [insertedRung] = await trx("ladder_history")
        .insert({
          ladder_rung,
          user: user.id,
        })
        .returning<number[]>("ladder_rung");
      return { user, insertedRung };
    });

    return res.json({
      ...finalResult.user,
      ladder_rung: finalResult.insertedRung,
    });
  },
});
