import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Estados para almacenar los datos del usuario, el estado de carga y cualquier error
  const [usuarioData, setUsuarioData] = useState(null);
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
        // Define el ID del usuario de prueba.
        // *** ASEGÚRATE de que este ID exista en tu tabla UsuariosDB en DynamoDB. ***
        const userId = 'user001'; // <-- CAMBIA ESTE ID por uno que tengas en tu DynamoDB

        console.log(`Intentando obtener datos para el usuario con ID: ${userId}`);
        console.log(`URL de API Gateway: ${apiBaseUrl}/usuarios/${userId}`);

        // Realiza la petición GET a tu API Gateway
        const response = await fetch(`${apiBaseUrl}/usuarios/${userId}`); 
        
        // Verifica si la respuesta HTTP fue exitosa (código 2xx)
        if (!response.ok) {
          // Si la respuesta no es OK (ej. 404 Not Found, 500 Internal Server Error),
          // lee el cuerpo de la respuesta para obtener más detalles del error
          const errorText = await response.text(); 
          throw new Error(`Error HTTP! Estado: ${response.status} - Mensaje: ${errorText}`);
        }

        // Si la respuesta es exitosa, parsea el JSON
        const data = await response.json();
        console.log("Datos de usuario obtenidos:", data); // Muestra los datos en la consola del navegador
        setUsuarioData(data); // Actualiza el estado de React con los datos para mostrarlos en la UI

      } catch (err) {
        // Captura cualquier error que ocurra durante la petición (ej. problemas de red, errores en la Lambda)
        console.error("Error al obtener usuario:", err);
        setError(err.message); // Almacena el mensaje de error para mostrar en la UI
      } finally {
        setLoading(false); // Indica que la carga ha terminado, ya sea con éxito o con error
      }
    };

    // Llama a la función para obtener los datos del usuario cuando el componente se monta
    fetchUserData();

    // Las dependencias del useEffect. En este caso, solo se ejecuta una vez cuando el componente se monta
    // porque apiBaseUrl es constante.
  }, [apiBaseUrl]); 

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aplicación de Inscripción de Cursos</h1>
        
        <h2>Detalles del Usuario (ID: {loading ? '...' : (error ? 'N/A' : (usuarioData ? usuarioData.usuarioId : 'N/A'))}):</h2>
        
        {/* Mostrar el estado de carga */}
        {loading && <p>Cargando datos de usuario...</p>}
        
        {/* Mostrar mensaje de error si ocurre alguno */}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        
        {/* Mostrar los datos del usuario si se han cargado y no hay errores */}
        {usuarioData && !loading && !error && (
          <div style={{ background: '#282c34', padding: '15px', borderRadius: '8px', maxWidth: '600px', margin: '20px auto', overflowWrap: 'break-word' }}>
            <h3 style={{ color: '#61dafb' }}>Datos recibidos:</h3>
            {/* El tag <pre> mantiene el formato del JSON, y JSON.stringify lo hace legible */}
            <pre style={{ textAlign: 'left', color: 'white', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(usuarioData, null, 2)}
            </pre>
          </div>
        )}

        {/* Puedes añadir más secciones aquí para cursos e inscripciones,
            siguiendo un patrón similar con sus propios estados y llamadas a la API */}

        <p style={{ marginTop: '30px', fontSize: '0.9em', color: '#bbb' }}>
          ¡Tu app se está conectando a los microservicios de AWS!
        </p>
      </header>
    </div>
  );
}

export default App;