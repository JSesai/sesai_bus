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

  add: (user: User): Promise<User> =>

    new Promise((resolve, reject) => {
      db.run("INSERT INTO users (name, userName, password, status, phone, role) VALUES (?, ?, ?, ?, ?, ?)", [user.name, user.userName, user.password, user.status, user.phone, user.role], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...user } as User);
      });
    }),
  update: (user: User) =>
    new Promise((resolve, reject) => {
      db.run(
        `
          UPDATE users SET
            name     = COALESCE(?, name),
            userName = COALESCE(?, userName),
            phone    = COALESCE(?, phone),
            status   = COALESCE(?, status),
            role     = COALESCE(?, role),
            password = COALESCE(?, password)
          WHERE id = ?
          `,
        [
          user.name,
          user.userName,
          user.phone,
          user.status,
          user.role,
          user.password,
          user.id
        ],
        function (err) {
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
  authUser: ({ userName }: UserCredentials) =>
    new Promise<User>((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE userName = ? LIMIT 1",
        [userName],
        (err, row) => {
          if (err) return reject(err);
          resolve(row as User);
        }
      );
    }),

  getByName: (userName: string) =>
    new Promise<User | null>((resolve, reject) => {

      db.get(
        `SELECT * FROM users WHERE userName = ? LIMIT 1`,
        [userName],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row as User : null);
        }
      )
    }),

  countUsers: (): Promise<number> =>
    new Promise((resolve, reject) => {
      db.get(
        "SELECT COUNT(*) as count FROM users",
        (err, row: { count: number }) => {
          if (err) return reject(err);
          resolve(row.count);
        }
      );
    }),






};
