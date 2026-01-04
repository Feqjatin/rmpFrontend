import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedCandidates } from '../api/Hr';

function HRSelectedApplication({ onViewDetails }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const user = useSelector((state) => state.user.userName);

  useEffect(() => {
    fetchSelectedCandidates();
  }, []);

  const fetchSelectedCandidates = async () => {
    setLoading(true);
    
    const response = await getSelectedCandidates(user);
  
    if (!response || !response.data) {
      setError("Failed to load selected candidates");
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(response.data);
      setError(null);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 rounded-xl font-sans" style={{ background: "#f9fafb" }}>
      <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-200">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Selected Candidates</h2>
        </div>

        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && selectedCandidates.length === 0 && (
          <p className="text-gray-500 text-center py-8">No selected candidates found.</p>
        )}

        {!loading && selectedCandidates.length > 0 && (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border border-gray-300">Selection ID</th>
                  <th className="px-4 py-2 border border-gray-300">Candidate Name</th>
                  <th className="px-4 py-2 border border-gray-300">Email</th>
                  <th className="px-4 py-2 border border-gray-300">Job Title</th>
                  <th className="px-4 py-2 border border-gray-300">Joining Date</th>
                  <th className="px-4 py-2 border border-gray-300">Status</th>
                  <th className="px-4 py-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedCandidates.map((candidate) => (
                  <tr key={candidate.jobCandidateSelectedId}>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {candidate.jobCandidateSelectedId}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {candidate.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {candidate.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {candidate.title}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      {candidate.joiningDate ? new Date(candidate.joiningDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <div className="flex gap-2 justify-center">
                        {candidate.isDocumentVerified && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                        {candidate.isMovedToEmpTable && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Employee
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-center">
                      <button
                        onClick={() => onViewDetails(candidate)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        See More →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HRSelectedApplication;