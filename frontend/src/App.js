import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';
import axios from 'axios';

const AppToaster = Toaster.create({
  position: "top",
});

function App() {
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newParentName, setNewParentName] = useState("");
  const [newPhoneNo, setNewPhoneNo] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [original,setOriginal]=useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/student', {
          headers: {
            'api-key': process.env.REACT_APP_API_KEY,
          },
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  const addStudent = async () => {
    const name = newName.trim();
    const parentName = newParentName.trim();
    const phoneNo = newPhoneNo.trim();
    const address = newAddress.trim();
    const bloodGroup = newBloodGroup.trim();
    const hobby = newHobby.trim();

    if (name && parentName && phoneNo && address && bloodGroup && hobby) {
      const newStudent = {
        name,
        parentName,
        phoneNo,
        address,
        bloodGroup,
        hobby,
      };

      try {
        const response = await axios.post('http://localhost:5000/student', newStudent, {
          headers: {
            'api-key': process.env.REACT_APP_API_KEY,
          },
        });
        setStudents([...students, response.data]);
        AppToaster.show({
          message: "Student Added Successfully",
          intent: "success",
          timeout: 3000,
        });

        
        setNewName("");
        setNewParentName("");
        setNewPhoneNo("");
        setNewAddress("");
        setNewBloodGroup("");
        setNewHobby("");
      } 
      catch (error) 
      {
        console.error("Error adding student:", error);
        AppToaster.show({
          message: "Error adding student",
          intent: "danger",
          timeout: 3000,
        });
      }
    }
  };

  const onChangeHandler = (id, key, value) => {
    setStudents((prevStudents) => {
      return prevStudents.map(student => {
        if(student.id === id)
          { 
            if(!original){
              setOriginal(student);
            }
            return  {...student, [key]: value};;
          }
          return student;  
      });
    });
  };

  const changesMade=(originalStudent,updates)=>{
    for(const key in originalStudent){
      if(originalStudent[key] !== updates[key]){
        return true;
      }
    }
    return false;
  }

  const updateStudent = async (id) => {
    const updatedStudent = students.find((student) => student.id === id);

    
  if(original && changesMade(original , updatedStudent))  {
    try {
      await axios.put(`http://localhost:5000/student/${id}`, updatedStudent, {
        headers: {
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      setOriginal(null);

      AppToaster.show({
        message: "Student updated Successfully",
        intent: "success",
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      AppToaster.show({
        message: "Error updating student",
        intent: "danger",
        timeout: 3000,
      });
    }
  }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/student/${id}`, {
        headers: {
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      setStudents((prevStudents) => prevStudents.filter(student => student.id !== id));
      AppToaster.show({
        message: "Student deleted Successfully",
        intent: "success",
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      AppToaster.show({
        message: "Error deleting student",
        intent: "danger",
        timeout: 3000,
      });
    }
  };

  return (
    <div className="App">
      <h1>Task 1 - Student Details</h1>
      <table className='Task'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Parents Name</th>
            <th>Phone No</th>
            <th>Address</th>
            <th>Blood Group</th>
            <th>Hobby</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>
                <EditableText 
                  onChange={value => onChangeHandler(student.id, 'name', value)} 
                  value={student.name} 
                />
              </td>
              <td>
                <EditableText 
                  onChange={value => onChangeHandler(student.id, 'parentName', value)} 
                  value={student.parentName} 
                />
              </td>
              <td>
                <EditableText 
                  onChange={value => onChangeHandler(student.id, 'phoneNo', value)} 
                  value={student.phoneNo} 
                />
              </td>
              <td>
                <EditableText 
                  onChange={value => onChangeHandler(student.id, 'address', value)} 
                  value={student.address} 
                />
              </td>
              <td>
                <EditableText 
                  onChange={value => onChangeHandler(student.id, 'bloodGroup', value)} 
                  value={student.bloodGroup} 
                />
              </td>
              <td>
                <EditableText 
                  onChange={value => onChangeHandler(student.id, 'hobby', value)} 
                  value={student.hobby} 
                />
              </td>
              <td>
                <Button intent='primary' onClick={() => updateStudent(student.id)}>Update</Button>
                <Button intent='danger' onClick={() => deleteStudent(student.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder='Enter Name...' 
              />
            </td>
            <td>
              <InputGroup 
                value={newParentName} 
                onChange={(e) => setNewParentName(e.target.value)} 
                placeholder='Enter Parents Name...' 
              />
            </td>
            <td>
              <InputGroup 
                value={newPhoneNo} 
                onChange={(e) => setNewPhoneNo(e.target.value)} 
                placeholder='Enter Phone Number...' 
              />
            </td>
            <td>
              <InputGroup 
                value={newAddress} 
                onChange={(e) => setNewAddress(e.target.value)} 
                placeholder='Enter Address...' 
              />
            </td>
            <td>
              <InputGroup 
                value={newBloodGroup} 
                onChange={(e) => setNewBloodGroup(e.target.value)} 
                placeholder='Enter Blood Group...' 
              />
            </td>
            <td>
              <InputGroup 
                value={newHobby} 
                onChange={(e) => setNewHobby(e.target.value)} 
                placeholder='Enter Hobby...' 
              />
            </td>
            <td>
              <Button intent='success' onClick={addStudent}>Add Student</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
