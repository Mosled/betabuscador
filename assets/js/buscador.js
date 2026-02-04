/* ========================================
   BUSCADOR DE NEGOCIOS - SISTEMA HÍBRIDO
   Archivo: assets/js/buscador.js
   Proyecto: deedpri
   ACTUALIZADO: Sistema híbrido URL + sessionStorage
   ======================================== */

// === ESPERAR A QUE EL DOM ESTÉ LISTO ===
document.addEventListener('DOMContentLoaded', function() {
  
  // === ELEMENTOS DEL DOM ===
  const searchInput = document.getElementById('searchInput');
  const voiceBtn = document.getElementById('voiceBtn');
  const locationSelect = document.getElementById('locationSelect');
  const detectBtn = document.getElementById('detectBtn');
  const exampleChips = document.querySelectorAll('.example-chip');
  const categoryCards = document.querySelectorAll('.category-card');
  const floatingCta = document.getElementById('floatingCta');

  // === BÚSQUEDA AL ESCRIBIR ===
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      if (query.length > 0) {
        console.log('Buscando:', query);
      }
    });

    // === ENTER PARA BUSCAR ===
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        console.log('Buscar (Enter):', query || 'Todos los negocios');
        realizarBusqueda(query);
      }
    });
  }

  // === CHIPS DE EJEMPLO ===
  exampleChips.forEach(chip => {
    chip.addEventListener('click', function() {
      const searchText = this.getAttribute('data-search') || this.textContent.trim();
      if (searchInput) {
        searchInput.value = searchText;
        searchInput.focus();
        console.log('Ejemplo seleccionado:', searchText);
        realizarBusqueda(searchText);
      }
    });
  });

  // === BOTÓN DE VOZ ===
  if (voiceBtn) {
    voiceBtn.addEventListener('click', function() {
      activarBusquedaVoz();
    });
  }

  // === SELECTOR DE UBICACIÓN ===
  if (locationSelect) {
    locationSelect.addEventListener('change', function(e) {
      const location = e.target.value;
      console.log('Ubicación cambiada a:', location);
      
      if (searchInput && searchInput.value.trim() !== '') {
        realizarBusqueda(searchInput.value.trim());
      }
    });
  }

  // === DETECTAR UBICACIÓN ===
  if (detectBtn) {
    detectBtn.addEventListener('click', function() {
      detectarUbicacion();
    });
  }

  // === CATEGORÍAS ===
  categoryCards.forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('data-category') || 
                      this.querySelector('.category-name').textContent.toLowerCase();
      console.log('Categoría seleccionada:', category);
      navegarACategoria(category);
    });
  });

  // === BOTÓN FLOTANTE CTA ===
  if (floatingCta) {
    floatingCta.addEventListener('click', function() {
      console.log('Abrir formulario de registro de negocio');
      window.location.href = 'paquetes.html';
    });
  }

  // === PARALLAX SUAVE AL SCROLL ===
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-search');
        if (hero) {
          hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // === LOG DE INICIALIZACIÓN ===
  console.log('✅ Buscador de negocios inicializado (sistema híbrido)');
  console.log(`📊 Total de negocios: ${typeof negociosDB !== 'undefined' ? negociosDB.length : 'no cargados'}`);
});

// === FUNCIONES PRINCIPALES ===

/**
 * Realizar búsqueda completa - SISTEMA HÍBRIDO
 * @param {string} query - Término de búsqueda
 */
function realizarBusqueda(query) {
  console.log('🔍 Realizando búsqueda híbrida:', query || 'Todos');
  
  // 1. OBTENER DATOS DE LA BÚSQUEDA
  const locationSelect = document.getElementById('locationSelect');
  const ubicacion = locationSelect ? locationSelect.value : 'todos';
  
  // 2. PREPARAR DATOS PARA CACHE
  const busquedaData = {
    query: query || '',
    ubicacion: ubicacion,
    timestamp: Date.now(),
    fuente: 'buscador_principal'
  };
  
  // 3. GUARDAR EN SESSIONSTORAGE (CACHE)
  try {
    sessionStorage.setItem('deedpri_ultima_busqueda', JSON.stringify(busquedaData));
    console.log('💾 Cache guardado en sessionStorage');
  } catch (e) {
    console.warn('⚠️ No se pudo guardar en sessionStorage:', e.message);
  }
  
  // 4. DETERMINAR MODO DE NAVEGACIÓN
  const estamosEnResultados = window.location.pathname.includes('resultados.html');
  
  if (estamosEnResultados) {
    // 4A. MODO FLUIDO: Ya estamos en resultados.html
    console.log('🔄 Actualización fluida (sin recargar)');
    
    // Usar History API para cambiar URL sin recargar
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('loc', ubicacion);
    
    // Cambiar URL en el navegador
    history.pushState(
      { query, ubicacion, timestamp: Date.now() },
      '',
      `resultados.html?${params.toString()}`
    );
    
    // Llamar a función para actualizar resultados dinámicamente
    if (typeof actualizarResultadosDinamicos === 'function') {
      actualizarResultadosDinamicos(query, ubicacion);
    } else {
      console.warn('⚠️ actualizarResultadosDinamicos no disponible, recargando...');
      window.location.href = `resultados.html?q=${encodeURIComponent(query || '')}&loc=${ubicacion}`;
    }
    
  } else {
    // 4B. MODO NORMAL: Navegar desde la página principal
    console.log('🚀 Navegación normal a resultados');
    
    const queryParam = query ? encodeURIComponent(query) : '';
    window.location.href = `resultados.html?q=${queryParam}&loc=${ubicacion}`;
  }
}

/**
 * Activar búsqueda por voz
 */
function activarBusquedaVoz() {
  const voiceBtn = document.getElementById('voiceBtn');
  const searchInput = document.getElementById('searchInput');
  
  // Verificar soporte de Web Speech API
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.warn('Búsqueda por voz no soportada en este navegador');
    alert('Tu navegador no soporta búsqueda por voz. Prueba con Chrome o Edge.');
    return;
  }

  // Animación de escucha
  if (voiceBtn) {
    voiceBtn.classList.add('listening');
  }

  console.log('🎤 Búsqueda por voz activada');
  
  // IMPLEMENTACIÓN REAL
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'es-MX';
  recognition.continuous = false;
  recognition.interimResults = false;
  
  recognition.onstart = function() {
    console.log('🎤 Escuchando...');
  };
  
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    console.log('Voz detectada:', transcript);
    if (searchInput) {
      searchInput.value = transcript;
      searchInput.focus();
    }
    realizarBusqueda(transcript);
  };
  
  recognition.onerror = function(event) {
    console.error('Error de reconocimiento de voz:', event.error);
    if (event.error === 'no-speech') {
      alert('No se detectó ninguna voz. Intenta de nuevo.');
    } else {
      alert('No se pudo capturar la voz. Intenta de nuevo.');
    }
  };
  
  recognition.onend = function() {
    if (voiceBtn) {
      voiceBtn.classList.remove('listening');
    }
  };
  
  try {
    recognition.start();
  } catch (error) {
    console.error('Error al iniciar reconocimiento:', error);
    if (voiceBtn) {
      voiceBtn.classList.remove('listening');
    }
  }
}

/**
 * Detectar ubicación del usuario con GPS
 */
function detectarUbicacion() {
  console.log('📍 Detectando ubicación...');
  
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización');
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    // Éxito
    function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      console.log('Ubicación detectada:', { lat, lng });
      
      // Determinar municipio más cercano
      const municipio = determinarMunicipioCercano(lat, lng);
      
      // Actualizar selector
      const locationSelect = document.getElementById('locationSelect');
      if (locationSelect && municipio) {
        locationSelect.value = municipio;
        alert(`📍 Ubicación detectada: ${municipio.charAt(0).toUpperCase() + municipio.slice(1)}`);
      } else {
        alert(`Ubicación detectada:\nLatitud: ${lat.toFixed(4)}\nLongitud: ${lng.toFixed(4)}`);
      }
    },
    // Error
    function(error) {
      console.error('Error de geolocalización:', error);
      let mensaje = 'No se pudo detectar tu ubicación. ';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          mensaje += 'Debes permitir el acceso a tu ubicación.';
          break;
        case error.POSITION_UNAVAILABLE:
          mensaje += 'Información de ubicación no disponible.';
          break;
        case error.TIMEOUT:
          mensaje += 'Tiempo de espera agotado.';
          break;
        default:
          mensaje += 'Error desconocido.';
      }
      
      alert(mensaje);
    },
    options
  );
}

/**
 * Determinar municipio más cercano basado en coordenadas
 * @param {number} lat - Latitud
 * @param {number} lng - Longitud
 * @returns {string} - Municipio más cercano
 */
function determinarMunicipioCercano(lat, lng) {
  // Coordenadas aproximadas de municipios
  const municipios = [
    { nombre: 'zacualtipan', lat: 20.125, lng: -98.568 },
    { nombre: 'pachuca', lat: 20.119, lng: -98.740 },
    { nombre: 'tulancingo', lat: 20.083, lng: -98.367 },
    { nombre: 'mineral-monte', lat: 20.140, lng: -98.670 },
    { nombre: 'actopan', lat: 20.267, lng: -98.933 }
  ];
  
  let cercano = null;
  let distanciaMin = Infinity;
  
  municipios.forEach(mun => {
    const distancia = Math.sqrt(
      Math.pow(lat - mun.lat, 2) + Math.pow(lng - mun.lng, 2)
    );
    if (distancia < distanciaMin) {
      distanciaMin = distancia;
      cercano = mun.nombre;
    }
  });
  
  return cercano;
}

/**
 * Navegar a página de categoría
 * @param {string} category - Nombre de la categoría
 */
function navegarACategoria(category) {
  console.log('Navegando a categoría:', category);
  
  // Obtener ubicación actual
  const locationSelect = document.getElementById('locationSelect');
  const ubicacion = locationSelect ? locationSelect.value : 'todos';
  
  // Guardar en cache
  try {
    sessionStorage.setItem('deedpri_ultima_busqueda', JSON.stringify({
      query: '',
      categoria: category,
      ubicacion: ubicacion,
      timestamp: Date.now(),
      fuente: 'categoria'
    }));
  } catch (e) {
    console.warn('⚠️ Error guardando cache categoría:', e.message);
  }
  
  // Verificar si ya estamos en resultados
  const estamosEnResultados = window.location.pathname.includes('resultados.html');
  
  if (estamosEnResultados) {
    // Modo fluido
    const params = new URLSearchParams();
    params.set('cat', category);
    params.set('loc', ubicacion);
    
    history.pushState(
      { categoria: category, ubicacion: ubicacion, timestamp: Date.now() },
      '',
      `resultados.html?${params.toString()}`
    );
    
    // Actualizar resultados
    if (typeof actualizarResultadosDinamicos === 'function') {
      // Esta función necesita aceptar 3 parámetros
      actualizarResultadosDinamicos('', category, ubicacion);
    } else {
      window.location.href = `resultados.html?cat=${category}&loc=${ubicacion}`;
    }
  } else {
    // Modo normal
    window.location.href = `resultados.html?cat=${category}&loc=${ubicacion}`;
  }
}

/**
 * Actualizar resultados dinámicamente sin recargar página
 * @param {string} query - Término de búsqueda
 * @param {string} categoria - Categoría (opcional)
 * @param {string} ubicacion - Ubicación seleccionada
 */
function actualizarResultadosDinamicos(query, categoria, ubicacion) {
  console.log('⚡ Actualizando resultados dinámicamente...', { query, categoria, ubicacion });
  
  // Si categoria es el segundo parámetro (para compatibilidad)
  if (typeof categoria === 'string' && !ubicacion) {
    ubicacion = categoria;
    categoria = '';
  }
  
  // Si no se pasa ubicación, obtener del selector
  if (!ubicacion) {
    const locationSelect = document.getElementById('locationSelect');
    ubicacion = locationSelect ? locationSelect.value : 'todos';
  }
  
  // 1. REALIZAR LA BÚSQUEDA
  let resultados = [];
  
  if (query) {
    resultados = buscarNegocios(query, ubicacion);
  } else if (categoria) {
    resultados = obtenerPorCategoria(categoria, ubicacion);
  } else {
    resultados = obtenerTodosLosNegocios(ubicacion);
  }
  
  // 2. GUARDAR EN CACHE LOS RESULTADOS
  try {
    sessionStorage.setItem('deedpri_resultados_cache', JSON.stringify({
      resultados: resultados.map(n => n.id),
      query: query,
      categoria: categoria,
      ubicacion: ubicacion,
      timestamp: Date.now()
    }));
  } catch (e) {
    console.warn('⚠️ No se pudo cachear resultados:', e.message);
  }
  
  // 3. ACTUALIZAR LA INTERFAZ (si estamos en resultados.html)
  if (typeof actualizarInterfazResultados === 'function') {
    actualizarInterfazResultados(resultados, query, categoria, ubicacion);
  } else {
    console.warn('⚠️ actualizarInterfazResultados no disponible');
    // Recargar como fallback
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (categoria) params.set('cat', categoria);
    params.set('loc', ubicacion);
    window.location.href = `resultados.html?${params.toString()}`;
  }
}

/**
 * Obtener todos los negocios (sin filtro de búsqueda)
 * @param {string} ubicacion - Ubicación para filtrar
 * @returns {Array} - Todos los negocios
 */
function obtenerTodosLosNegocios(ubicacion) {
  console.log('📋 Mostrando todos los negocios');
  
  // Verificar que negociosDB existe
  if (typeof negociosDB === 'undefined') {
    console.error('❌ negociosDB no está definido');
    return [];
  }
  
  // Si hay ubicación específica, filtrar
  if (ubicacion && ubicacion !== 'todos') {
    return negociosDB.filter(n => n.municipio === ubicacion);
  }
  
  // Si no, devolver todos
  return negociosDB;
}

/**
 * Función auxiliar para crear card de negocio
 * @param {Object} negocio - Datos del negocio
 * @returns {string} - HTML de la card
 */
function crearCardNegocio(negocio) {
  const planClass = negocio.plan || 'gratis';
  const badge = negocio.destacado ? `<div class="plan-badge ${planClass}">${
    planClass === 'premium-plus' ? '👑 PREMIUM PLUS' : 
    planClass === 'premium' ? '⭐ DESTACADO' : ''
  }</div>` : '';
  
  const rating = negocio.rating ? `
    <div class="negocio-rating">
      ${'★'.repeat(Math.floor(negocio.rating))}${'☆'.repeat(5 - Math.floor(negocio.rating))}
      <span style="color: #666;">${negocio.rating} (${negocio.reviews || 0} reseñas)</span>
    </div>
  ` : '';
  
  return `
    <div class="negocio-card ${planClass}" data-id="${negocio.id}">
      ${badge}
      <div class="negocio-grid">
        <img src="${negocio.foto}" alt="${negocio.nombre}" class="negocio-foto">
        <div class="negocio-info">
          <h3 class="negocio-nombre">${negocio.nombre}</h3>
          ${rating}
          <p class="negocio-categoria">
            <i class="fas fa-tag"></i>
            ${negocio.subcategoria || negocio.categoria}
          </p>
          <p class="negocio-direccion">
            <i class="fas fa-map-marker-alt"></i>
            ${negocio.direccion}
          </p>
        </div>
      </div>
    </div>
  `;
}

// === VERIFICAR QUE LAS FUNCIONES NECESARIAS EXISTEN ===
if (typeof buscarNegocios === 'undefined') {
  console.warn('⚠️ buscarNegocios no está definido, definiendo función básica');
  window.buscarNegocios = function(query, ubicacion) {
    console.log('🔍 Usando función de búsqueda básica');
    let resultados = typeof negociosDB !== 'undefined' ? negociosDB : [];
    
    if (query) {
      query = query.toLowerCase();
      resultados = resultados.filter(n => 
        n.nombre && n.nombre.toLowerCase().includes(query) ||
        (n.categoria && n.categoria.toLowerCase().includes(query)) ||
        (n.subcategoria && n.subcategoria.toLowerCase().includes(query))
      );
    }
    
    if (ubicacion && ubicacion !== 'todos') {
      resultados = resultados.filter(n => n.municipio === ubicacion);
    }
    
    return resultados;
  };
}

if (typeof obtenerPorCategoria === 'undefined') {
  console.warn('⚠️ obtenerPorCategoria no está definido, definiendo función básica');
  window.obtenerPorCategoria = function(categoria, ubicacion) {
    console.log('🏷️ Usando función básica de categoría');
    let resultados = typeof negociosDB !== 'undefined' ? negociosDB : [];
    
    resultados = resultados.filter(n => n.categoria === categoria);
    
    if (ubicacion && ubicacion !== 'todos') {
      resultados = resultados.filter(n => n.municipio === ubicacion);
    }
    
    return resultados;
  };
}

// === MANEJAR EVENTO POPSTATE (botón atrás/adelante) ===
window.addEventListener('popstate', function(event) {
  console.log('↩️ Evento popstate detectado');
  
  // Solo procesar si estamos en resultados.html
  if (window.location.pathname.includes('resultados.html')) {
    // Obtener parámetros actuales de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const categoria = urlParams.get('cat') || '';
    const ubicacion = urlParams.get('loc') || 'todos';
    
    console.log('📋 Parámetros popstate:', { query, categoria, ubicacion });
    
    // Actualizar resultados
    if (typeof actualizarResultadosDinamicos === 'function') {
      actualizarResultadosDinamicos(query, categoria, ubicacion);
    } else {
      console.log('🔄 Recargando página por popstate');
      window.location.reload();
    }
  }
});

// === EXPONER FUNCIONES GLOBALES ===
window.BuscadorNegocios = {
  buscar: realizarBusqueda,
  activarVoz: activarBusquedaVoz,
  detectarUbicacion: detectarUbicacion,
  navegarCategoria: navegarACategoria,
  actualizarResultados: actualizarResultadosDinamicos,
  crearCardNegocio: crearCardNegocio
};

console.log('✅ Buscador híbrido completamente cargado');