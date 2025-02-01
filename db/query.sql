--This code below successfully displays ALL the employees AND their respective Job titles, salaries, and their manager's name (full name)

SELECT 
    employees.id,
    employees.first_name,
    employees.last_name,
    title, salary,
    COALESCE(manager.first_name || ' ' || manager.last_name, 'NULL') AS manager 
FROM employees 
JOIN  roles 
ON roles.id = employees.role_id
JOIN department
ON department.id = roles.department_id
LEFT JOIN employees manager 
ON employees.manager_id = manager.id;



-- This code shows all the department names
-- SELECT * FROM department;

-- This code shows all the roles & their salaries
-- SELECT title, salary FROM roles;


