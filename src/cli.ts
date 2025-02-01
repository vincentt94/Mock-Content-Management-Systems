import inquirer from "inquirer";
import employees from './classes/employees.js';
import departments from './classes/departments.js';
import roles from './classes/roles.js';


class Cli {
    //method to view all departments from exisiting departments
    async chooseDepartments(): Promise<void> {
        try {
            const department = await departments.getAllDepartments();
            console.table(department);
        } catch (err) {
            console.error("Error retrieving departments:", err);
        }
    };

    //method to view all Roles from exisiting roles list
    async chooseRoles(): Promise<void> {
        try {
            // need to asign the function from roles class
            const role = await roles.getAllRoles();
            //displays all the roles 
            console.table(role);
            //catch operator incase something goes wrong and no roles were received
        } catch (err) {
            console.error("Error retrieving roles:", err);
        }
    };

    //method to view all Employees from exising list of Employees
    async chooseEmployees(): Promise<void> {
        try {
            const employee = await employees.getAllEmployees();
            console.table(employee);
        } catch (err) {
            console.error("Error retrieving employees:", err);
        }
    };


    //method to add Departments
    async addDepartments(): Promise<void> {
        try {
            //assigning variable to inquiry prompt to ask user for new department name
            const answers = await
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: 'Enter the new department name:',
                        }
                    ]);
            //assigning variable to retrieve the new name from the function in the departments class        
            const departmentId = await departments.addDepartment(answers.name);
            console.log(`Department added successfully! Department ID: ${departmentId}`);
        }
        catch (err) {
            console.error("Error adding department:", err);
        }
    };
    //method to add Roles

    async addRoles(): Promise<void> {
        try {
            const department = await departments.getAllDepartments();
            //adding new varaible to look for department names to assign new role to 
            const departmentChoices = department.map(dept => ({
                name: dept.names,
                value: dept.id
            }));
            //prompts to ask for new roles 
            const answers = await
                inquirer.
                    prompt([
                        {
                            type: "input",
                            name: "title",
                            message: "Enter the new role title:",
                        },
                        {
                            type: "input",
                            name: "salary",
                            message: "Enter the salary for this role:",
                        },
                        {
                            type: "list",
                            name: "departmentId",
                            message: "Select the department for this role:",
                            choices: departmentChoices,
                        }
                    ]);
            await roles.addRole(answers.title, parseFloat(answers.salary), answers.departmentId);
            console.log(`Role added successfully!`);
        }
        catch (err) {
            console.error("Error adding role:", err);
        }
    };


    //method to add Employees
    async addEmployees(): Promise<void> {
        try {
            const role = await roles.getAllRoles();
            const roleChoices = role.map(role => ({ name: role.title, value: role.id }));
            //variable to call function from employees class
            const managers = await employees.getAllEmployees();
            //variable to determine mananger if any
            const managerChoices = managers.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
            }));
            // adds none option to array of manager choices 
            managerChoices.unshift({ name: "None", value: null });
            //prompt to ask user to fill out employee information
            const answers = await
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "Enter employee's first name:"
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Enter employee's last name:"
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Select employee's role:",
                            choices: roleChoices
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Select employee's manager:",
                            choices: managerChoices
                        }
                    ]);
            //stores results of new employee information    
            await employees.addEmployee(answers.firstName, answers.lastName, answers.roleId, answers.managerId);
            console.log(` Employee added successfully!`);
        } catch (err) {
            console.error("Error adding employee:", err);
        }
    };

    //method to update employees role
    async updateEmployeeRole(): Promise<void> {
        try {
            //variable to select from all employees
            const employeeToUpdate = await employees.getAllEmployees();
            const employeeChoices = employeeToUpdate.map(emp => ({
                name: `${emp.first_name} ${emp.last_name} (${emp.title})`,
                value: emp.id
            })
            );
            ///variable to assign new role to selected employee 
            const newrole = await roles.getAllRoles();
            const roleChoices = newrole.map(role => ({
                name: role.title,
                value: role.id
            })
            );
            //prompt user to select employee & select new role 
            const answers = await
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employeeId',
                            message: ' Select an employee to update their role',
                            choices: employeeChoices
                        },
                        {
                            type: 'list',
                            name: 'newRoleId',
                            message: 'Select the new role',
                            choices: roleChoices
                        }
                    ]);
            // update new role to employee 
            await employees.updateEmployeeRoles(answers.employeeId, answers.newRoleId);
            console.log(`Employee role was successfully updateed.)`);
        } catch (err) {
            console.error('Error updating employee role', err);
        }
    };


    startCli(): void {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'mainMenu',
                    message: 'What would you like to do?',
                    choices: ['View all Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add Role', 'View all Departments', 'Add Department', 'Quit']
                },
            ])
            .then((answers) => {
                //user selects input, resulting function will deploy depending on input
                //restart function so application doesn't end right after the first function 
                if (answers.mainMenu === 'View all Employees') {
                    this.chooseEmployees().then(() => this.startCli());
                } else if (answers.mainMenu === 'Add Employee') {
                    this.addEmployees().then(() => this.startCli());
                } else if (answers.mainMenu === 'Update Employee Role') {
                    this.updateEmployeeRole().then(() => this.startCli());
                } else if (answers.mainMenu === 'View all Roles') {
                    this.chooseRoles().then(() => this.startCli());
                } else if (answers.mainMenu === 'View all Departments') {
                    this.chooseDepartments().then(() => this.startCli());
                } else if (answers.mainMenu === 'Add Role') {
                    this.addRoles().then(() => this.startCli());
                } else if (answers.mainMenu === 'Add Department') {
                    this.addDepartments().then(() => this.startCli());
                } else {
                    console.log('Exiting');
                    process.exit();
                }
            });
    }
}

const cli = new Cli();
cli.startCli();
