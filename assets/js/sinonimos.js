/* ========================================
   SISTEMA DE INTENCIONES SEMÁNTICAS
   Archivo: assets/js/sinonimos.js
   Versión 2.0 - Con detección de intenciones
   ======================================== */

// ========================================
// INTENCIONES SEMÁNTICAS
// ========================================
const INTENCIONES = {
  // COMIDA CON DELIVERY/DOMICILIO
  'comida_delivery': {
    patterns: [
      'comida a domicilio', 'comida domicilio', 'delivery comida',
      'pedir comida', 'ordenar comida', 'comida para llevar',
      'comida llevar', 'envio comida', 'envío comida'
    ],
    categorias: ['alimentos'],
    keywords_boost: ['delivery', 'domicilio', 'llevar', 'envio'],
    score_boost: 150
  },
  
  // PIZZA/COMIDA RÁPIDA
  'comida_rapida': {
    patterns: [
      'pizza domicilio', 'pizza delivery', 'pedir pizza',
      'hamburguesa domicilio', 'tacos domicilio'
    ],
    categorias: ['alimentos'],
    subcategorias: ['Pizzerías', 'Comida Rápida', 'Taquerías'],
    score_boost: 150
  },
  
  // SERVICIOS URGENTES
  'servicios_urgentes': {
    patterns: [
      'plomero urgente', 'plomeria urgente', 'plomero 24',
      'electricista urgente', 'cerrajero urgente',
      'mecanico urgente', 'doctor urgente'
    ],
    keywords_boost: ['urgente', 'emergencia', '24', '24h', 'rapido'],
    score_boost: 100
  },
  
  // SALUD/MÉDICO
  'atencion_medica': {
    patterns: [
      'doctor urgente', 'medico urgente', 'consulta medica',
      'consulta doctor', 'necesito doctor', 'ir al doctor'
    ],
    categorias: ['salud'],
    subcategorias: ['Consultorios', 'Clínicas'],
    score_boost: 120
  },
  
  // DENTAL
  'atencion_dental': {
    patterns: [
      'dentista urgente', 'dolor muela', 'dolor diente',
      'limpieza dental', 'consulta dental', 'sacar muela'
    ],
    categorias: ['salud'],
    subcategorias: ['Dentistas'],
    keywords_boost: ['dentista', 'dental', 'dientes', 'muela'],
    score_boost: 120
  },
  
  // REPARACIONES HOGAR
  'reparacion_hogar': {
    patterns: [
      'arreglar puerta', 'reparar puerta', 'arreglar llave',
      'arreglar fuga', 'reparar fuga', 'arreglar luz',
      'reparar instalacion', 'arreglar tuberia'
    ],
    categorias: ['servicios'],
    keywords_boost: ['reparacion', 'arreglar', 'componer', 'arreglo'],
    score_boost: 100
  },
  
  // BELLEZA/CORTE
  'belleza_corte': {
    patterns: [
      'cortar pelo', 'corte cabello', 'corte pelo',
      'cortarse el pelo', 'donde me corto el pelo',
      'peluqueria', 'estética'
    ],
    categorias: ['servicios'],
    subcategorias: ['Estéticas', 'Barberías'],
    keywords_boost: ['corte', 'cabello', 'pelo', 'peinado'],
    score_boost: 100
  }
};

// ========================================
// DICCIONARIO DE SINÓNIMOS
// ========================================
const SINONIMOS = {
  
  // === COMIDA Y ALIMENTOS ===
  comida: ['food', 'comer', 'hambre', 'platillo', 'antojo', 'almorzar', 'cenar', 'desayunar', 'lonche', 'restaurant', 'restaurante'],
  pizza: ['piza', 'pissa', 'pizzeria', 'pizzería', 'italiana'],
  tacos: ['taqueria', 'taquería', 'taco', 'pastor', 'suadero', 'carnitas'],
  tortas: ['torta', 'lonche', 'sandwich', 'sándwich', 'loncheria'],
  hamburguesa: ['hamburgesa', 'burger', 'hamburguesas'],
  pollo: ['polleria', 'pollería', 'rostizado', 'rosticería'],
  mariscos: ['pescado', 'camarones', 'ceviche', 'ostiones'],
  cafe: ['café', 'cafeteria', 'cafetería', 'coffee', 'capuchino'],
  panaderia: ['panadería', 'pan', 'pasteles', 'pasteleria', 'pastelería', 'reposteria'],
  
  // === SERVICIOS ===
  plomero: ['plomeria', 'plomería', 'tuberia', 'tubería', 'fuga', 'agua'],
  electricista: ['electricidad', 'luz', 'instalacion', 'instalación', 'electrico'],
  mecanico: ['mecánico', 'taller', 'carro', 'auto', 'reparacion', 'coche'],
  carpintero: ['carpinteria', 'carpintería', 'madera', 'muebles'],
  cerrajero: ['cerrajeria', 'cerrajería', 'llaves', 'chapa', 'cerradura'],
  pintor: ['pintura', 'pintado', 'decoracion', 'decoración'],
  limpieza: ['limpiar', 'aseo', 'mucama', 'servicio domestico'],
  
  // === TECNOLOGÍA ===
  celular: ['cel', 'selu', 'telefono', 'teléfono', 'movil', 'móvil', 'smartphone', 'iphone', 'android'],
  computadora: ['compu', 'pc', 'laptop', 'computador', 'ordenador'],
  reparacion: ['reparación', 'arreglar', 'componer', 'arreglo', 'servicio', 'reparar'],
  
  // === SALUD ===
  doctor: ['dr', 'médico', 'medico', 'consulta', 'clinica', 'clínica'],
  dentista: ['dental', 'dientes', 'odontologia', 'odontología', 'muela'],
  farmacia: ['medicamento', 'medicina', 'drogueria', 'droguería'],
  veterinario: ['veterinaria', 'mascota', 'perro', 'gato', 'animal'],
  
  // === COMPRAS ===
  tienda: ['shop', 'comercio', 'negocio', 'local'],
  abarrotes: ['abarotes', 'minisuper', 'super', 'tiendita'],
  ropa: ['boutique', 'vestidos', 'moda', 'clothing'],
  zapatos: ['zapateria', 'zapatería', 'calzado', 'tenis'],
  ferreteria: ['ferretería', 'herramientas', 'construccion', 'construcción', 'material'],
  
  // === HOGAR ===
  muebles: ['muebleria', 'mueblería', 'mueble', 'sala', 'recamara'],
  jardin: ['jardín', 'jardineria', 'jardinería', 'plantas', 'pasto'],
  
  // === SERVICIOS PROFESIONALES ===
  abogado: ['abogada', 'licenciado', 'lic', 'legal', 'derecho', 'asesor'],
  contador: ['contadora', 'contabilidad', 'contador publico', 'declaraciones'],
  
  // === BELLEZA ===
  estetica: ['estética', 'salon', 'salón', 'belleza', 'peluqueria', 'peluquería'],
  barberia: ['barbería', 'barber', 'corte', 'cabello', 'pelo'],
  uñas: ['manicure', 'pedicure', 'nail'],
  
  // === ADJETIVOS COMUNES (para ignorar) ===
  bueno: ['buena', 'buenos', 'buenas', 'rico', 'rica', 'ricos', 'ricas', 'sabroso', 'delicioso'],
  barato: ['bara', 'economico', 'económico', 'accesible', 'precio'],
  rapido: ['rápido', 'veloz', 'express'],
  cerca: ['cercano', 'cercana', 'proximo', 'próximo'],
  
  // === URGENCIAS ===
  urgente: ['urgencia', 'emergencia', '24h', '24 horas', 'abierto'],
  
  // === ENVÍO Y DELIVERY ===
  domicilio: ['delivery', 'envio', 'envío', 'entregar', 'llevar', 'pedir', 'ordenar']
};

// ========================================
// STOPWORDS (palabras a ignorar)
// ========================================
const STOPWORDS = ['a', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'para', 'por', 'con', 'sin', 'mi', 'tu', 'su'];

/**
 * Detectar intención semántica en la query
 * @param {string} query - Query del usuario
 * @returns {Object|null} - Intención detectada o null
 */
function detectarIntencion(query) {
  query = query.toLowerCase().trim();
  
  for (const [nombre, intencion] of Object.entries(INTENCIONES)) {
    for (const pattern of intencion.patterns) {
      if (query.includes(pattern)) {
        console.log(`🎯 INTENCIÓN DETECTADA: ${nombre} (pattern: "${pattern}")`);
        return { nombre, ...intencion };
      }
    }
  }
  
  return null;
}

/**
 * Obtener todos los sinónimos de una palabra
 * @param {string} palabra - Palabra a buscar
 * @returns {Array} - Array de sinónimos incluyendo la palabra original
 */
function obtenerSinonimos(palabra) {
  palabra = palabra.toLowerCase().trim();
  
  // Si la palabra está como clave, devolver sus sinónimos
  if (SINONIMOS[palabra]) {
    return [palabra, ...SINONIMOS[palabra]];
  }
  
  // Si la palabra está en algún array de sinónimos, devolver toda la familia
  for (const [clave, sinonimos] of Object.entries(SINONIMOS)) {
    if (sinonimos.includes(palabra)) {
      return [clave, ...sinonimos];
    }
  }
  
  // Si no hay sinónimos, devolver solo la palabra
  return [palabra];
}

/**
 * Limpiar query de stopwords
 * @param {string} query - Query original
 * @returns {string} - Query sin stopwords
 */
function limpiarStopwords(query) {
  const palabras = query.toLowerCase().split(' ');
  const palabrasLimpias = palabras.filter(p => !STOPWORDS.includes(p));
  return palabrasLimpias.join(' ');
}

/**
 * Expandir query con sinónimos
 * @param {string} query - Búsqueda original
 * @returns {Array} - Array de términos expandidos
 */
function expandirConSinonimos(query) {
  // Limpiar stopwords primero
  query = limpiarStopwords(query);
  
  const palabras = query.toLowerCase().split(' ');
  const terminosExpandidos = new Set();
  
  palabras.forEach(palabra => {
    if (palabra.trim()) {
      const sinonimos = obtenerSinonimos(palabra);
      sinonimos.forEach(sin => terminosExpandidos.add(sin));
    }
  });
  
  return Array.from(terminosExpandidos);
}

/**
 * Verificar si una palabra es un adjetivo común (ignorable)
 * @param {string} palabra - Palabra a verificar
 * @returns {boolean}
 */
function esAdjetivoIgnorable(palabra) {
  palabra = palabra.toLowerCase();
  const adjetivosIgnorables = [
    ...SINONIMOS.bueno,
    ...SINONIMOS.barato,
    ...SINONIMOS.rapido,
    ...SINONIMOS.cerca,
    'bueno', 'barato', 'rapido', 'cerca'
  ];
  return adjetivosIgnorables.includes(palabra);
}

console.log('✅ Sistema de Intenciones Semánticas v2.0 cargado');
console.log(`🎯 ${Object.keys(INTENCIONES).length} intenciones disponibles`);
console.log(`📚 ${Object.keys(SINONIMOS).length} categorías de sinónimos disponibles`);
