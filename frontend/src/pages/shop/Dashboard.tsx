import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';

const AddMedicine = () => {
  const [medicines, setMedicines] = useState([
    { medicine_name: '', category: '', price: '', quantity: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addRow = () => {
    setMedicines([...medicines, { medicine_name: '', category: '', price: '', quantity: '' }]);
  };

  const removeRow = (index: number) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const validateInputs = () => {
    for (const medicine of medicines) {
      if (!medicine.medicine_name.trim() || medicine.medicine_name.length < 3) {
        return 'Medicine name must be at least 3 characters long.';
      }
      if (!medicine.category.trim() || medicine.category.length < 3) {
        return 'Category must be at least 3 characters long.';
      }
      if (!medicine.price || isNaN(Number(medicine.price)) || Number(medicine.price) <= 0) {
        return 'Price must be a positive number.';
      }
      if (!medicine.quantity || isNaN(Number(medicine.quantity)) || Number(medicine.quantity) < 0) {
        return 'Quantity must be a non-negative number.';
      }
    }
    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, field: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      const fields = ['medicine_name', 'category', 'price', 'quantity'];
      const currentFieldIndex = fields.indexOf(field);
      const nextFieldIndex = currentFieldIndex + 1;
      
      // If we're at the last field of the row
      if (nextFieldIndex === fields.length) {
        // If we're at the last row, add a new row
        if (rowIndex === medicines.length - 1) {
          addRow();
        }
        // Move to the first field of the next row
        const nextRowInput = document.querySelector(`input[data-row="${rowIndex + 1}"][data-field="medicine_name"]`) as HTMLElement;
        nextRowInput?.focus();
      } else {
        // Move to the next field in the current row
        const nextInput = document.querySelector(`input[data-row="${rowIndex}"][data-field="${fields[nextFieldIndex]}"]`) as HTMLElement;
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      const backendUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

      for (const medicine of medicines) {
        await axios.post(
          `${backendUrl}/medicines/addmedicine`,
          medicine,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      setSuccess('All medicines added successfully!');
      setMedicines([{ medicine_name: '', category: '', price: '', quantity: '' }]);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to add medicines. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center">
            <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-lg font-semibold text-gray-900">Medicine Inventory</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </button>
            <button
              onClick={() => document.getElementById('inventoryForm')?.requestSubmit()}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-6 lg:px-8">
        <form id="inventoryForm" onSubmit={handleSubmit}>
          <div className="mt-2 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                        Medicine Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Price (₹)
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Quantity
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {medicines.map((medicine, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                          <input
                            type="text"
                            value={medicine.medicine_name}
                            onChange={(e) => handleInputChange(index, 'medicine_name', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'medicine_name')}
                            data-row={index}
                            data-field="medicine_name"
                            className="block w-full border-0 p-1.5 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            placeholder="Enter medicine name"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm">
                          <input
                            type="text"
                            value={medicine.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'category')}
                            data-row={index}
                            data-field="category"
                            className="block w-full border-0 p-1.5 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            placeholder="Enter category"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm">
                          <input
                            type="number"
                            value={medicine.price}
                            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'price')}
                            data-row={index}
                            data-field="price"
                            className="block w-full border-0 p-1.5 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm">
                          <input
                            type="number"
                            value={medicine.quantity}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                            data-row={index}
                            data-field="quantity"
                            className="block w-full border-0 p-1.5 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm sm:pr-6 lg:pr-8">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>

        {/* Notifications */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {error && (
            <div className="flex items-center bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-lg max-w-md">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-lg max-w-md">
              <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;