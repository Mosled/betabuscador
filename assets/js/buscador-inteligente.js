/* ========================================
   BUSCADOR INTELIGENTE - FASE 1
   Archivo: assets/js/buscador-inteligente.js
   Sistema de Keywords y Sinónimos
   CORREGIDO: Busca palabras completas
   ======================================== */

/**
 * BÚSQUEDA INTELIGENTE CON KEYWORDS Y SINÓNIMOS
 * Esta función reemplaza a buscarNegocios() anterior
 * 
 * @param {string} query - Término de búsqueda
 * @param {string} ubicacion - Ubicación para filtrar
 * @returns {Array} - Negocios ordenados por relevancia
 */
function buscarNegociosInteligente(query, ubicacion) {
  console.log('🧠 Búsqueda inteligente iniciada:', query);
  
  // Si no hay query, devolver todos
  if (!query || query.trim() === '') {
    console.log('📋 Query vacía, mostrando todos los negocios');
    return filtrarPorUbicacion(negociosDB, ubicacion);
  }
  
  // Normalizar query
  query = query.toLowerCase().trim();
  
  // Expandir query con sinónimos
  const terminosExpandidos = expandirConSinonimos(query);
  console.log('🔄 Términos expandidos:', terminosExpandidos);
  
  // Buscar en todos los negocios
  const negociosConScore = negociosDB.map(negocio => {
    const score = calcularScore(negocio, query, terminosExpandidos);
    return { negocio, score };
  });
  
  // Filtrar solo los que tienen score > 0
  let resultados = negociosConScore
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.negocio);
  
  // Filtrar por ubicación
  resultados = filtrarPorUbicacion(resultados, ubicacion);
  
  console.log(`✅ Encontrados ${resultados.length} resultados`);
  
  return resultados;
}

/**
 * Verificar si un término coincide como palabra completa
 * @param {string} texto - Texto donde buscar
 * @param {string} termino - Término a buscar
 * @returns {boolean} - true si encuentra coincidencia de palabra completa
 */
function coincidePalabraCompleta(texto, termino) {
  // Escapar caracteres especiales del término para regex
  const terminoEscapado = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Crear regex con límites de palabra (\b)
  // \b asegura que el término esté rodeado por límites de palabra
  const regex = new RegExp('\\b' + terminoEscapado + '\\b', 'i');
  
  return regex.test(texto);
}

/**
 * Calcular score de relevancia para un negocio
 * @param {Object} negocio - Negocio a evaluar
 * @param {string} queryOriginal - Query original del usuario
 * @param {Array} terminosExpandidos - Términos con sinónimos
 * @returns {number} - Score de relevancia
 */
function calcularScore(negocio, queryOriginal, terminosExpandidos) {
  let score = 0;
  
  const nombre = negocio.nombre.toLowerCase();
  const categoria = (negocio.categoria || '').toLowerCase();
  const subcategoria = (negocio.subcategoria || '').toLowerCase();
  const descripcion = (negocio.descripcion || '').toLowerCase();
  const keywords = negocio.keywords || [];
  
  // 1. COINCIDENCIA EXACTA EN NOMBRE (máxima prioridad)
  // Aquí sí permitimos subcadenas porque "Pizzería La Italiana" debe coincidir con "pizza"
  if (nombre.includes(queryOriginal)) {
    score += 100;
    console.log(`  ✨ [${negocio.nombre}] Coincidencia exacta en nombre: +100`);
  }
  
  // 2. COINCIDENCIA EN KEYWORDS Y OTROS CAMPOS
  terminosExpandidos.forEach(termino => {
    // Ignorar adjetivos comunes
    if (esAdjetivoIgnorable(termino)) {
      return;
    }
    
    // ===================================
    // BUSCAR EN KEYWORDS (PALABRA COMPLETA)
    // ===================================
    const keywordMatch = keywords.some(kw => {
      const kwLower = kw.toLowerCase();
      // Buscar palabra completa: "dr" NO debe coincidir con "taladro"
      return coincidePalabraCompleta(kwLower, termino);
    });
    
    if (keywordMatch) {
      score += 50;
      console.log(`  🎯 [${negocio.nombre}] Keyword match "${termino}": +50`);
    }
    
    // ===================================
    // BUSCAR EN NOMBRE (puede ser subcadena)
    // ===================================
    if (nombre.includes(termino) && !nombre.includes(queryOriginal)) {
      score += 40;
      console.log(`  📝 [${negocio.nombre}] Nombre contiene "${termino}": +40`);
    }
    
    // ===================================
    // BUSCAR EN SUBCATEGORÍA (puede ser subcadena)
    // ===================================
    if (subcategoria.includes(termino)) {
      score += 35;
      console.log(`  🏷️ [${negocio.nombre}] Subcategoría match "${termino}": +35`);
    }
    
    // ===================================
    // BUSCAR EN CATEGORÍA (puede ser subcadena)
    // ===================================
    if (categoria.includes(termino)) {
      score += 30;
      console.log(`  📂 [${negocio.nombre}] Categoría match "${termino}": +30`);
    }
    
    // ===================================
    // BUSCAR EN DESCRIPCIÓN (puede ser subcadena)
    // ===================================
    if (descripcion.includes(termino)) {
      score += 15;
      console.log(`  📄 [${negocio.nombre}] Descripción contiene "${termino}": +15`);
    }
  });
  
  // 3. BONUS POR DESTACADO (opcional, puedes quitarlo)
  if (negocio.destacado && score > 0) {
    score += 10;
  }
  
  // 4. BONUS POR RATING ALTO (opcional, puedes quitarlo)
  if (score > 0) {
    if (negocio.rating >= 4.5) {
      score += 8;
    } else if (negocio.rating >= 4.0) {
      score += 5;
    }
  }
  
  // 5. BONUS POR VERIFICADO (opcional, puedes quitarlo)
  if (negocio.verificado && score > 0) {
    score += 3;
  }
  
  return score;
}

/**
 * Filtrar negocios por ubicación
 * @param {Array} negocios - Array de negocios
 * @param {string} ubicacion - Ubicación para filtrar
 * @returns {Array} - Negocios filtrados
 */
function filtrarPorUbicacion(negocios, ubicacion) {
  if (!ubicacion || ubicacion === 'todos') {
    return negocios;
  }
  
  return negocios.filter(n => n.municipio === ubicacion);
}

/**
 * REEMPLAZAR la función buscarNegocios anterior
 * Para mantener compatibilidad con código existente
 */
function buscarNegocios(query, ubicacion) {
  return buscarNegociosInteligente(query, ubicacion);
}

console.log('✅ Buscador Inteligente FASE 1 activado');
console.log('🎯 Sistema de Keywords y Sinónimos funcionando');
console.log('🔍 Búsqueda de palabras completas en keywords');
