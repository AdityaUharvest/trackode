 function AddButtonCard() {
    return (
      <div style={styles.body}>
        <div style={styles.card}>
          <button style={styles.addButton}>
            <span style={styles.plus}></span>
          </button>
        </div>
      </div>
    );
  }
  
  const styles = {
    body: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
    },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '90%',
    },
    addButton: {
      position: 'relative',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#007bff',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#0056b3',
        transform: 'scale(1.1)',
        boxShadow: '0 5px 15px rgba(0,123,255,0.4)',
      },
      ':active': {
        transform: 'scale(0.95)',
      },
    },
    plus: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '30px',
      height: '4px',
      backgroundColor: 'white',
      borderRadius: '2px',
      '::before': {
        content: '""',
        position: 'absolute',
        width: '30px',
        height: '4px',
        backgroundColor: 'white',
        borderRadius: '2px',
        transform: 'rotate(90deg)',
      },
    },
  };
  
  export default AddButtonCard;