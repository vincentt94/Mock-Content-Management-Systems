import pool from "../connection.js";

class Department {
    //method to show all departments
    static async getAllDepartments() {
        const query = "SELECT id, names FROM department;";
        const result = await pool.query(query);
        return result.rows;
    }
    //method to add new department to departments table 
    static async addDepartment(name: string) {
        const query = `INSERT INTO department (names) VALUES ($1) RETURNING id;`;
        const values = [name];
        const result = await pool.query(query, values);
        return result.rows[0].id;
    }
}

export default Department