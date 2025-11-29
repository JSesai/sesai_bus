import { getDB } from "../connection.js";
const db = getDB();

export const userRepo = {
  getAll: () => new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", (err, rows) => (err ? reject(err) : resolve(rows)));
  }),

  getById: (id: User['id']) =>
    new Promise<User>((resolve, reject) => {
      db.all(`SELECT * FROM users WHERE id = ?`, [id], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] as User);
      });
    }),

  add: (user: User) =>

    new Promise((resolve, reject) => {
      db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?, ?)", [user.name, user.user, user.password, user.status, user.role], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...user });
      });
    }),
  update: (user: { id: number; name?: string; email?: string }) =>
    new Promise((resolve, reject) => {
      db.run("UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?",
        [user.name, user.email, user.id], function (err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    }),
  delete: (id: number) =>
    new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
  authUser: ({ user, password }: UserCredentials) =>
    new Promise<User>((resolve, reject) => {
      db.get(
        "SELECT id, name, user, role FROM users WHERE user = ? AND password = ?",
        [user, password],
        (err, row) => {
          if (err) return reject(err);
          resolve(row as User);
        }
      );
    }),
};
