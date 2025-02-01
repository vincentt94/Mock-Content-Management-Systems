import pool from "../connection.js";
class Employee {
    //method to see all employees
    static async getAllEmployees() {
        //assigned variable to see employees Id, first name, last name, their title, salary and who their manager is 
        const query = `
            SELECT 
                employees.id,
                employees.first_name,
                employees.last_name,
                roles.title, 
                roles.salary,
                COALESCE(manager.first_name || ' ' || manager.last_name, 'None') AS manager 
            FROM employees 
            JOIN roles ON roles.id = employees.role_id
            LEFT JOIN employees manager ON employees.manager_id = manager.id;
        `;
        //LEFT JOIN allows two different columns to join 
        //variable to receive the employees table     
        const result = await pool.query(query);
        return result.rows;
    }
    //method to add a new employee to the employees table 
    static async addEmployee(firstName, lastName, roleId, managerId) {
        //variable to hold info for new employee to be added into the employee table 
        const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id;`;
        const values = [firstName, lastName, roleId, managerId];
        const result = await pool.query(query, values);
        return result.rows[0].id;
    }
    //method to update employees role
    static async updateEmployeeRoles(employeeId, newRoleId) {
        const query = `
        UPDATE employees
        SET role_id = $1
        WHERE id = $2
        RETURNING id;
        `;
        const values = [newRoleId, employeeId];
        const result = await pool.query(query, values);
        return result.rows[0].id;
    }
}
export default Employee;
