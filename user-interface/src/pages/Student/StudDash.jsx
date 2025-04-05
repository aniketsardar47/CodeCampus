import React, { useEffect, useReducer, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "@/api/user";
import { LogOut, BookOpen, User, ChevronRight, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { object } from "prop-types";
import Loader from "@/components/Loader";
import { Center, Container } from "@chakra-ui/react";
import { fetchBothAssignments } from "@/api/user";

const StudDash = () => {
  const token = localStorage.getItem('token');
  const [userdet, setUserdet] = useState();
  const [loading, setLoading] = useState(true);
  const [dataLoad, setDataLoad] = useState(true);
  const [pendingPracticals, setPendingPracticals] = useState([]);
  const [completedPracticals, setCompletedPracticals] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!token) {
          return;
        }
        console.log(token);
        const data = await fetchUserData(token);
        setUserdet(data);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    const getAssignments = async () => {
      try {
        if (!token) {
          return;
        }
        const res = await fetchBothAssignments(token);
        console.log(res);
        setPendingPracticals(res.data.pending);
        setCompletedPracticals(res.data.completed);
        console.log(pendingPracticals);
        console.log(completedPracticals);
      } catch (error) {
        console.error("Failed to load assignments:", error);
      }
    };

    getUserData();
    getAssignments();
  }, [token]);

  useEffect(() => {
    if (userdet != undefined) {
      setLoading(false);
    }
    if (pendingPracticals != undefined) {
      setDataLoad(false);
    }
  }, [userdet, pendingPracticals]);

  const navigate = useNavigate();

  const handleGoToEditor = () => {
    navigate(`/editor`);
  };

  const toggleView = () => {
    setShowCompleted(!showCompleted);
  };

  return loading ?
    <Container fluid h={'100vh'} bg={'white'} alignContent={'center'}>
      <Center><Loader /></Center>
    </Container>
    :
    <div style={styles.container}>
      {/* Sidebar with Clean Profile */}
      <motion.div
        style={styles.sidebar}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 style={styles.title}>Code Campus</h1>

          {/* Minimal Profile Section */}
          <div style={styles.profileSection}>
            <div style={styles.profileImageContainer}>
              <User style={styles.profileIcon} />
            </div>

            <h2 style={styles.profileName}>{userdet.name}</h2>
            <p style={styles.profileEmail}>{userdet.email}</p>
            <p style={styles.profileEmail}>Branch: {userdet.department}</p>

            <div style={styles.statsContainer}>
              <div style={styles.statItem}>
                <Clock style={styles.statIcon} />
                <span>{pendingPracticals.length} Pending</span>
              </div>
              <div style={styles.statItem}>
                <CheckCircle style={styles.statIcon} />
                <span>{completedPracticals.length} Completed</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div style={styles.menuSection}>
            <div
              style={showCompleted ? styles.menuItem : styles.menuItemActive}
              onClick={() => setShowCompleted(false)}
            >
              <BookOpen style={styles.menuIcon} />
              <span>Pending Assignments</span>
              <ChevronRight style={styles.menuArrow} />
            </div>
            <div
              style={showCompleted ? styles.menuItemActive : styles.menuItem}
              onClick={() => setShowCompleted(true)}
            >
              <CheckCircle style={styles.menuIcon} />
              <span>Completed</span>
              <ChevronRight style={styles.menuArrow} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          style={styles.logoutButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut style={styles.icon} />
          Sign Out
        </motion.button>
      </motion.div>

      {/* Main Content with Dark Assignment Cards */}
      {!dataLoad
        ?
        <motion.div
          style={styles.mainContent}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.headerContainer}>
            <h2 style={styles.header}>
              {showCompleted ? 'Completed Assignments' : 'Pending Assignments'}
            </h2>
            <p style={styles.subHeader}>
              {showCompleted
                ? `${completedPracticals.length} tasks completed`
                : `${pendingPracticals.length} tasks waiting for your attention`}
            </p>
          </div>

          <div style={styles.grid}>
            {(showCompleted ? completedPracticals : pendingPracticals).map((practical) => (
              <motion.div
                key={practical._id}
                style={{
                  ...styles.card,
                  backgroundColor: "#1a1a2e",
                  borderLeft: `4px solid ${showCompleted ? '#10B981' : '#EF4444'}`
                }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                transition={{ duration: 0.3 }}
              >
                <div style={styles.cardHeader}>
                  <BookOpen style={styles.cardIcon} />
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: showCompleted ? '#10B981' : '#EF4444'
                  }}>
                    {showCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>

                <h3 style={styles.cardTitle}>{practical.assignment.title}<br/>{practical.assignment.teacher }</h3>
                <div style={styles.dueDateContainer}>
                  <Clock style={styles.dueDateIcon} />
                  <span style={styles.cardDueDate}>Due: {practical.assignment.due.substring(0,10)}</span>
                </div>

                <motion.button
                  style={styles.cardButton}
                  whileHover={{ backgroundColor: "#111" }}
                  onClick={() => handleGoToEditor(practical._id)}
                >
                  {showCompleted ? 'View Assignment' : 'Open Assignment'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        : <Container fluid h={'100vh'} alignContent={'center'}>
          <Center><Loader /></Center>
        </Container>
      }
    </div>
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f3f4f6"
  },
  sidebar: {
    width: "300px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "30px",
    boxShadow: "2px 0 15px rgba(0,0,0,0.05)"
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb"
  },
  profileSection: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "30px",
    textAlign: "center"
  },
  profileImageContainer: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px"
  },
  profileIcon: {
    width: "40px",
    height: "40px",
    color: "#4b5563"
  },
  profileName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "5px"
  },
  profileEmail: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px"
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px"
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#4b5563",
    fontWeight: "500"
  },
  statIcon: {
    width: "16px",
    height: "16px"
  },
  menuSection: {
    marginBottom: "30px"
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "8px",
    cursor: "pointer",
    color: "#374151",
    backgroundColor: "#f3f4f6",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#e5e7eb"
    }
  },
  menuItemActive: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "8px",
    marginBottom: "8px",
    cursor: "pointer",
    backgroundColor: "#111827",
    color: "#fff",
    transition: "all 0.2s ease"
  },
  menuIcon: {
    width: "18px",
    height: "18px",
    marginRight: "12px"
  },
  menuArrow: {
    width: "16px",
    height: "16px",
    marginLeft: "auto"
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    fontSize: "14px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#e5e7eb"
    }
  },
  icon: {
    width: "16px",
    height: "16px"
  },
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
    backgroundColor: "#1a1a2e", // Changed to match pending color
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

export default StudDash;