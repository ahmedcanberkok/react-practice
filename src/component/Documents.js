

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureStorage from 'react-secure-storage';
import {jwtDecode} from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Documents = () => {
    // State değişkenleri tanımlanıyor
  const [documents, setDocuments] = useState([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [formErrorsAdd, setFormErrorsAdd] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 10;
  const navigate = useNavigate();
  const token = SecureStorage.getItem('token');
  let userRole = null;
  let userId = null;
  let username = null;

    // Token varsa çözülüp kullanıcı bilgileri alınıyor
  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
    userId = decodedToken.userId;
    username = decodedToken.username;
  }

    // Belgeleri sunucudan almak için fonksiyon tanımlanıyor
  const fetchDocuments = useCallback(async () => {
    try {
      const response = await axios.get('https://localhost:7064/Documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setDocuments(response.data); // Belgeler state'e kaydediliyor
    } catch (error) {
      console.error('Error:', error);
      toast.error('Belgeler alınırken hata oluştu');
    }
  }, [token]);

    // Bileşen yüklendiğinde belgeleri çekmek için useEffect kullanılıyor
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

    // Belge adı ve dosyasının değişikliklerini izleyen fonksiyonlar
  const handleDocumentNameChange = (e) => {
    setDocumentName(e.target.value);
  };

  const handleDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

    // Yeni belge ekleme fonksiyonu
  const handleAddDocument = async () => {
    const errors = {};
    if (!documentName) errors.documentName = 'Document Name alanını doldurunuz.';
    if (!documentFile) errors.documentFile = 'Document File alanını doldurunuz.';
    if (Object.keys(errors).length > 0) {
      setFormErrorsAdd(errors);
      return; // Hatalar varsa ekleme işlemi durduruluyor
    }
  
    const reader = new FileReader();
    reader.readAsDataURL(documentFile);
    reader.onload = async () => {
      const base64File = reader.result.split(',')[1];
      
      const formData = new FormData();
      formData.append('DocumentName', documentName);
      formData.append('Files', documentFile);
      formData.append('FileName', documentFile.name);
      formData.append('DocumentBase64', base64File);
      formData.append('UploadedBy', userId);
  
      try {
        const response = await axios.post('https://localhost:7064/Documents', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          fetchDocuments(); // Belgeler yeniden çekiliyor
          setIsAddPopupOpen(false);
          setDocumentName('');
          setDocumentFile(null);
          toast.success(`Belge başarıyla eklendi: ${documentName}`);
        }
      } catch (error) {
        console.error('Error during document upload:', error.response || error.message || error);
        if (error.response) {
          const backendErrors = error.response.data.errors;
          const formattedErrors = {};
          for (const [key, value] of Object.entries(backendErrors)) {
            formattedErrors[key] = value.join(' ');
          }
          setFormErrorsAdd({ general: 'Belge eklenirken hata oluştu.', ...formattedErrors });
        } else {
          setFormErrorsAdd({ general: 'Belge eklenirken bilinmeyen bir hata oluştu.' });
        }
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setFormErrorsAdd({ general: 'Dosya okunurken hata oluştu.' });
    };
  };

    // Belge silme fonksiyonu
  const handleDeleteDocument = async (id) => {
    try {
      const response = await axios.delete(`https://localhost:7064/Documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        fetchDocuments();
        toast.success('Belge başarıyla silindi');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Belge silinirken hata oluştu');
    }
  };
  // Belge indirme fonksiyonu
  const handleDownloadDocument = async (id, fileName) => {
    try {
      const response = await axios.get(`https://localhost:7064/Documents/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${response.data.documentBase64}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Belge başarıyla indirildi');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Belge indirilirken hata oluştu');
    }
  };

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);

  const nextPage = () => {
    if (currentPage < Math.ceil(documents.length / documentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <ToastContainer />
      <div className="w-full max-w-4xl px-4">
        <div className="flex items-center w-full py-4 bg-green-200 text-white px-4">
          <button onClick={() => navigate('/success')} className="text-lg font-semibold mr-4">Anasayfa</button>
          <button onClick={() => navigate('/documents')} className="text-lg font-semibold mr-4">Belgeler</button>
          <button onClick={() => navigate('/currency')} className="text-lg font-semibold mr-4">Güncel Kurlar</button>

        </div>
        <h1 className="text-3xl font-bold mb-5 text-center mt-5">Belgeler</h1>
        <div className="mb-5 flex justify-end space-x-2">
          {userRole === '1' && (
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => setIsAddPopupOpen(true)}
            >
              Belge Ekle
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
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Belge Adı</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosya İsmi</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yükleyen</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturulma Tarihi</th>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDocuments.map((document) => (
                <tr key={document.documentId}>
                  <td className="px-2 py-2 whitespace-nowrap">{document.documentId}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{document.documentName}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{document.fileName}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{document.uploadedByUsername}</td>
                  <td className="px-2 py-2 whitespace-nowrap">{new Date(document.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-2 whitespace-nowrap flex space-x-1">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDeleteDocument(document.documentId)}
                    >
                      Sil
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDownloadDocument(document.documentId, document.fileName)}
                    >
                      İndir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Geri
            </button>
            <span>Sayfa {currentPage}</span>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={nextPage}
              disabled={currentPage === Math.ceil(documents.length / documentsPerPage)}
            >
              İleri
            </button>
          </div>
        </div>
      </div>
      {isAddPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600" onClick={() => setIsAddPopupOpen(false)}>
              &times;
            </button>
            <h2 className="text-xl mb-4">Yeni Belge Ekle</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Belge Adı</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={handleDocumentNameChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsAdd.documentName && <p className="text-red-500 text-xs mt-1">{formErrorsAdd.documentName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Belge Dosyası</label>
                <input
                  type="file"
                  onChange={handleDocumentFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                />
                {formErrorsAdd.documentFile && <p className="text-red-500 text-xs mt-1">{formErrorsAdd.documentFile}</p>}
              </div>
              {formErrorsAdd.general && <p className="text-red-500 text-xs mt-1">{formErrorsAdd.general}</p>}
              {Object.keys(formErrorsAdd).map(key => 
                key !== 'general' && <p key={key} className="text-red-500 text-xs mt-1">{formErrorsAdd[key]}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddPopupOpen(false)}
                  className="bg-gray-500 text-white py-1 px-3 rounded text-sm"
                >
                  Çıkış
                </button>
                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;
