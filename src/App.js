import React, { useEffect, useState } from 'react';
import './App.css'; 

function App() {
  const [usuarioData, setUsuarioData] = useState(null);
  const [cursosData, setCursosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  const apiBaseUrl = 'https://6u4vwmix41.execute-api.us-west-2.amazonaws.com/dev'; 

  useEffect(() => {
    const fetchData = async () => { 
      setLoading(true);
      setError(null);   

      try { 
        const userId = 'user001'; 
        console.log(`Fetching user data for ID: ${userId} from ${apiBaseUrl}/usuarios/${userId}`);
        const userResponse = await fetch(`${apiBaseUrl}/usuarios/${userId}`); 
        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`Error fetching user! Status: ${userResponse.status} - Message: ${errorText}`);
        }
        const userData = await userResponse.json();
        console.log("User data received:", userData);
        setUsuarioData(userData);

        console.log(`Fetching all courses from ${apiBaseUrl}/cursos`);
        const coursesResponse = await fetch(`${apiBaseUrl}/cursos`); 
        if (!coursesResponse.ok) {
          const errorText = await coursesResponse.text();
          throw new Error(`Error fetching courses! Status: ${coursesResponse.status} - Message: ${errorText}`);
        }
        const coursesData = await coursesResponse.json();
        console.log("Courses data received:", coursesData);
        setCursosData(coursesData);

      } catch (err) {
        console.error("Error during API calls:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }; 

    fetchData(); 

  }, [apiBaseUrl]); 

  // Esta es la función handleRequestInfo actualizada que hace la llamada al backend.
  const handleRequestInfo = async (cursoId) => { 
    if (!userEmail) {
      alert('Por favor, ingresa tu correo electrónico antes de solicitar información.');
      return;
    }

    console.log(`Intentando solicitar información para Curso ID: ${cursoId}, con Email: ${userEmail}`);
    
    try {
      const response = await fetch(`${apiBaseUrl}/solicitar-info-curso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ // Envía los datos como JSON en el cuerpo
          cursoId: cursoId,
          email: userEmail
        })
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(`Error al solicitar información: ${response.status} - ${errorData.message || JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("Respuesta de la API:", result);
      alert(`¡Gracias! ${result.message}`); 

    } catch (err) {
      console.error("Error al hacer la solicitud de información:", err);
      alert(`Hubo un problema al procesar tu solicitud: ${err.message}`);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de inscripción de cursos</h1>
        
        <h2>Detalles del usuario:</h2>
        {loading && <p>Cargando datos de usuario...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {usuarioData && !loading && !error && (
          <div style={{ background: '#282c34', padding: '15px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', overflowWrap: 'break-word' }}>
            <h3>Información de usuario:</h3>
            <p><strong>ID de usuario:</strong> {usuarioData.usuarioId}</p>
            <p><strong>Nombre:</strong> {usuarioData.nombre}</p>
            <p><strong>Correo electrónico:</strong> {usuarioData.email}</p>
            <p><strong>Fecha de registro:</strong> {usuarioData.fechaRegistro}</p>
          </div>
        )}

        <hr style={{ width: '80%', margin: '40px auto', borderColor: '#444' }} />

        <div>
            <h2>Ingresa tu correo electrónico:</h2>
            <input
                type="email"
                placeholder="tu.correo@ejemplo.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                style={{
                    padding: '10px',
                    width: '80%',
                    maxWidth: '300px',
                    borderRadius: '5px',
                    border: '1px solid #61dafb',
                    marginBottom: '15px',
                    fontSize: '1em'
                }}
            />
        </div>

        <h2>Cursos disponibles:</h2>
        {loading && <p>Cargando cursos...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && cursosData.length === 0 && <p>No se encontraron cursos en DynamoDB.</p>}
        
        {!loading && !error && cursosData.length > 0 && (
          <div style={{ 
            background: '#282c34', 
            padding: '15px', 
            borderRadius: '8px', 
            maxWidth: '900px', 
            margin: '20px auto', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {cursosData.map(curso => (
              <div key={curso.cursoId} style={{ 
                background: '#3a3f44', 
                padding: '15px', 
                borderRadius: '5px', 
                border: '1px solid #61dafb',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}>
                <h3 style={{ color: '#61dafb', margin: '0 0 10px 0' }}>{curso.titulo}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}><strong>ID de curso:</strong> {curso.cursoId}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}><strong>Duración:</strong> {curso.duracionHoras} horas</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}><strong>Precio:</strong> ${curso.precio ? curso.precio.toFixed(2) : 'N/A'}</p>
                <p style={{ fontSize: '0.85em', color: '#ccc', lineHeight: '1.4' }}>{curso.descripcion}</p>
                
                <button 
                    onClick={() => handleRequestInfo(curso.cursoId)}
                    style={{ 
                        marginTop: '15px', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        border: 'none', 
                        background: '#007bff', 
                        color: 'white', 
                        fontSize: '1em',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
                >
                  Solicitar información
                </button>
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: '30px', fontSize: '0.9em', color: '#bbb' }}>
          ¡Tu app se está conectando a los microservicios de AWS!
        </p>
      </header>
    </div>
  );
}

export default App;