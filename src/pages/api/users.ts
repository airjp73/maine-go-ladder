import knex from "../../common/server/knex";
import createRequestHandler from "../../common/server/createRequestHandler";
import { User, NewUser } from "../../resources/users/User";

export function getUsers(): Promise<User[]> {
  return knex
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
}

export async function createNewUser({
  ladder_rung,
  ...rest
}: NewUser): Promise<User> {
  return knex.transaction(async (trx) => {
    const [user] = await trx("users")
      .insert({ ...rest, streak: 0 })
      .returning<User[]>("*");
    const [insertedRung] = await trx("ladder_history")
      .insert({
        ladder_rung,
        user: user.id,
      })

      .returning<number[]>("ladder_rung");
    return { ...user, ladder_rung: insertedRung };
  });
}

export default createRequestHandler({
  GET: async (req, res) => res.json(await getUsers()),
  POST: async (req, res) => res.json(await createNewUser(req.body)),
});
