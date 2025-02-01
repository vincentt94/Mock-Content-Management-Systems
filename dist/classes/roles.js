import pool from "../connection.js";
class Role {
    //this function will show all available roles
    static async getAllRoles() {
        const query = "SELECT id, title, salary FROM roles;";
        const result = await pool.query(query);
        return result.rows;
    }
    //this function will add roles 
    static async addRole(title, salary, departmentId) {
        const query = `
            INSERT INTO roles (title, salary, department_id)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const values = [title, salary, departmentId];
        const result = await pool.query(query, values);
        return result.rows[0].id;
    }
}
export default Role;
