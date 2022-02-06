import { AuthSchemaType } from "../index.d";
import user from "../authSchema";
import * as bcrypt from "bcrypt";

/**
 * This endpoint is used to login a user once called.
 *
 * @type {POST} This is a post typed endpoint.
 * @param {string} username The username that the user entered.
 * @param {string} password The password that the user entered.
 * @returns {string} Returns the result of the login in a string format.
 */

const login = async (req: any, res: any, _next: any): Promise<void> => {
    if (req.query.key !== String(process.env.KEY)) {
      res.status(401).send("ERROR: Invalid api key.");
    }
    try {
      await user
        .findOne({ username: { $eq: req.body.username } })
        .exec()
        .then(
          async (data: AuthSchemaType | null | undefined): Promise<void> => {
            if (data != null && data != undefined) {
              if (bcrypt.compare(data.password, req.body.password)) {
                res.status(200).send("User login success");
              } else res.status(400).send("Invalid password");
            } else res.status(400).send("User not found");
          }
        )
        .catch((err: unknown): void => {
          res.status(500).send(`SERVER ERROR: ${err}`);
        });
    } catch (err: unknown) {
      res.status(500).send(`SERVER ERROR: ${err}`);
    }
  }

  export default login;