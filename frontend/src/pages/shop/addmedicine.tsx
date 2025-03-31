import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';

interface Medicine {
  medicine_name: string;
  category: string;
  price: string;
  quantity: string;
  error?: string;
}

const AddMedicine = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { medicine_name: '', category: '', price: '', quantity: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    updatedMedicines[index].error = '';
    setMedicines(updatedMedicines);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, fieldName: string) => {
    const fields = ['medicine_name', 'category', 'price', 'quantity'];
    const currentFieldIndex = fields.indexOf(fieldName);

    switch (e.key) {
      case 'Enter':
      case 'ArrowDown':
        e.preventDefault();
        const nextRowInput = document.querySelector(
          `input[data-row="${rowIndex + 1}"][data-field="${fieldName}"]`
        ) as HTMLElement;
        if (nextRowInput) {
          nextRowInput.focus();
        } else if (e.key === 'Enter') {
          addRow();
          setTimeout(() => {
            const newInput = document.querySelector(
              `input[data-row="${rowIndex + 1}"][data-field="${fieldName}"]`
            ) as HTMLElement;
            newInput?.focus();
          }, 0);
        }
        break;
      case 'ArrowRight':
        if (currentFieldIndex < fields.length - 1) {
          const nextFieldInput = document.querySelector(
            `input[data-row="${rowIndex}"][data-field="${fields[currentFieldIndex + 1]}"]`
          ) as HTMLElement;
          nextFieldInput?.focus();
        }
        break;
      case 'ArrowLeft':
        if (currentFieldIndex > 0) {
          const prevFieldInput = document.querySelector(
            `input[data-row="${rowIndex}"][data-field="${fields[currentFieldIndex - 1]}"]`
          ) as HTMLElement;
          prevFieldInput?.focus();
        }
        break;
    }
  };

  const addRow = () => {
    setMedicines([...medicines, { medicine_name: '', category: '', price: '', quantity: '' }]);
  };

  const removeRow = (index: number) => {
    if (medicines.length > 1) {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    const updatedMedicines = medicines.map(medicine => {
      if (!medicine.medicine_name.trim() || medicine.medicine_name.length < 3) {
        isValid = false;
        return { ...medicine, error: 'Medicine name must be at least 3 characters long' };
      }
      if (!medicine.category.trim() || medicine.category.length < 3) {
        isValid = false;
        return { ...medicine, error: 'Category must be at least 3 characters long' };
      }
      if (!medicine.price || isNaN(Number(medicine.price)) || Number(medicine.price) <= 0) {
        isValid = false;
        return { ...medicine, error: 'Price must be a positive number' };
      }
      if (!medicine.quantity || isNaN(Number(medicine.quantity)) || Number(medicine.quantity) < 0) {
        isValid = false;
        return { ...medicine, error: 'Quantity must be a non-negative number' };
      }
      return { ...medicine, error: '' };
    });
    setMedicines(updatedMedicines);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!validateInputs()) {
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
      const successfulMedicines: string[] = [];
      const failedMedicines: string[] = [];

      for (const medicine of medicines) {
        try {
          const response = await axios.post(
            `${backendUrl}/medicines/addmedicine`,
            {
              medicine_name: medicine.medicine_name,
              category: medicine.category,
              price: Number(medicine.price),
              quantity: Number(medicine.quantity),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.status === 201 || response.status === 200) {
            successfulMedicines.push(medicine.medicine_name);
          }
        } catch (err) {
          failedMedicines.push(medicine.medicine_name);
        }
      }

      if (failedMedicines.length === 0) {
        setSuccess('All medicines added successfully!');
        setMedicines([{ medicine_name: '', category: '', price: '', quantity: '' }]);
      } else {
        setError(`Failed to add: ${failedMedicines.join(', ')}`);
        if (successfulMedicines.length > 0) {
          setSuccess(`Successfully added: ${successfulMedicines.join(', ')}`);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process request');
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
                          {medicine.error && <p className="text-xs text-red-600">{medicine.error}</p>}
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