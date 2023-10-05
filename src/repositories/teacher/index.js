const pool = require('../../repositories/shared/db');

// This asynchronous function generates a new teacher ID.
async function newTeacherId () {
    try{
        const res = await pool.query(`SELECT * FROM student ORDER BY student_id ASC;`);
        if (res.rows.length === 0){
            return 1;
        }
        else {
            let latestId = res.rows[res.rows.length - 1].teacher_id;
            return latestId + 1;
        }
    }
    catch (err){
        console.error("Error occured:", err);
        throw err;
    }
};

// This asynchronous function creates a new teacher record in the database.
async function createNewTeacher (firstName, lastName, phoneNumber, eMail, sex, age, city, streetAddress, stateProvince, postalCode) {
    try {
        let teacher = {
            teacher_id: await newTeacherId(),
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            email: eMail,
            gender: sex, 
            age: age,
            street_address: streetAddress,
            city: city,
            state_province: stateProvince,
            postal_code: postalCode,
        }

        const insertTeacherQuery = `
        INSERT INTO teacher (teacher_id, first_name, last_name, phone_number, email, gender, age, street_address, city, state_province, postal_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )
        RETURNING *;`;

        let test = await pool.query (insertTeacherQuery, [
            teacher.teacher_id,
            teacher.first_name,
            teacher.last_name,
            teacher.phone_number,
            teacher.email,
            teacher.gender,
            teacher.age,
            teacher.street_address,
            teacher.city,
            teacher.state_province,
            teacher.postal_code,
        ]);
        console.log("the teacher has been added successfully:" , test.rows[0]);
    }
    catch (error) {
        console.error("Error occured:", error)
    }
};

// This asynchronous function deletes a teacher record from the database by their ID.
async function deleteTeacherById (id) {
    try {
        const res = await pool.query(`SELECT * FROM teacher WHERE teacher_id = $1` , [id]);
        if (res.rows.length === 1){
            const deleteTeacherQuery = `DELETE FROM teacher WHERE teacher_id = $1`;
            await pool.query(deleteTeacherQuery, [id]);
            console.log("Teacher deleted successfully.");
        }
        else {
            console.log("The teacher with the given ID does not exist.");
        }
    }
    catch (error){
        console.error("Error occured:", error);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function updates a teacher's first name by their ID in the database.
async function updateTeacherNameById(id, name) {
    try {
        const res = await pool.query(`SELECT * FROM teacher WHERE teacher_id = $1` , [id]);
        if (res.rows.length === 1) {
            const updateTeacherName = await pool.query(`UPDATE teacher SET first_name = $1 WHERE teacher_id = $2`, [name, id]);
            console.log(`Updated teacher name for ID ${id} to ${name}`);
        }
        else{
            console.log(`No teacher found with ID ${id}`);
        }
    }
    catch (error) {
        console.error("Error occured:", error);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function finds and prints teachers with a given gender from the database.
async function findTeachersByGender(gender) {
    try {
        const res = await pool.query(`SELECT * FROM teacher WHERE gender = $1`, [gender]);
        if (res.rows.length > 0){
            console.log(`********** teacher with gender: ${gender}`);
            res.rows.forEach((gender)=> {
                console.log(`First Name: ${gender.first_name} *** Last Name: ${gender.last_name} *** Phone NUmber: ${gender.phone_number}`);
            })
        } else {
            console.log(`No teacher found with given gender "${gender}"`);
        }
    }
    catch (error) {
        console.error("Error occured:", error);
    }
    finally {
        pool.end();
    }
};

module.exports = {
    newTeacherId: newTeacherId,
    createNewTeacher: createNewTeacher,
    deleteTeacherById: deleteTeacherById,
    updateTeacherNameById: updateTeacherNameById,
    findTeachersByGender: findTeachersByGender,
};