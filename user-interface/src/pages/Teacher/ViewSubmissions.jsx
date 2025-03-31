import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ViewSubmissions = () => {
  const { assignmentName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Decode the URL-friendly name back to readable format
  const decodedAssignmentName = decodeURIComponent(assignmentName).replace(/-/g, ' ');

  // Demo data (in a real app, you would fetch this based on the assignment name)
  const submissions = [
    { id: 1, name: "Varun Tipkari", branch: "CS", status: "Completed", submittedOn: "2025-03-30" },
    { id: 2, name: "Aniket Sardar", branch: "CS", status: "Pending", submittedOn: "2025-03-31" },
    { id: 3, name: "Jayesh Borse", branch: "CS", status: "Completed", submittedOn: "2025-03-29" },
    { id: 4, name: "Dinesh Rathod", branch: "CS", status: "Pending", submittedOn: "2025-03-31" },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case "Completed":
        return <CheckCircle size={16} color="#10B981" />;
      case "Pending":
        return <Clock size={16} color="#F59E0B" />;
      default:
        return <AlertCircle size={16} color="#EF4444" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={styles.container}
    >
      {/* Header */}
      <div style={styles.header}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
        >
          <ChevronLeft size={20} />
          Back to Assignments
        </button>
        <h2 style={styles.title}>Submissions for: {decodedAssignmentName}</h2>
      </div>

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Student Name</th>
              <th style={styles.th}>Branch</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Submitted On</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} style={styles.tableRow}>
                <td style={styles.td}>{submission.name}</td>
                <td style={styles.td}>{submission.branch}</td>
                <td style={styles.td}>
                  <div style={styles.statusCell}>
                    {getStatusIcon(submission.status)}
                    <span>{submission.status}</span>
                  </div>
                </td>
                <td style={styles.td}>{submission.submittedOn}</td>
                <td style={styles.td}>
                  <button 
                    style={styles.viewButton}
                    onClick={() => navigate(`/submission/${assignmentName}/student/${submission.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
const styles = {
  container: {
    padding: "32px",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px"
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    border: "none",
    color: "#4b5563",
    cursor: "pointer",
    fontSize: "14px",
    padding: "8px 0"
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    margin: 0
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    overflow: "hidden"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb"
  },
  th: {
    padding: "16px 24px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151"
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#f9fafb"
    }
  },
  td: {
    padding: "16px 24px",
    fontSize: "14px",
    color: "#4b5563"
  },
  statusCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  viewButton: {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#4338CA"
    }
  }
};

export default ViewSubmissions;