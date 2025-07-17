import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Estados para almacenar los datos del usuario, el estado de carga y cualquier error
  const [usuarioData, setUsuarioData] = useState(null);
  const [cursosData, setCursosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // *** ¡MUY IMPORTANTE! ***
  // Reemplaza esta URL con la URL de invocación REAL y COMPLETA de tu API Gateway.
  // Debe ser exactamente como la que API Gateway te dio al desplegar (ej. https://abcdef1234.execute-api.us-east-1.amazonaws.com/dev)
  const apiBaseUrl = 'https://6u4vwmix41.execute-api.us-west-2.amazonaws.com/dev'; 

  // useEffect se ejecuta después de que el componente se renderiza por primera vez.
  // Es ideal para hacer llamadas a APIs.
  useEffect(() => {
    // Función asíncrona para obtener los datos del usuario
    const fetchUserData = async () => {
      setLoading(true); // Indica que la carga ha comenzado
      setError(null); // Resetea cualquier error anterior

    try {
        // --- 1. Obtener datos de UN Usuario (la funcionalidad que ya te funciona) ---
        const userId = 'user001'; // Asegúrate que este ID exista en tu tabla UsuariosDB
        console.log(`Fetching user data for ID: ${userId} from ${apiBaseUrl}/usuarios/${userId}`);
        const userResponse = await fetch(`${apiBaseUrl}/usuarios/${userId}`); 
        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`Error fetching user! Status: ${userResponse.status} - Message: ${errorText}`);
        }
        const userData = await userResponse.json();
        console.log("User data received:", userData);
        setUsuarioData(userData);

        // --- 2. Obtener la LISTA de todos los Cursos ---
        // Llama al endpoint /cursos sin un ID específico para obtener todos
        console.log(`Fetching all courses from ${apiBaseUrl}/cursos`);
        const coursesResponse = await fetch(`${apiBaseUrl}/cursos`); 
        if (!coursesResponse.ok) {
          const errorText = await coursesResponse.text();
          throw new Error(`Error fetching courses! Status: ${coursesResponse.status} - Message: ${errorText}`);
        }
        const coursesData = await coursesResponse.json();
        console.log("Courses data received:", coursesData);
        setCursosData(coursesData); // Almacena la lista de cursos en el estado

      } catch (err) {
        // Captura cualquier error de las peticiones API
        console.error("Error during API calls:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchData(); // Ejecuta la función para obtener datos cuando el componente se monta

  }, [apiBaseUrl]); // La dependencia apiBaseUrl es por buenas prácticas

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de inscripción de cursos</h1>

        {/* Sección para mostrar los Detalles del Usuario */}
        <h2>Detalles del usuario (ID: {loading ? '...' : (error ? 'N/A' : (usuarioData ? usuarioData.usuarioId : 'N/A'))}):</h2>
        {loading && <p>Cargando datos de usuario...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {usuarioData && !loading && !error && (
          <div style={{ background: '#282c34', padding: '15px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', overflowWrap: 'break-word' }}>
            <h3 style={{ color: '#61dafb' }}>Datos de usuario recibidos:</h3>
            <pre style={{ textAlign: 'left', color: 'white', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(usuarioData, null, 2)}
            </pre>
          </div>
        )}

        <hr style={{ width: '80%', margin: '40px auto', borderColor: '#444' }} /> {/* Separador visual */}

        {/* Sección para mostrar la Lista de Cursos */}
        <h2>Cursos disponibles:</h2>
        {loading && <p>Cargando cursos...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {/* Si no hay carga, no hay error y la lista de cursos está vacía */}
        {!loading && !error && cursosData.length === 0 && <p>No se encontraron cursos en DynamoDB.</p>}

        {/* Mostrar los cursos si no hay carga ni error y hay cursos */}
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
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>**ID:** {curso.cursoId}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>**Duración:** {curso.duracionHoras} horas</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>**Precio:** ${curso.precio ? curso.precio.toFixed(2) : 'N/A'}</p>
                <p style={{ fontSize: '0.85em', color: '#ccc', lineHeight: '1.4' }}>{curso.descripcion}</p>
                {/* Aquí iría el botón "Seleccionar" o "Solicitar Información" para las siguientes funcionalidades */}
                {/* <button style={{ marginTop: '10px', padding: '8px 15px', borderRadius: '5px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer' }}>
                  Solicitar Información
                </button> */}
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