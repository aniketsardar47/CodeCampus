import React, { useState } from 'react';
import { color, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { addAssignment, fetchUserData } from '@/api/user';

const CreateAssignment = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const teacher = await fetchUserData(token);
      await addAssignment({assignor:teacher._id,title:formData.title,description:formData.description,due:formData.dueDate},token);
      alert("Assignment added!");
    }catch(error){
        console.log("Error: ",error);
        alert("Something went wrong, try again..");
    }
  };

  return (
    <div style={styles.container}>
      <motion.button
        style={styles.backButton}
        onClick={() => navigate('/teacher')}
        whileHover={{ scale: 1.05 }}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </motion.button>

      <h1 style={styles.header}>Create New Assignment</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Assignment Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            style={styles.input}
            placeholder="Enter assignment title"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description*</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{...styles.input, minHeight: '120px'}}
            placeholder="Provide detailed instructions"
            required
          />
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Due Date*</label>
            <div style={styles.dateInputContainer}>
              <Calendar size={18} style={styles.dateIcon} />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                style={styles.dateInput}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Marks</label>
            <input
              type="number"
              value={formData.maxMarks}
              onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
              style={styles.input}
              min="1"
              placeholder="100"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          style={styles.submitButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Assignment
        </motion.button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f3f4f6',
    minHeight: '100vh'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '30px',
    width: 'fit-content'
  },
  header: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '30px'
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%'
  },
  formGroup: {
    marginBottom: '20px'
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      gap: '20px'
    }
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    backgroundColor: '#F9FAFB',
    color: "black",
    '&:focus': {
      outline: 'none',
      borderColor: '#4F46E5'
    },
  },
  dateInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  dateIcon: {
    position: 'absolute',
    left: '12px',
    color: '#6B7280'
  },
  dateInput: {
    color: 'black',
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    backgroundColor: '#F9FAFB'
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '20px',
    width: '100%'
  }
};

export default CreateAssignment;