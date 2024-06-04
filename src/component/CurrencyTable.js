

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SecureStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CurrencyTable = () => {
        // State değişkenleri tanımlanıyor
    const [baseCurrency, setBaseCurrency] = useState('USD');
    const [exchangeRates, setExchangeRates] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = SecureStorage.getItem('token'); // Token'ı al

    const targetCurrencies = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'TRY'];
    
    useEffect(() => {
                // Döviz kurlarını sunucudan almak için fonksiyon tanımlanıyor
        const fetchExchangeRates = async () => {
            debugger
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://localhost:7064/api/getMultipleExchangeRates`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Authorization header ekle
                    },
                    params: {
                        baseCurrency: baseCurrency,
                        targetCurrencies: targetCurrencies.join(',') // targetCurrencies'i doğru şekilde formatla
                    }
                });
                console.log('API Response:', response.data); // API yanıtını konsola yazdır
                setExchangeRates(response.data.rates); // Döviz kurları state'e kaydediliyor
                toast.success('Döviz kurları başarıyla yüklendi');
            } catch (err) {
                setError(err.message);
                toast.error('Döviz kurları alınırken hata oluştu');
            }
            setLoading(false);
        };

        fetchExchangeRates();
    }, [baseCurrency, token]);
    

        // Base currency değişikliğini izleyen fonksiyon
    const handleBaseCurrencyChange = (e) => {
        setBaseCurrency(e.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
            <ToastContainer />
            <div className="w-full max-w-4xl px-4">
                <div className="flex items-center w-full py-4 bg-green-200 text-white px-4">
                    <button onClick={() => navigate('/success')} className="text-lg font-semibold mr-4">Anasayfa</button>
                    <button onClick={() => navigate('/documents')} className="text-lg font-semibold">Belgeler</button>
                    <button onClick={() => navigate('/currency')} className="text-lg font-semibold ml-4">Güncel Kurlar</button>
                </div>
                <h1 className="text-3xl font-bold mb-5 text-center mt-5">Döviz Kurları</h1>
                <div className="mb-5 flex justify-end space-x-2">
                    <div className="flex items-center">
                        <label htmlFor="baseCurrency" className="mr-2">Base Currency: </label>
                        <select id="baseCurrency" value={baseCurrency} onChange={handleBaseCurrencyChange} className="bg-white border border-gray-300 rounded px-2 py-1">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="JPY">JPY</option>
                            <option value="AUD">AUD</option>
                            <option value="TRY">TRY</option>
                        </select>
                    </div>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 mx-auto text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                                    <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {targetCurrencies.map((currency) => (
                                    <tr key={currency}>
                                        <td className="px-2 py-2 whitespace-nowrap">{currency}</td>
                                        <td className="px-2 py-2 whitespace-nowrap">{exchangeRates[currency]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyTable;
