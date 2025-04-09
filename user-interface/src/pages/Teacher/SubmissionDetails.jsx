import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Unlock, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
//import { getSubmissionDetails, toggleSubmissionLock } from '@/api/submissions';
import moment from 'moment';

const SubmissionDetails = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockLoading, setLockLoading] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await getSubmissionDetails(submissionId);
        setSubmission(data);
      } catch (error) {
        console.error('Failed to fetch submission details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleToggleLock = async () => {
    setLockLoading(true);
    try {
      const updatedSubmission = await toggleSubmissionLock(submissionId);
      setSubmission(updatedSubmission);
    } catch (error) {
      console.error('Failed to update lock status:', error);
    } finally {
      setLockLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #4F46E5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
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
            {submission.isLocked ? 'Locked' : 'Unlocked'}
          </span>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
            <p style={{ margin: 0, color: '#111827' }}>{submission.student.branch}</p>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '4px'
            }}>Roll Number:</label>
            <p style={{ margin: 0, color: '#111827' }}>{submission.student.rollNumber}</p>
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
              {moment(submission.submittedAt).format('MMMM Do YYYY, h:mm:ss a')}
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
                {submission.status}
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#111827'
          }}>Source Code</h2>
          <div style={{
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            <SyntaxHighlighter
              language={submission.language}
              style={{
                plain: {
                  color: '#c5c8c6',
                  backgroundColor: '#1d1f21',
                },
                styles: [
                  {
                    types: ['comment'],
                    style: {
                      color: 'rgb(97, 97, 97)',
                    },
                  },
                  {
                    types: ['string', 'number', 'builtin', 'variable'],
                    style: {
                      color: 'rgb(152, 195, 121)',
                    },
                  },
                  {
                    types: ['keyword', 'operator'],
                    style: {
                      color: 'rgb(197, 134, 192)',
                    },
                  },
                  {
                    types: ['function'],
                    style: {
                      color: 'rgb(97, 174, 238)',
                    },
                  },
                ],
              }}
              showLineNumbers
              wrapLines
            >
              {submission.code}
            </SyntaxHighlighter>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
            backgroundColor: submission.isLocked ? '#4F46E5' : '#ef4444',
            color: 'white',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            ':hover': {
              backgroundColor: submission.isLocked ? '#4338ca' : '#dc2626'
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
          ) : submission.isLocked ? (
            <Unlock size={16} />
          ) : (
            <Lock size={16} />
          )}
          {submission.isLocked ? 'Unlock Submission' : 'Lock Submission'}
        </button>
      </div>
    </div>
  );
};

export default SubmissionDetails;