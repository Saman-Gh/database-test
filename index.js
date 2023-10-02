const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    database: 'malaysiaschool',
    host: 'localhost',
    password: '123456789',
    port: 5432
});

let newStudentId = null;

async function createNewStudentId () {
    let res = await pool.query(`SELECT * FROM student`);
    try{
        if(res.rows.length === 0){
            newStudentId = 1;
            return newStudentId;
        }
        else{
            let latestStudentId = res.rows[res.rows.length - 1].student_id;
            newStudentId = latestStudentId + 1;
            return newStudentId;
        }
    }
    catch (error) {
        console.log("Error occurred:", error);
    }
}

async function createNewStudent (firstName, lastName, parentName, eMail, age, sex) {
    try {
        let student = {
            student_id: await createNewStudentId(),
            first_name: firstName,
            last_name: lastName,
            parent_name: parentName,
            email: eMail,
            age: age,
            gender: sex,
        }
        const insertStudentQuery = `
        INSERT INTO student (student_id, first_name, last_name, parent_name, email, age, gender)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`;

        let test = await pool.query(insertStudentQuery, [
            student.student_id,
            student.first_name,
            student.last_name,
            student.parent_name,
            student.email,
            student.age,
            student.gender,
        ]);
        console.log("the student has been added successfully:" , test.rows[0]);
    }
    catch (error) {
        console.log("ErError occurred:" , error);
    }
}

createNewStudent("Saman", "Ghorban", "Mahdi", "samanghorban@gmail.com", 31, "Male");