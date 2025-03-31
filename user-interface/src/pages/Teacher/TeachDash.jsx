import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut, BookOpen, User, ChevronRight, Plus, FileText, Clock } from "lucide-react";
import Loader from "@/components/Loader";
import { fetchAssignment, fetchUserData } from "@/api/user";
import { Container, Center } from "@chakra-ui/react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userdet, setUserdet] = useState();
  const [assignments, setAssignments] = useState();
  const [loading, setLoading] = useState(true);
  const [assLoad, setAssLoad] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!token) return;
        const data = await fetchUserData(token);
        setUserdet(data);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    const getAssignments = async () => {
      try {
        if (!token) return;
        const res = await fetchAssignment(token);
        setAssignments(res.data);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      }
    };

    getUserData();
    getAssignments();
  }, [token]);

  useEffect(() => {
    if (userdet != undefined) setLoading(false);
    if (assignments != undefined) setAssLoad(false);
  }, [userdet, assignments]);

  const dataArrivalCheck = () => {
    if (assignments.length !== 0) {
      return (
        <motion.div
          style={styles.mainContent}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.grid}>
            {assignments.map((assignment) => (
              <motion.div
                key={assignment._id}
                style={{
                  ...styles.card,
                  borderLeft: `4px solid rgba(239, 68, 68, 0.2)`
                }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div style={styles.cardHeader}>
                  <BookOpen style={styles.cardIcon} />
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: 'rgba(0,0,0,0.3)'
                  }}>
                    {assignment.status}
                  </span>
                </div>

                <h3 style={styles.cardTitle}>{assignment.title}</h3>

                <div style={styles.dueDateContainer}>
                  <Clock style={styles.dueDateIcon} />
                  <span style={styles.cardDueDate}>Due: {assignment.due.substring(0, 10)}</span>
                </div>

                <motion.button
                  style={styles.cardButton}
                  whileHover={{ backgroundColor: "#111" }}
                  onClick={() => navigate(`/submission/${encodeURIComponent(assignment.title.toLowerCase().replace(/\s+/g, '-'))}`)}
                >
                  View Submissions
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    } else {
      return <EmptyState />;
    }
  };

  const EmptyState = () => (
    <div style={styles.emptyState}>
      <div style={styles.emptyIllustration}>
        <BookOpen size={48} color="#9CA3AF" />
      </div>
      <h3 style={styles.emptyTitle}>No Assignments Created Yet</h3>
      <p style={styles.emptyText}>Get started by creating your first assignment</p>
    </div>
  );

  return loading ? (
    <Container fluid h={'100vh'} bg={'white'} alignContent={'center'}>
      <Center><Loader /></Center>
    </Container>
  ) : (
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

          <div style={styles.profileSection}>
            <div style={styles.profileImageContainer}>
              <User style={styles.profileIcon} />
            </div>

            <h2 style={styles.profileName}>Prof. {userdet.name}</h2>
            <p style={styles.profileEmail}>{userdet.email}</p>
            <p style={styles.profileEmail}>Department: {userdet.department}</p>
            <p style={styles.profileEmail}>Lab Incharge: {userdet.Lab}</p>
          </div>

          <div style={styles.menuSection}>
            <div style={styles.menuItemActive}>
              <BookOpen style={styles.menuIcon} />
              <span>Assignments</span>
              <ChevronRight style={styles.menuArrow} />
            </div>
          </div>
        </div>

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
        style={styles.main}
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
            onClick={() => navigate("/add-assignment")}
          >
            <Plus size={18} />
            Create Assignment
          </motion.button>
        </div>

        {!assLoad ? dataArrivalCheck() : <Loader />}
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

  main: {
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
  },
  /* Main Content */
  mainContent: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#f3f4f6"
  },

  headerContainer: {
    marginBottom: "30px"
  },

  header: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px"
  },

  subHeader: {
    fontSize: "14px",
    color: "#6b7280"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px"
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: "8px",
    padding: "20px",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden"
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },

  cardIcon: {
    width: "24px",
    height: "24px",
    color: "#9ca3af"
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#fff"
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#fff"
  },

  dueDateContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px"
  },

  dueDateIcon: {
    width: "16px",
    height: "16px",
    color: "#9ca3af"
  },

  cardDueDate: {
    fontSize: "14px",
    color: "#9ca3af"
  },

  cardButton: {
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    marginTop: "auto",
    transition: "all 0.2s ease"
  }
};

export default TeacherDashboard;