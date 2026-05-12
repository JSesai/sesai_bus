import { getDB } from "../connection.js";

const db = getDB();

export const processFlowRepo = {

    processConfirmedPurchase: async (
        props: IProcessConfirmedPurchase
    ): Promise<void> => {
        const { customerId, scheduleId, seatNumbers, paymentMethod, totalAmount } = props;
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION");

                // 1. Insert purchase (confirmada)
                db.run(
                    `INSERT INTO purchases (customer_id, total_amount, status)
               VALUES (?, ?, 'confirmed')`,
                    [customerId, totalAmount],
                    function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            return reject(err);
                        }

                        const purchaseId = this.lastID;

                        // 2. Actualizar tickets seleccionados a 'occupied' y asociarlos a la compra
                        const placeholders = seatNumbers.map(() => "?").join(", ");
                        const sqlUpdate = `
                  UPDATE tickets
                  SET status = 'occupied', purchase_id = ?
                  WHERE schedule_id = ? AND seat_number IN (${placeholders})
                `;
                        const params = [purchaseId, scheduleId, ...seatNumbers];

                        db.run(sqlUpdate, params, (err) => {
                            if (err) {
                                db.run("ROLLBACK");
                                return reject(err);
                            }

                            // 3. Insertar pago ligado a la compra
                            db.run(
                                `INSERT INTO payments (purchase_id, method, amount, status)
                     VALUES (?, ?, ?, 'confirmed')`,
                                [purchaseId, paymentMethod, totalAmount],
                                (err) => {
                                    if (err) {
                                        db.run("ROLLBACK");
                                        return reject(err);
                                    }

                                    // 4. Commit final
                                    db.run("COMMIT", (commitErr) => {
                                        if (commitErr) {
                                            db.run("ROLLBACK");
                                            return reject(commitErr);
                                        }
                                        resolve();
                                    });
                                }
                            );
                        });
                    }
                );
            });
        });
    },




};
