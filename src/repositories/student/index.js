const pool = require('../../repositories/shared/db');

// This asynchronous function generates a new student ID.
async function newStudentId() {
    try{
        let res = await pool.query(`SELECT * FROM student`);
        if (res.rows.length === 0){
            return 1;
        }
        else {
            let latestId = res.rows[res.rows.length - 1].student_id;
            return latestId + 1;
        }
    }
    catch(err){
        console.error("Error occured:", err);
        throw err;
    }
}; 

// This asynchronous function creates a new student record in the database.
async function createNewStudent (firstName, lastName, parentName, eMail, sex, age) {
    try{
        let student = {
            student_id: await newStudentId(),
            first_name: firstName,
            last_name: lastName,
            parent_name: parentName,
            email: eMail,
            gender: sex,
            age: age,
        }
        const insertStudentQuery = `
        INSERT INTO student (student_id, first_name, last_name, parent_name, email, gender, age)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`;

        let result = await pool.query(insertStudentQuery, [
            student.student_id,
            student.first_name,
            student.last_name,
            student.parent_name,
            student.email,
            student.gender,
            student.age,
        ])
        console.log("the student has been added successfully:" , result.rows[0]);
    }
    catch(err){
        console.log("Error occured:" , err);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function deletes a student record from the database by their ID.
async function deleteStudentById (id) {
    try {
        let res = await pool.query(`SELECT * FROM student WHERE student_id = $1` , [id]);
        if (res.rows.length === 1){
            const deleteStudentQuery = `DELETE FROM student WHERE student_id = $1`;
            await pool.query(deleteStudentQuery , [id])
            console.log("Student deleted successfully.");
        }
        else {
            console.log("The student with the given ID does not exist.");
        }
    }
    catch (error){
        console.log("An error occured:", error);
    }
    finally {
        pool.end();
    }
};

// This asynchronous function updates a student's first name by their ID in the database.
async function updateStudentNameById(id, name) {
    try {
        const res = await pool.query('SELECT * FROM student WHERE student_id = $1', [id]);
        if (res.rows.length === 1) {
            const updateStudentName = await pool.query('UPDATE student SET first_name = $1 WHERE student_id = $2', [name, id]);
            console.log(`Updated student name for ID ${id} to ${name}`);
        } else {
            console.log(`No student found with ID ${id}`);
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function finds and prints students with a given parent name from the database.
async function findStudentsByParentName(parentName) {
    try {
        // Query the database to find students with the given parent name
        const res = await pool.query('SELECT * FROM student WHERE parent_name = $1', [parentName]);
        if (res.rows.length > 0) {
            // Print the first name and last name of matching students
            console.log(`********** Students with parent name: "${parentName}":`);
            res.rows.forEach((student) => {
                console.log(`First Name: ${student.first_name}, Last Name: ${student.last_name}`);
            });
        } else {
            console.log(`No students found with parent name "${parentName}"`);
        }
    } catch (error) {
        console.error('Error finding students by parent name:', error);
    }
    finally{
        pool.end();
    }
};

module.exports = {
    newStudentId: newStudentId,
    createNewStudent: createNewStudent,
    deleteStudentById: deleteStudentById,
    updateStudentNameById: updateStudentNameById,
    findStudentsByParentName: findStudentsByParentName,
};
