import knex from "../../common/server/knex";
import createRequestHandler from "../../common/server/createRequestHandler";
import { User } from "../../resources/users/User";

export default createRequestHandler({
  GET: async (req, res) => {
    const result = await knex
      .select("users.*")
      .select("ladder.ladder_rung")
      .leftJoin(
        knex("ladder_history")
          .select("*")
          .where("user", "users.id")
          .orderBy("created_at")
          .first()
          .as("ladder"),
        function () {
          this.on("ladder.user", "=", "users.id");
        }
      )
      .from("users")
      .where({ archived: false });
    return res.json(result);
  },
  POST: async (req, res) => {
    console.log(req.body);
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

    console.log(finalResult);

    return res.json({
      ...finalResult.user,
      ladder_rung: finalResult.insertedRung,
    });
  },
});
