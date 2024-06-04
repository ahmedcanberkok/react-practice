


import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureStorage from 'react-secure-storage';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Success() {
    // useState hook'ları ile state değişkenleri tanımlanıyor
  const [employees, setEmployees] = useState([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    jobTitle: ''
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formErrorsAdd, setFormErrorsAdd] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    jobTitle: ''
  });
  const [formErrorsUpdate, setFormErrorsUpdate] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    jobTitle: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const username = SecureStorage.getItem('username');
  
  const token = SecureStorage.getItem('token');
  let userRole = null;
  
  if (token) {
    const decodedToken = jwtDecode(token); // Token çözülüyor
    userRole = decodedToken.role; // 'role' claim'i token payload'unda mevcut olmalı
  }
  console.log("User Role: " + userRole);
  if (userRole === null) {
    console.warn('User role is null. Setting default role to 0.');
    userRole = '0'; // default role
  }


///  EMPLOYEE VERİLERİNİ ÇEKME START ///////
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await axios.get('https://localhost:7064/GetTable', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = response.data;
      setEmployees(data); // Çalışan verisi state'e kaydediliyor
    } catch (error) {
      console.error('Error:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();  // Bileşen yüklendiğinde çalışan verisi çekiliyor
  }, [fetchEmployees]);
    //// ÇALIŞAN VERİLERİ EMPLOYEE END ////

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });  // Form verileri state'e kaydediliyor
  };

  //////  ADD EMPLOYEE START /////
  const handleAddEmployee = async () => {
    const { firstName, lastName, birthDate, jobTitle } = formData;
    const errors = {};
    if (!firstName) errors.firstName = 'First Name alanını doldurunuz.';
    if (!lastName) errors.lastName = 'Last Name alanını doldurunuz.';
    if (!birthDate) errors.birthDate = 'Birth Date alanını doldurunuz.';
    if (!jobTitle) errors.jobTitle = 'Job Title alanını doldurunuz.';
    if (Object.keys(errors).length > 0) {
      setFormErrorsAdd(errors);
      return; // Hatalar varsa ekleme işlemi durduruluyor
    }

    const token = SecureStorage.getItem('token');
    
    const formattedBirthDate = new Date(birthDate).toISOString(); // Doğum tarihi formatlanıyor
    
    try {
      const response = await axios.post('https://localhost:7064/EmployeeCrud', {
        firstName,
        lastName,
        birthDate: formattedBirthDate,
        jobTitle
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        fetchEmployees();  // Çalışan listesi güncelleniyor
        setIsAddPopupOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          birthDate: '',
          jobTitle: ''
        }); // Form verileri temizleniyor
      }
    } catch (error) {
      console.error('Error:', error.response || error.message || error);
      setFormErrorsAdd({ general: 'An error occurred while adding the employee.' });
    }
};
////// ADD EMPLOYEE END /////////////

  
///// DELETE EMPLOYEE START ///////////
  const handleDeleteEmployee = async (employeeID) => {
    try {
      const response = await axios.delete(`https://localhost:7064/EmployeeCrud/${employeeID}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        fetchEmployees(); // Çalışan listesi güncelleniyor
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
///// DELETE EMPLOYEE END ///////////

///// UPDATE EMPLOYEE START ///////////
  const handleUpdateEmployee = async () => {
    const { firstName, lastName, birthDate, jobTitle } = formData;
    const errors = {};
    if (!firstName) errors.firstName = 'First Name alanını doldurunuz.';
    if (!lastName) errors.lastName = 'Last Name alanını doldurunuz.';
    if (!birthDate) errors.birthDate = 'Birth Date alanını doldurunuz.';
    if (!jobTitle) errors.jobTitle = 'Job Title alanını doldurunuz.';
    if (Object.keys(errors).length > 0) {
      setFormErrorsUpdate(errors);
      return;  // Hatalar varsa güncelleme işlemi durduruluyor
    }
  
    const token = SecureStorage.getItem('token');
    
    try {
      const response = await axios.put(`https://localhost:7064/EmployeeCrud/${selectedEmployee.employeeID}`, 
      {
        employeeID: selectedEmployee.employeeID,
        firstName,
        lastName,
        birthDate,
        jobTitle
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        fetchEmployees(); // Çalışan listesi güncelleniyor
        setIsUpdatePopupOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          birthDate: '',
          jobTitle: ''
        }); // Form verileri temizleniyor
        setSelectedEmployee(null); // Seçilen çalışan sıfırlanıyor
      }
    } catch (error) {
      console.error('Error:', error.response || error.message || error);
      setFormErrorsUpdate({ general: 'An error occurred while updating the employee.' });
    }
  };
///// UPDATE EMPLOYEE END ///////////


  const openUpdatePopup = (employee) => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      birthDate: employee.birthDate,
      jobTitle: employee.jobTitle
    });
    setSelectedEmployee(employee); // Seçilen çalışan state'e kaydediliyor
    setIsUpdatePopupOpen(true); // Güncelleme pop-up'ı açılıyor
  }; 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);  // Sayfa numarası güncelleniyor

 /// TARİH
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);  // Tarih formatlanıyor
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="w-full max-w-4xl px-4">
      <div className="flex items-center w-full py-4 bg-green-200 text-white px-4">
          <button onClick={() => navigate('/success')} className="text-lg font-semibold mr-4">Anasayfa</button>
          <button onClick={() => navigate('/documents')} className="text-lg font-semibold mr-4">Belgeler</button>
          <button onClick={() => navigate('/currency')} className="text-lg font-semibold mr-4">Güncel Kurlar</button>
        </div>
        <h1 className="text-3xl font-bold mb-5 text-center mt-5">Employees</h1>
        <div className="mb-5 flex justify-end space-x-2">
          <h2 className="text-2xl text-left">Merhaba {username}</h2>
          {userRole === '1' && (
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => setIsAddPopupOpen(true)}
            >
              Veri Ekle
            </button>
          )}
          <button
            className="bg-gray-500 text-white px-2 py-1 rounded"
            onClick={() => {
              SecureStorage.removeItem('token');
              navigate('/');
            }}
          >
            Çıkış
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mx-auto text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birth Date</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEmployees.map((employee) => (
                <tr key={employee.employeeID}>
                  <td className="px-2 py-2 whitespace-nowrap">{employee.employeeID}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{employee.firstName}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{employee.lastName}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{formatDate(employee.birthDate)}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{employee.jobTitle}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{employee.createdByUsername ?? 'null'}</td>
                  <td className="px-2 py-2 whitespace-nowrap flex space-x-1">
                    {userRole === '1' && (
                      <>
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => openUpdatePopup(employee)}
                        >
                          Güncelle
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleDeleteEmployee(employee.employeeID)}
                        >
                          Veri Sil
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-6 mb-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white px-2 py-1 rounded disabled:bg-gray-300 "
          >
            Geri
          </button>
          <span>Sayfa {currentPage}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= employees.length}
            className="bg-gray-500 text-white px-2 py-1 rounded disabled:bg-gray-300 "
          >
            İleri
          </button>
        </div>
      </div>
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={() => setIsAddPopupOpen(false)}>
              &times;
            </button>
            <h2 className="text-xl mb-4">Yeni Çalışan Ekle</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsAdd.firstName && <p className="text-red-500 text-xs">{formErrorsAdd.firstName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsAdd.lastName && <p className="text-red-500 text-xs">{formErrorsAdd.lastName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsAdd.birthDate && <p className="text-red-500 text-xs">{formErrorsAdd.birthDate}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsAdd.jobTitle && <p className="text-red-500 text-xs">{formErrorsAdd.jobTitle}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsAddPopupOpen(false)} className="bg-gray-500 text-white py-1 px-3 rounded text-sm">
                  Çıkış
                </button>
                <button type="button" onClick={handleAddEmployee} className="bg-blue-500 text-white py-1 px-3 rounded text-sm">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isUpdatePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={() => setIsUpdatePopupOpen(false)}>
              &times;
            </button>
            <h2 className="text-xl mb-4">Çalışan Güncelle</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsUpdate.firstName && <p className="text-red-500 text-xs">{formErrorsUpdate.firstName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsUpdate.lastName && <p className="text-red-500 text-xs">{formErrorsUpdate.lastName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsUpdate.birthDate && <p className="text-red-500 text-xs">{formErrorsUpdate.birthDate}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsUpdate.jobTitle && <p className="text-red-500 text-xs">{formErrorsUpdate.jobTitle}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsUpdatePopupOpen(false)} className="bg-gray-500 text-white py-1 px-3 rounded text-sm">
                  Çıkış
                </button>
                <button type="button" onClick={handleUpdateEmployee} className="bg-blue-500 text-white py-1 px-3 rounded text-sm">
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Success;

