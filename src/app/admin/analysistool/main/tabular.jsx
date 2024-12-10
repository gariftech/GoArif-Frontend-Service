"use client";

import { useState } from 'react';

const Tabular = () => {
  const [file, setFile] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [targetVariable, setTargetVariable] = useState('');
  const [columnsForAnalysis, setColumnsForAnalysis] = useState(''); // Set initial value to an empty string
  const [columnOptions, setColumnOptions] = useState([]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseFile(uploadedFile);
    }
  };

  const parseFile = (uploadedFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      const isCSV = uploadedFile.name.endsWith('.csv');
      
      if (isCSV) {
        const lines = data.split('\n');
        const headers = lines[0].split(','); // Assuming the first row contains headers
        setColumnOptions(headers);
      } else {
        alert('Please upload a CSV file');
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      file,
      customQuestion,
      apiKey,
      targetVariable,
      columnsForAnalysis,
    });
  };

  return (
    <div className="w-full mx-auto px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Input (CSV or Excel) */}
        <div>
          <label htmlFor="file" className="block text-lg font-medium">Upload CSV or Excel File</label>
          <input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Custom Question Input */}
        <div>
          <label htmlFor="custom_question" className="block text-lg font-medium">Custom Question</label>
          <input
            id="custom_question"
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        {/* Target Variable Input */}
        {/* <div>
          <label htmlFor="target_variable" className="block text-lg font-medium">Target Variable</label>
          <input
            id="target_variable"
            type="text"
            value={targetVariable}
            onChange={(e) => setTargetVariable(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div> */}

        {/* Columns for Analysis (Select) */}
        <div>
          <label htmlFor="columns_for_analysis" className="block text-lg font-medium">Select Target Variable</label>
          <select
            id="target_variable"
            value={targetVariable} // Should be a scalar value (string)
            onChange={(e) => setTargetVariable(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            required
          >
            <option value="">Select a column</option>
            {columnOptions.map((column, index) => (
              <option key={index} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white-500 rounded-lg hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tabular;
