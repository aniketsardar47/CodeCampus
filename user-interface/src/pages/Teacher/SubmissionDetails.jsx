import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Unlock, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Prism } from 'prism-react-renderer';
//import { getSubmissionDetails, toggleSubmissionLock } from '@/api/submissions';
import moment from 'moment';
import { getSubmission, updateLock } from '@/api/user';
import { Center, Container } from '@chakra-ui/react';
import Loader from '@/components/Loader';
import { use } from 'react';

const SubmissionDetails = () => {
  let { id } = useParams();
  const submissionId = id.replace(':','');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockLoading, setLockLoading] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await getSubmission(token,submissionId);
        setSubmission(res.data);
      } catch (error) {
        console.error('Failed to fetch submission details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  useEffect(() => {
    console.log("Updated submission:", submission);
  }, [submission]);

  
  const handleToggleLock = async () => {
    setLockLoading(true);
    try {
      const updatedSubmission = await updateLock(token,{submissionId:submissionId,key:submission.lock ? false : true});
     setSubmission({...updatedSubmission.data});
    } catch (error) {
      console.error('Failed to update lock status:', error);
    } finally {
      setLockLoading(false);
    }
  };

  const CodeBlock = ({ code, language }) => (
    <div style={{
      backgroundColor: '#1d1f21',
      borderRadius: '6px',
      padding: '16px',
      overflow: 'auto',
      fontSize: '14px',
      lineHeight: '1.5',
      marginTop: '8px'
    }}>
      <pre style={{ margin: 0 }}>
        <code style={{
          fontFamily: "'Roboto Mono', monospace",
          display: 'block',
          color: '#c5c8c6'
        }}>
          {code}
        </code>
      </pre>
    </div>
  );

  if (loading) {
    return (
      <Container fluid h={'100vh'} bg={'white'} alignContent={'center'}>
        <Center>
          <Loader/>
        </Center>
      </Container>
    );
  }

  if (!submission) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666'
      }}>
        No submission data found
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '100%',
      height: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <button 
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#4F46E5',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          padding: '8px 12px',
          borderRadius: '6px',
          ':hover': {
            backgroundColor: '#f0f0f0'
          }
        }}
      >
        <ArrowLeft size={18} />
        Back to Submissions
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: 0,
          color: '#111827'
        }}>Submission Details</h1>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: '20px',
          backgroundColor: submission.isLocked ? '#fee2e2' : '#dcfce7',
          color: submission.isLocked ? '#b91c1c' : '#166534'
        }}>
          {submission.isLocked ? (
            <Lock size={16} />
          ) : (
            <Unlock size={16} />
          )}
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {submission.lock ? 'Locked' : 'Unlocked'}
          </span>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#111827'
        }}>Student Information</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px'
            }}>Name:</label>
            <p style={{ margin: 0, color: '#111827' }}>{submission.student.name}</p>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px'
            }}>Email:</label>
            <p style={{ margin: 0, color: '#111827' }}>{submission.student.email}</p>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px'
            }}>Branch:</label>
            <p style={{ margin: 0, color: '#111827' }}>{submission.student.department}</p>
          </div>
              
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px'
            }}>Submission Date:</label>
            <p style={{ margin: 0, color: '#111827' }}>
              {submission.status?  moment(submission.updatedAt).format('MMMM Do YYYY, h:mm:ss a'): "Not yet submitted"}
            </p>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px'
            }}>Status:</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {submission.status === 'passed' ? (
                <CheckCircle2 size={16} color="#166534" />
              ) : submission.status === 'failed' ? (
                <XCircle size={16} color="#b91c1c" />
              ) : (
                <Clock size={16} color="#d97706" />
              )}
              <span style={{
                textTransform: 'capitalize',
                color: submission.status === 'passed' ? '#166534' : 
                      submission.status === 'failed' ? '#b91c1c' : '#d97706'
              }}>
                {submission.status ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#111827'
          }}>Source Code</h2>
           <CodeBlock code={submission.code} language={submission.assignment.language} />
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#111827'
          }}>Execution Output</h2>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: "'Roboto Mono', monospace",
            margin: 0,
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            color: submission.error ? '#b91c1c' : '#111827',
            border: '1px solid #e2e8f0',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {submission.error || submission.output || 'No output available'}
          </pre>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '24px'
      }}>
        <button
          onClick={handleToggleLock}
          disabled={lockLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: submission.lock ? '#4F46E5' : '#ef4444',
            color: 'white',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: submission.lock ? '#4338ca' : '#dc2626'
            },
            ':disabled': {
              opacity: 0.7,
              cursor: 'not-allowed'
            }
          }}
        >
          {lockLoading ? (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          ) : submission.lock ? (
            <Unlock size={16} />
          ) : (
            <Lock size={16} />
          )}
          {submission.lock ? 'Unlock Submission' : 'Lock Submission'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default SubmissionDetails;