import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { userManagementService } from '../../services/userManagementService';
import { Upload, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BulkUserImport = ({ onComplete, performedByUid }) => {
  const [csvData, setCsvData] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
      const row = {};
      headers.forEach((h, j) => {
        row[h] = values[j] || '';
      });
      rows.push(row);
    }

    return rows;
  };

  const validateRows = (rows) => {
    const errors = [];
    rows.forEach((row, i) => {
      const rowErrors = [];
      if (!row.email && !row['email address']) rowErrors.push('Missing email');
      if (!row.name && !row['first name'] && !row['first_name']) rowErrors.push('Missing name');
      if (rowErrors.length > 0) {
        errors.push({ row: i + 2, errors: rowErrors });
      }
    });
    return errors;
  };

  const mapRowToUser = (row) => {
    const firstName = row['first name'] || row['first_name'] || row.name?.split(' ')[0] || '';
    const lastName = row['last name'] || row['last_name'] || row.name?.split(' ').slice(1).join(' ') || '';
    return {
      firstName: { en: firstName, si: '', ta: '' },
      lastName: { en: lastName, si: '', ta: '' },
      displayName: `${firstName} ${lastName}`.trim(),
      email: row.email || row['email address'] || '',
      employeeId: row['employee id'] || row['employee_id'] || row.id || '',
      phone: row.phone || row['phone number'] || '',
      mobile: row.mobile || '',
      department: row.department || row.division || '',
      role: row.role || 'support_staff',
      designation: { en: row.designation || row.title || row.position || '', si: '', ta: '' },
      grade: row.grade || '',
    };
  };

  const onDrop = useCallback((files) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvData(text);
      const rows = parseCSV(text);
      setParsedRows(rows);
      setValidationErrors(validateRows(rows));
      setResults(null);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast.error('Please fix validation errors first');
      return;
    }

    setImporting(true);
    try {
      const usersToImport = parsedRows.map(mapRowToUser);
      const result = await userManagementService.bulkImportUsers(usersToImport, performedByUid);
      setResults(result.data);
      if (result.data.imported > 0) {
        toast.success(`${result.data.imported} users imported`);
      }
      if (result.data.failed > 0) {
        toast.error(`${result.data.failed} users failed to import`);
      }
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {!csvData && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            isDragActive ? 'border-[#0066CC] bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">
            {isDragActive ? 'Drop CSV file here' : 'Drag & drop a CSV file, or click to select'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Required columns: name/first name, email. Optional: employee id, department, role, designation, phone
          </p>
        </div>
      )}

      {/* Preview */}
      {parsedRows.length > 0 && !results && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{parsedRows.length} rows found</span>
              {validationErrors.length > 0 && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.length} errors
                </span>
              )}
            </div>
            <button
              onClick={() => { setCsvData(null); setParsedRows([]); setValidationErrors([]); }}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear
            </button>
          </div>

          {/* Preview Table */}
          <div className="max-h-48 overflow-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-500">#</th>
                  {Object.keys(parsedRows[0]).slice(0, 5).map(key => (
                    <th key={key} className="px-3 py-2 text-left font-medium text-slate-500 capitalize">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.slice(0, 10).map((row, i) => {
                  const hasError = validationErrors.some(e => e.row === i + 2);
                  return (
                    <tr key={i} className={hasError ? 'bg-red-50/50' : ''}>
                      <td className="px-3 py-1.5 text-slate-400">{i + 1}</td>
                      {Object.values(row).slice(0, 5).map((val, j) => (
                        <td key={j} className="px-3 py-1.5 text-slate-700">{val || '—'}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleImport}
            disabled={importing || validationErrors.length > 0}
            className="w-full py-2.5 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import {parsedRows.length} Users
              </>
            )}
          </button>
        </>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {results.imported > 0 && (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{results.imported} imported</span>
              </div>
            )}
            {results.failed > 0 && (
              <div className="flex items-center gap-1.5 text-red-600">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{results.failed} failed</span>
              </div>
            )}
          </div>

          {results.errors?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-700 mb-1">Failed rows:</p>
              {results.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600">{err.user}: {err.error}</p>
              ))}
            </div>
          )}

          <button
            onClick={() => { onComplete?.(); setCsvData(null); setParsedRows([]); setResults(null); }}
            className="px-4 py-2 bg-[#003366] text-white rounded-lg text-sm font-medium"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUserImport;
