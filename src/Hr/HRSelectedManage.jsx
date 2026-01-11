import React, { useState } from 'react';
import HRSelectedApplication from './HRSelectedApplication';
import HRSelectedApplicationDetail from './HRSelectedApplicationDetail';
import HRDocumentDetail from './HRDocumentDetail';


function HRSelectedManage() {
  const [page, setPage] = useState(1);  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setPage(2);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setPage(3);
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
    setSelectedDocument(null);
    setPage(1);
  };

  const handleBackToDetails = () => {
    setSelectedDocument(null);
    setPage(2);
  };

  if (page === 1) {
    return <HRSelectedApplication onViewDetails={handleViewDetails} />;
  }

  if (page === 2 && selectedCandidate) {
    return (
      <HRSelectedApplicationDetail
        candidate={selectedCandidate}
        onBack={handleBackToList}
        onViewDocument={handleViewDocument}
      />
    );
  }

  if (page === 3 && selectedDocument) {
    return (
      <HRDocumentDetail
        document={selectedDocument}
        onBack={handleBackToDetails}
      />
    );
  }

  return null;
}

export default HRSelectedManage;