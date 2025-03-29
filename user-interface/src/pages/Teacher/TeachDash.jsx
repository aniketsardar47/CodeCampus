import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, BookOpen, User, ChevronRight, Plus, FileText } from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  // Action Components
  const AddAssignmentButton = () => (
    <motion.div
      style={styles.floatingActionButton}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/create-assignment")}
    >
      <Plus size={24} />
    </motion.div>
  );

  const ViewSubmissionsButton = ({ assignmentId }) => (
    <motion.button
      style={styles.viewSubmissionsButton}
      whileHover={{ backgroundColor: "#1E40AF" }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/submissions/${assignmentId}`)}
    >
      <FileText size={16} />
      View Submissions
    </motion.button>
  );

  const EmptyState = () => (
    <div style={styles.emptyState}>
      <div style={styles.emptyIllustration}>
        <BookOpen size={48} color="#9CA3AF" />
      </div>
      <h3 style={styles.emptyTitle}>No Assignments Created Yet</h3>
      <p style={styles.emptyText}>Get started by creating your first assignment</p>
      <AddAssignmentButton />
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <motion.div 
        style={styles.sidebar}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 style={styles.title}>Teacher Portal</h1>

          {/* Profile Section */}
          <div style={styles.profileSection}>
            <div style={styles.profileImageContainer}>
              <User style={styles.profileIcon} />
            </div>
            
            <h2 style={styles.profileName}>Dr. Sarah Wilson</h2>
            <p style={styles.profileEmail}>s.wilson@university.edu</p>
          </div>

          {/* Navigation Menu */}
          <div style={styles.menuSection}>
            <div style={styles.menuItemActive}>
              <BookOpen style={styles.menuIcon} />
              <span>Assignments</span>
              <ChevronRight style={styles.menuArrow} />
            </div>
            <div style={styles.menuItem}>
              <FileText style={styles.menuIcon} />
              <span>Submissions</span>
              <ChevronRight style={styles.menuArrow} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button 
          onClick={() => navigate("/login")}
          style={styles.logoutButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut style={styles.icon} />
          Sign Out
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={styles.mainContent}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerContainer}>
          <h2 style={styles.header}>Assignment Management</h2>
          <motion.button
            style={styles.createButton}
            whileHover={{ backgroundColor: "#4338CA" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/create-assignment")}
          >
            <Plus size={18} />
            Create Assignment
          </motion.button>
        </div>

        {/* Empty State */}
        <EmptyState />

        {/* Floating Action Button */}
        <AddAssignmentButton />
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f3f4f6"
  },

  sidebar: {
    width: "280px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px",
    boxShadow: "2px 0 10px rgba(0,0,0,0.05)"
  },

  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "32px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb"
  },

  profileSection: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    textAlign: "center"
  },

  profileImageContainer: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px"
  },

  profileIcon: {
    width: "32px",
    height: "32px",
    color: "#4b5563"
  },

  profileName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "4px"
  },

  profileEmail: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "16px"
  },

  menuSection: {
    marginBottom: "24px"
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#f3f4f6"
    }
  },

  menuItemActive: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "8px",
    cursor: "pointer",
    backgroundColor: "#111827",
    color: "#fff"
  },

  menuIcon: {
    width: "18px",
    height: "18px",
    marginRight: "12px"
  },

  menuArrow: {
    width: "16px",
    height: "16px",
    marginLeft: "auto",
    color: "#9ca3af"
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    fontSize: "14px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500"
  },

  mainContent: {
    flex: 1,
    padding: "32px",
    backgroundColor: "#f3f4f6",
    position: "relative"
  },

  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },

  header: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827"
  },

  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#4F46E5",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  },

  floatingActionButton: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    backgroundColor: "#4F46E5",
    color: "white",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "none",
    boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100
  },

  viewSubmissionsButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    textAlign: "center"
  },

  emptyIllustration: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px"
  },

  emptyTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px"
  },

  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px"
  }
};

export default TeacherDashboard;