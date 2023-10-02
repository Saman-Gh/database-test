const pool = require('../../repositories/shared/db');

// This asynchronous function generates a new class ID.
async function newClassId () {
    try {
        const res = await pool.query (`SELECT * FROM class`);
        if (res.rows.length === 0) {
            return 1;
        }else {
            let latestId = res.rows[res.rows.length - 1].class_id;
            return latestId + 1;
        }
    }
    catch(err) {
        console.error("Error occured:", err);
        throw err;
    }
};

// This asynchronous function creates a new class record in the database.
async function createNewClass (className, teacherId, classFloor ) {
    try {
        const classExistCheck = await pool.query(`SELECT * FROM class WHERE class_name = $1`, [className]);
        if(classExistCheck.rows.length === 0){
            const teacherExistCheck = await pool.query("SELECT * FROM teacher WHERE teacher_id = $1" , [teacherId]);
            if (teacherExistCheck.rows.length === 1){
                let newClass = {
                    class_id: await newClassId(),
                    class_name: className,
                    teacher_id: teacherId,
                    class_floor: classFloor,
                }
                const insertClassQuery = `
                INSERT INTO class (class_id, class_name, teacher_id, class_floor)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`;
    
                const result = await pool.query(insertClassQuery, [
                    newClass.class_id,
                    newClass.class_name,
                    newClass.teacher_id,
                    newClass.class_floor,
                ]);
                console.log("the class has been added successfully:" , result.rows[0]);
            }
            else {
                console.log(`No teacher found with ID ${teacherId}`);
            }
        }
        else{
            console.log("The class with given name exsits.");
        }
        
    }
    catch(err){
        console.error("Error occured:" , err);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function deletes a class record from the database by its ID.
async function deleteClassById (id) {
    try {
        const res = await pool.query(`SELECT * FROM class WHERE class_id = $1`, [id]);
        if (res.rows.length === 1){
            const deleteClassQuery = `DELETE FROM class WHERE class_id = $1`;
            await pool.query(deleteClassQuery, [id]);
            console.log("class deleted successfully.");
        }
        else{
            console.log("The class with the given ID does not exist.");
        }
    }
    catch (error){
        console.error("Error occured:", error);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function updates a class name by its ID in the database.
async function updateClassNameById(id, name) {
    try {
        const res = await pool.query(`SELECT * FROM class WHERE class_id = $1`, [id]);
        if (res.rows.length === 1) {
            const updateClassName = await pool.query(`UPDATE class SET class_name = $1 WHERE class_id = $2`, [name, id]);
            console.log(`Updated class name for ID ${id} to ${name}`);
        }
        else{
            console.log(`No teacher found with ID ${id}`);
        }
    }
    catch (error){
        console.error("Error occured:", error);
    }
    finally{
        pool.end();
    }
};

// This asynchronous function finds and prints classes on a specific floor from the database.
async function findClassByFloor(floor) {
    try {
        const res = await pool.query(`SELECT * FROM class WHERE class_floor = $1` , [floor]);
        if (res.rows.length > 0){
            console.log(`********** class in floor: ${floor}`);
            res.rows.forEach((floor)=> {
                console.log(`class: ${floor.class_name}`);
            })
        }
    }
    catch (error){
        console.error("Error occured:", error);
    }
    finally{
        pool.end();
    }
};

module.exports = {
    newClassId: newClassId,
    createNewClass: createNewClass,
    deleteClassById: deleteClassById,
    updateClassNameById: updateClassNameById,
    findClassByFloor: findClassByFloor,
};