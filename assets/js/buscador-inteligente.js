/* ========================================
   BUSCADOR INTELIGENTE V2.0
   Archivo: assets/js/buscador-inteligente.js
   Sistema de Intenciones + Scoring por Categorías
   ======================================== */

/**
 * BÚSQUEDA INTELIGENTE CON INTENCIONES SEMÁNTICAS
 * 
 * @param {string} query - Término de búsqueda
 * @param {string} ubicacion - Ubicación para filtrar
 * @returns {Array} - Negocios ordenados por relevancia
 */
function buscarNegociosInteligente(query, ubicacion) {
  console.log('🧠 Búsqueda inteligente V2.0:', query);
  
  // Si no hay query, devolver todos
  if (!query || query.trim() === '') {
    console.log('📋 Query vacía, mostrando todos los negocios');
    return filtrarPorUbicacion(negociosDB, ubicacion);
  }
  
  // Normalizar query
  query = query.toLowerCase().trim();
  
  // 🎯 PASO 1: Detectar intención semántica
  const intencion = detectarIntencion(query);
  
  if (intencion) {
    console.log(`🎯 INTENCIÓN: ${intencion.nombre}`);
    console.log(`   Categorías objetivo:`, intencion.categorias);
    console.log(`   Score boost: +${intencion.score_boost}`);
  }
  
  // 🔄 PASO 2: Expandir query con sinónimos
  const terminosExpandidos = expandirConSinonimos(query);
  console.log('🔄 Términos expandidos:', terminosExpandidos);
  
  // 📊 PASO 3: Calcular scores con sistema de intenciones
  const negociosConScore = negociosDB.map(negocio => {
    const score = calcularScoreConIntencion(negocio, query, terminosExpandidos, intencion);
    return { negocio, score };
  });
  
  // 🎯 PASO 4: Filtrar y ordenar
  let resultados = negociosConScore
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.negocio);
  
  // 📍 PASO 5: Filtrar por ubicación
  resultados = filtrarPorUbicacion(resultados, ubicacion);
  
  console.log(`✅ ${resultados.length} resultados encontrados`);
  
  // Mostrar top 3 con sus scores para debug
  if (resultados.length > 0) {
    console.log('🏆 Top 3 resultados:');
    negociosConScore
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.negocio.nombre} (${item.negocio.categoria}) - Score: ${item.score}`);
      });
  }
  
  return resultados;
}

/**
 * Calcular score con sistema de intenciones y categorías
 * @param {Object} negocio - Negocio a evaluar
 * @param {string} queryOriginal - Query original del usuario
 * @param {Array} terminosExpandidos - Términos con sinónimos
 * @param {Object|null} intencion - Intención detectada
 * @returns {number} - Score de relevancia
 */
function calcularScoreConIntencion(negocio, queryOriginal, terminosExpandidos, intencion) {
  let score = 0;
  
  const nombre = negocio.nombre.toLowerCase();
  const categoria = (negocio.categoria || '').toLowerCase();
  const subcategoria = (negocio.subcategoria || '').toLowerCase();
  const descripcion = (negocio.descripcion || '').toLowerCase();
  const keywords = negocio.keywords || [];
  
  // ========================================
  // 🎯 BONUS POR INTENCIÓN (ANTES DE TODO)
  // ========================================
  let intentionMatch = false;
  
  if (intencion) {
    // Verificar si la categoría del negocio coincide con la intención
    if (intencion.categorias && intencion.categorias.includes(categoria)) {
      score += intencion.score_boost;
      intentionMatch = true;
      console.log(`  🎯 [${negocio.nombre}] Categoría match con intención: +${intencion.score_boost}`);
    }
    
    // Verificar si la subcategoría coincide
    if (intencion.subcategorias) {
      const subcatMatch = intencion.subcategorias.some(sub => 
        subcategoria.toLowerCase().includes(sub.toLowerCase())
      );
      if (subcatMatch) {
        score += intencion.score_boost;
        intentionMatch = true;
        console.log(`  🎯 [${negocio.nombre}] Subcategoría match con intención: +${intencion.score_boost}`);
      }
    }
    
    // Boost por keywords de la intención
    if (intencion.keywords_boost && intentionMatch) {
      intencion.keywords_boost.forEach(kw => {
        const hasKeyword = keywords.some(k => k.toLowerCase() === kw.toLowerCase());
        if (hasKeyword) {
          score += 30;
          console.log(`  ⚡ [${negocio.nombre}] Keyword boost "${kw}": +30`);
        }
      });
    }
  }
  
  // Si hay intención pero NO coincide la categoría, penalizar fuertemente
  if (intencion && !intentionMatch) {
    // Si la intención es específica de una categoría y este negocio no es de esa categoría,
    // reducir score drásticamente
    if (intencion.categorias && intencion.categorias.length > 0) {
      // Solo permitir puntos si hay coincidencias MUY fuertes en nombre
      const coincidenciaNombreFuerte = nombre.includes(queryOriginal);
      if (!coincidenciaNombreFuerte) {
        console.log(`  ❌ [${negocio.nombre}] No coincide con intención, penalización severa`);
        // No retornar 0 todavía, pero marcar para penalización
        score -= 1000; // Penalización temporal
      }
    }
  }
  
  // ========================================
  // 1. COINCIDENCIA EXACTA EN NOMBRE
  // ========================================
  if (nombre.includes(queryOriginal)) {
    score += 100;
    console.log(`  ✨ [${negocio.nombre}] Coincidencia exacta en nombre: +100`);
  }
  
  // ========================================
  // 2. BÚSQUEDA EN KEYWORDS Y OTROS CAMPOS
  // ========================================
  terminosExpandidos.forEach(termino => {
    // Ignorar adjetivos comunes
    if (esAdjetivoIgnorable(termino)) {
      return;
    }
    
    // KEYWORDS (palabra completa)
    const keywordMatch = keywords.some(kw => {
      const kwLower = kw.toLowerCase();
      return coincidePalabraCompleta(kwLower, termino);
    });
    
    if (keywordMatch) {
      score += 50;
      console.log(`  🎯 [${negocio.nombre}] Keyword match "${termino}": +50`);
    }
    
    // NOMBRE (puede ser subcadena)
    if (nombre.includes(termino) && !nombre.includes(queryOriginal)) {
      score += 40;
      console.log(`  🔍 [${negocio.nombre}] Nombre contiene "${termino}": +40`);
    }
    
    // SUBCATEGORÍA
    if (subcategoria.includes(termino)) {
      score += 35;
      console.log(`  🏷️ [${negocio.nombre}] Subcategoría match "${termino}": +35`);
    }
    
    // CATEGORÍA
    if (categoria.includes(termino)) {
      score += 30;
      console.log(`  📂 [${negocio.nombre}] Categoría match "${termino}": +30`);
    }
    
    // DESCRIPCIÓN (menor peso)
    if (descripcion.includes(termino)) {
      score += 10; // Reducido de 15 a 10
      console.log(`  📄 [${negocio.nombre}] Descripción contiene "${termino}": +10`);
    }
  });
  
  // ========================================
  // 3. BONUS FINALES (solo si tiene score positivo)
  // ========================================
  if (score > 0) {
    // Bonus por destacado
    if (negocio.destacado) {
      score += 5;
    }
    
    // Bonus por rating alto
    if (negocio.rating >= 4.5) {
      score += 5;
    } else if (negocio.rating >= 4.0) {
      score += 3;
    }
    
    // Bonus por verificado
    if (negocio.verificado) {
      score += 2;
    }
  }
  
  // Si el score es negativo (por penalización), devolver 0
  return Math.max(0, score);
}

/**
 * Verificar si un término coincide como palabra completa
 * @param {string} texto - Texto donde buscar
 * @param {string} termino - Término a buscar
 * @returns {boolean}
 */
function coincidePalabraCompleta(texto, termino) {
  const terminoEscapado = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('\\b' + terminoEscapado + '\\b', 'i');
  return regex.test(texto);
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
 * Wrapper para compatibilidad con código anterior
 */
function buscarNegocios(query, ubicacion) {
  return buscarNegociosInteligente(query, ubicacion);
}

console.log('✅ Buscador Inteligente V2.0 activado');
console.log('🎯 Sistema de Intenciones Semánticas');
console.log('📊 Scoring por Categorías implementado');
console.log('🔍 Búsqueda contextual activada');
