"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from '@/Contexts/ThemeContext';
import { useSuperAdmin } from '@/Contexts/SuperAdminContext';
import { useRouter } from "next/navigation";
import Navbar from "@/Components/Navbar";

export default function SuperAdminPage() {
  const { dark } = useTheme();
  const { setSuperAdminLoggedIn } = useSuperAdmin();
  const router = useRouter();
  
  const [airlines, setAirlines] = useState([]);
  const [expanded, setExpanded] = useState({}); 
  const [admins, setAdmins] = useState({});
  const [showAddAdmin, setShowAddAdmin] = useState({});
  const [newAdminForm, setNewAdminForm] = useState({});
  const [changingPassword, setChangingPassword] = useState({ adminId: null, airline: null });
  const [newPassword, setNewPassword] = useState("");
  const [addingAirline, setAddingAirline] = useState(false);
  const [newAirlineName, setNewAirlineName] = useState("");
  const [changingPhone, setChangingPhone] = useState({ adminId: null, airline: null });
  const [newPhone, setNewPhone] = useState("");
  const [changingEmail, setChangingEmail] = useState({ adminId: null, airline: null });
  const [newEmail, setNewEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState({ text: '', type: null });

  useEffect(() => {
    fetchAirlines();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setSuperAdminLoggedIn(true);
    }
  }, [setSuperAdminLoggedIn, isLoggedIn]);

  const fetchAirlines = async () => {
    try {
      const response = await fetch('/api/getAirlines');
      if (!response.ok) {
        throw new Error(`Error fetching airlines: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setAirlines(data);
      } else {
        console.error("Airlines data is not an array:", data);
        setAirlines([]); // Initialize with empty array if response is invalid
      }
    } catch (error) {
      console.error("Failed to fetch airlines:", error);
      setAirlines([]); // Set to empty array on error
    }
  };

  const toggleExpand = async (airline) => {
    setExpanded((prev) => ({ ...prev, [airline]: !prev[airline] }));
    if (!expanded[airline] && !admins[airline]) {
      const r = await fetch(`/api/getAdmins?airline=${encodeURIComponent(airline)}`);
      const data = await r.json();
      setAdmins((prev) => ({ ...prev, [airline]: Array.isArray(data) ? data : [] }));
    }
  };

  const toggleAddAdminForm = (airline) => {
    setShowAddAdmin((prev) => ({ ...prev, [airline]: !prev[airline] }));
    if (!newAdminForm[airline]) {
      setNewAdminForm((prev) => ({
        ...prev,
        [airline]: { firstName: "", lastName: "", email: "", phone: "", password: "" }
      }));
    }
  };

  const handleAdminInputChange = (airline, field, value) => {
    setNewAdminForm((prev) => ({
      ...prev,
      [airline]: { ...prev[airline], [field]: value }
    }));
  };

  const submitNewAdmin = async (airline) => {
    const form = newAdminForm[airline];
    const response = await fetch("/api/addAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        airline
      })
    });
    const data = await response.json();
    if (data.success) {
      setMessageWithTimeout("Admin added successfully!", 'success');
      refreshAdmins(airline);
      setNewAdminForm((prev) => ({ ...prev, [airline]: { firstName: "", lastName: "", email: "", phone: "", password: "" } }));
      setShowAddAdmin((prev) => ({ ...prev, [airline]: false }));
    } else {
      setMessageWithTimeout(data.error, 'error');
    }
  };

  const refreshAdmins = async (airline) => {
    const r = await fetch(`/api/getAdmins?airline=${encodeURIComponent(airline)}`);
    const fetchedAdmins = await r.json();
    setAdmins((prev) => ({ ...prev, [airline]: Array.isArray(fetchedAdmins) ? fetchedAdmins : [] }));
  };

  const startPasswordChange = (adminId, airline) => {
    setChangingPassword({ adminId, airline });
    setNewPassword("");
  };

  const setMessageWithTimeout = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: null }), 3000); // Clear after 3 seconds
  };

  const submitPasswordChange = async () => {
    if (!newPassword) {
      setMessageWithTimeout("Please enter a new password", 'error');
      return;
    }
    
    const response = await fetch("/api/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        adminId: changingPassword.adminId, 
        newPassword 
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setMessageWithTimeout("Password changed successfully!", 'success');
      refreshAdmins(changingPassword.airline);
      setChangingPassword({ adminId: null, airline: null });
    } else {
      setMessageWithTimeout(data.error || "Failed to change password", 'error');
    }
  };

  const handleAddAirline = async () => {
    if (!newAirlineName) {
      setMessageWithTimeout("Please enter an airline name", 'error');
      return;
    }
    
    const response = await fetch("/api/addAirline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ airlineName: newAirlineName }),
    });
    
    const data = await response.json();
    if (data.success) {
      setMessageWithTimeout("Airline added successfully!", 'success');
      fetchAirlines();
      setNewAirlineName("");
      setAddingAirline(false);
    } else {
      setMessageWithTimeout(data.error, 'error');
    }
  };

  const startPhoneChange = (adminId, airline) => {
    setChangingPhone({ adminId, airline });
    setNewPhone("");
  };

  const startEmailChange = (adminId, airline) => {
    setChangingEmail({ adminId, airline });
    setNewEmail("");
  };

  const submitPhoneChange = async () => {
    if (!newPhone) {
      setMessageWithTimeout("Please enter a new phone number", 'error');
      return;
    }
    
    const response = await fetch("/api/changeContact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        adminId: changingPhone.adminId, 
        newContact: newPhone,
        type: "phone"
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setMessageWithTimeout("Phone number changed successfully!", 'success');
      refreshAdmins(changingPhone.airline);
      setChangingPhone({ adminId: null, airline: null });
    } else {
      setMessageWithTimeout(data.error || "Failed to change phone number", 'error');
    }
  };

  const submitEmailChange = async () => {
    if (!newEmail) {
      setMessageWithTimeout("Please enter a new email address", 'error');
      return;
    }
    
    const response = await fetch("/api/changeContact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        adminId: changingEmail.adminId, 
        newContact: newEmail,
        type: "email"
      })
    });
    
    const data = await response.json();
    if (data.success) {
      setMessageWithTimeout("Email address changed successfully!", 'success');
      refreshAdmins(changingEmail.airline);
      setChangingEmail({ adminId: null, airline: null });
    } else {
      setMessageWithTimeout(data.error || "Failed to change email address", 'error');
    }
  };

  const handleDeleteAdmin = async (adminId, airline) => {
    try {
      const response = await fetch("/api/deleteAdmin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessageWithTimeout("Admin deleted successfully!", 'success');
        refreshAdmins(airline);
      } else {
        setMessageWithTimeout(data.error || "Failed to delete admin", 'error');
      }
    } catch (error) {
      console.error("Delete admin error:", error);
      setMessageWithTimeout("An error occurred while deleting the admin", 'error');
    }
  };

  const handleDeleteAirline = async (airlineName) => {
    try {
      const response = await fetch("/api/deleteAirline", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airlineName })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessageWithTimeout("Airline deleted successfully!", 'success');
        fetchAirlines();
      } else {
        setMessageWithTimeout(data.error || "Failed to delete airline", 'error');
      }
    } catch (error) {
      console.error("Delete airline error:", error);
      setMessageWithTimeout("An error occurred while deleting the airline", 'error');
    }
  };

  const handleSuperAdminLogin = async () => {
    const response = await fetch("/api/superAdminLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: loginPassword }),
    });

    const data = await response.json();

    if (data.success) {
      setIsLoggedIn(true);
    } else {
      setLoginError(data.error || "Invalid password");
    }
  };

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <Navbar />
      {/* Conditionally render login or dashboard content */}
      {!isLoggedIn ? (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto p-8 max-w-md">
            <h1 className={`text-3xl font-bold text-center ${dark ? 'text-blue-300' : 'text-blue-600'} mb-6`}>Super Admin Login</h1>
            {loginError && <div className="text-red-500 mb-4 text-center">{loginError}</div>}
            <div className="mb-6">
              <label className=" text-2xl block text-gray-500 font-bold mb-2 text-center">
                Password:
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${dark ? 'bg-gray-700 text-white' : ''} sm:w-72 mx-auto block`}
                placeholder="Enter Super Admin Password"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSuperAdminLogin}
                className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-8">
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-3xl font-bold ${dark ? 'text-blue-300' : 'text-blue-600'}`}>Super Admin Dashboard</h1>
            <button 
              onClick={() => setAddingAirline(!addingAirline)}
              className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
            >
              {addingAirline ? 'Cancel' : 'Add New Airline'}
            </button>
          </div>

          {addingAirline && (
            <div className={`mb-6 p-4 rounded ${dark ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <h2 className="text-xl font-semibold mb-3">Add New Airline</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Airline Name"
                  value={newAirlineName}
                  onChange={(e) => setNewAirlineName(e.target.value)}
                  className={`border p-2 rounded flex-1 ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
                />
                <button 
                  onClick={handleAddAirline}
                  className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
                >
                  Add Airline
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {Array.isArray(airlines) && airlines.length > 0 ? (
              airlines.map((airlineObj) => {
                const airline = airlineObj.airline_name;
                return (
                  <div 
                    key={airline} 
                    className={`p-4 rounded shadow ${dark ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center cursor-pointer" 
                        onClick={() => toggleExpand(airline)}
                      >
                        <span className={`mr-2 text-xl transition-transform ${expanded[airline] ? 'rotate-90' : ''}`}>
                          {expanded[airline] ? '▼' : '▶'}
                        </span>
                        <h2 className="text-xl font-semibold">{airline}</h2>
                      </div>
                      <button 
                        onClick={() => handleDeleteAirline(airline)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete Airline
                      </button>
                    </div>
                    
                    {expanded[airline] && (
                      <div className="mt-4 pl-4">
                        <div className="flex justify-between mb-3">
                          <h3 className="text-lg font-medium">Admins</h3>
                          <button 
                            onClick={() => toggleAddAdminForm(airline)}
                            className="bg-[#605DEC] text-white px-3 py-1 rounded-md text-sm"
                          >
                            {showAddAdmin[airline] ? 'Cancel' : '+ Add Admin'}
                          </button>
                        </div>
                        
                        {showAddAdmin[airline] && (
                          <div className={`mb-4 p-3 rounded ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="flex flex-wrap md:flex-nowrap gap-2">
                              <input
                                type="text"
                                placeholder="First Name"
                                value={(newAdminForm[airline]?.firstName) || ""}
                                onChange={(e) => handleAdminInputChange(airline, "firstName", e.target.value)}
                                className={`border p-2 rounded flex-1 sm:flex-none sm:w-40 ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                              />
                              <input
                                type="text"
                                placeholder="Last Name"
                                value={(newAdminForm[airline]?.lastName) || ""}
                                onChange={(e) => handleAdminInputChange(airline, "lastName", e.target.value)}
                                className={`border p-2 rounded flex-1 sm:flex-none sm:w-40 ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                              />
                              <input
                                type="email"
                                placeholder="Email"
                                value={(newAdminForm[airline]?.email) || ""}
                                onChange={(e) => handleAdminInputChange(airline, "email", e.target.value)}
                                className={`border p-2 rounded flex-1 sm:flex-none sm:w-52 ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                              />
                              <input
                                type="tel"
                                placeholder="Phone"
                                value={(newAdminForm[airline]?.phone) || ""}
                                onChange={(e) => handleAdminInputChange(airline, "phone", e.target.value)}
                                className={`border p-2 rounded flex-1 sm:flex-none sm:w-40 ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                              />
                              <input
                                type="password"
                                placeholder="Password"
                                value={(newAdminForm[airline]?.password) || ""}
                                onChange={(e) => handleAdminInputChange(airline, "password", e.target.value)}
                                className={`border p-2 rounded flex-1 sm:flex-none sm:w-40 ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                              />
                              <button
                                onClick={() => submitNewAdmin(airline)}
                                className="bg-[#605DEC] text-white px-4 py-2 rounded-md"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {admins[airline] && admins[airline].length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className={`min-w-full ${dark ? 'bg-gray-700' : 'bg-white'} border rounded`}>
                              <thead className={dark ? 'bg-gray-600' : 'bg-gray-50'}>
                                <tr>
                                  <th className="py-3 px-4 border-b text-center">Actions</th>
                                  <th className="py-3 px-4 border-b text-center">Name</th>
                                  <th className="py-3 px-4 border-b text-center">Email</th>
                                  <th className="py-3 px-4 border-b text-center">Phone</th>
                                  <th className="py-3 px-4 border-b text-center">Password</th>
                                  <th className="py-3 px-4 border-b text-center">Manage</th>
                                </tr>
                              </thead>
                              <tbody>
                                {admins[airline].map((admin) => (
                                  <tr key={admin.admin_id} className={dark ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                                    <td className="py-2 px-4 border-b text-center">
                                      <button
                                        onClick={() => handleDeleteAdmin(admin.admin_id, airline)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">{admin.admin_name}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                      {changingEmail.adminId === admin.admin_id ? (
                                        <input
                                          type="email"
                                          value={newEmail}
                                          onChange={(e) => setNewEmail(e.target.value)}
                                          className={`border p-1 rounded w-full text-center ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                                          placeholder="New email address"
                                          autoFocus
                                        />
                                      ) : (
                                        admin.email
                                      )}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                      {changingPhone.adminId === admin.admin_id ? (
                                        <input
                                          type="tel"
                                          value={newPhone}
                                          onChange={(e) => setNewPhone(e.target.value)}
                                          className={`border p-1 rounded w-full text-center ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                                          placeholder="New phone number"
                                          autoFocus
                                        />
                                      ) : (
                                        admin.phone_no
                                      )}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                      {changingPassword.adminId === admin.admin_id ? (
                                        <input
                                          type="password"
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          className={`border p-1 rounded w-full text-center ${dark ? 'bg-gray-600 border-gray-500' : 'bg-white'}`}
                                          placeholder="New password"
                                          autoFocus
                                        />
                                      ) : (
                                        <span>••••••••</span>
                                      )}
                                    </td>
                                    <td className="py-2 px-4 border-b text-center">
                                      <div className="flex flex-col space-y-1">
                                        {changingPassword.adminId === admin.admin_id ? (
                                          <div className="flex justify-center space-x-2">
                                            <button
                                              onClick={submitPasswordChange}
                                              className="bg-[#605DEC] text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={() => setChangingPassword({ adminId: null, airline: null })}
                                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        ) : changingPhone.adminId === admin.admin_id ? (
                                          <div className="flex justify-center space-x-2">
                                            <button
                                              onClick={submitPhoneChange}
                                              className="bg-[#605DEC] text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={() => setChangingPhone({ adminId: null, airline: null })}
                                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        ) : changingEmail.adminId === admin.admin_id ? (
                                          <div className="flex justify-center space-x-2">
                                            <button
                                              onClick={submitEmailChange}
                                              className="bg-[#605DEC] text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Save
                                            </button>
                                            <button
                                              onClick={() => setChangingEmail({ adminId: null, airline: null })}
                                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <button
                                              onClick={() => startPasswordChange(admin.admin_id, airline)}
                                              className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Change Password
                                            </button>
                                            <button
                                              onClick={() => startPhoneChange(admin.admin_id, airline)}
                                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Change Phone
                                            </button>
                                            <button
                                              onClick={() => startEmailChange(admin.admin_id, airline)}
                                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs"
                                            >
                                              Change Email
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-center py-4 italic">No admins found for this airline.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className={`text-center py-4 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                No airlines available
              </p>
            )}

            {airlines.length === 0 && (
              <div className={`p-8 rounded shadow text-center ${dark ? 'bg-gray-800' : 'bg-white'}`}>
                <p className="text-lg">No airlines found. Add one to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
