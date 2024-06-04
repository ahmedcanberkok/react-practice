import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SecureStorage from "react-secure-storage";
import { jwtDecode } from "jwt-decode";

function Login() {
  // useState hook'ları ile state değişkenleri tanımlanıyor.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  const navigate = useNavigate(); // Navigate için useNavigate hook'u kullanılıyor.

  // Login formunun submit edilmesi
  const handleSubmit = async (e) => {
    e.preventDefault(); // Form submit edildiğinde sayfanın yeniden yüklenmesini engeller
    try {
      const response = await axios.post("https://localhost:7064/Auth/login", {
        username: username,
        password: password,

        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (data.token) {
        // Token varsa, SecureStorage kullanılarak token ve kullanıcı bilgileri saklanıyor
        SecureStorage.setItem("token", data.token);
        const decodedToken = jwtDecode(data.token);
        SecureStorage.setItem("username", decodedToken.username);
        SecureStorage.setItem("userId", decodedToken.userId);
        toast.success("Giriş Başarılı", {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/success"); // Başarılı giriş sonrası yönlendirme
        }, 1000);
      } else {
        toast.error(`Giriş Başarısız: ${data}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      if (error.response) {
        // Hata yönetimi
        console.error("Server responded with a status:", error.response.status);
        console.error("Error details:", error.response.data);
        toast.error(`Giriş Başarısız: ${error.response.data}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Giriş Başarısız: Sunucudan yanıt alınamadı", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error(`Giriş Başarısız: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Register formunun submit edilmesi
  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!registerUsername) {
      errors.username = "Username boş bırakılamaz.";
    } else if (registerUsername.length < 3) {
      errors.username = "Username 3 karakterden az olamaz.";
    }
    if (!registerPassword) {
      errors.password = "Password boş bırakılamaz.";
    }
    setRegisterErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Hata varsa kayıt işlemi durdurulur
    }

    try {
      const response = await axios.post(
        "https://localhost:7064/Auth/register",
        {
          username: registerUsername,
          password: registerPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Kayıt Başarılı", {
        position: "top-right",
        autoClose: 1000,
      });
      setIsRegisterPopupOpen(false);
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterErrors({});
    } catch (error) {
      if (error.response) {
        toast.error(`Kayıt Başarısız: ${error.response.data}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.request) {
        toast.error("Kayıt Başarısız: Sunucudan yanıt alınamadı", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Kayıt Başarısız: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setIsRegisterPopupOpen(true)}
          className="w-full bg-green-500 text-white py-2 rounded mt-2"
        >
          Register
        </button>
      </form>

      {isRegisterPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setIsRegisterPopupOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl mb-4">Register</h2>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                {registerErrors.username && (
                  <p className="text-red-500 text-xs">
                    {registerErrors.username}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                {registerErrors.password && (
                  <p className="text-red-500 text-xs">
                    {registerErrors.password}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                >
                  Kayıt Ol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Login;