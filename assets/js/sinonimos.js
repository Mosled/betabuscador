/* ========================================
   DICCIONARIO DE SINÓNIMOS
   Archivo: assets/js/sinonimos.js
   Fase 1 del Buscador Inteligente
   ======================================== */

const SINONIMOS = {
  
  // === COMIDA Y ALIMENTOS ===
  comida: ['food', 'comer', 'hambre', 'platillo', 'antojo', 'almorzar', 'cenar', 'desayunar', 'lonche'],
  pizza: ['piza', 'pissa', 'pizzeria', 'pizzería', 'italiana'],
  tacos: ['taqueria', 'taquería', 'taco', 'pastor', 'suadero', 'carnitas'],
  tortas: ['torta', 'lonche', 'sandwich', 'sándwich', 'loncheria'],
  hamburguesa: ['hamburgesa', 'burger', 'hamburguesas'],
  pollo: ['polleria', 'pollería', 'rostizado', 'rosticería'],
  mariscos: ['pescado', 'camarones', 'ceviche', 'ostiones'],
  cafe: ['café', 'cafeteria', 'cafetería', 'coffee', 'capuchino'],
  panaderia: ['panadería', 'pan', 'pasteles', 'pasteleria', 'pastelería', 'reposteria'],
  restaurant: ['restaurante', 'restoran', 'comida'],
  
  // === SERVICIOS ===
  plomero: ['plomeria', 'plomería', 'tuberia', 'tubería', 'fuga', 'agua'],
  electricista: ['electricidad', 'luz', 'instalacion', 'instalación', 'electrico'],
  mecanico: ['mecánico', 'taller', 'carro', 'auto', 'reparacion'],
  carpintero: ['carpinteria', 'carpintería', 'madera', 'muebles'],
  cerrajero: ['cerrajeria', 'cerrajería', 'llaves', 'chapa', 'cerradura'],
  pintor: ['pintura', 'pintado', 'decoracion', 'decoración'],
  limpieza: ['limpiar', 'aseo', 'mucama', 'servicio domestico'],
  
  // === TECNOLOGÍA ===
  celular: ['cel', 'selu', 'telefono', 'teléfono', 'movil', 'móvil', 'smartphone', 'iphone', 'android'],
  computadora: ['compu', 'pc', 'laptop', 'computador', 'ordenador'],
  reparacion: ['reparación', 'arreglar', 'componer', 'arreglo', 'servicio'],
  
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
  barberia: ['barbería', 'barber', 'corte', 'cabello'],
  uñas: ['manicure', 'pedicure', 'nail'],
  
  // === ADJETIVOS COMUNES (para ignorar) ===
  bueno: ['buena', 'buenos', 'buenas', 'rico', 'rica', 'ricos', 'ricas', 'sabroso', 'delicioso'],
  barato: ['bara', 'economico', 'económico', 'accesible', 'precio'],
  rapido: ['rápido', 'veloz', 'express', 'urgente'],
  cerca: ['cercano', 'cercana', 'proximo', 'próximo'],
  
  // === URGENCIAS ===
  urgente: ['urgencia', 'emergencia', 'rapido', 'rápido', '24h', '24 horas', 'abierto'],
  
  // === ENVÍO Y DELIVERY ===
  domicilio: ['delivery', 'envio', 'envío', 'entregar', 'llevar'],
};

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
 * Expandir query con sinónimos
 * @param {string} query - Búsqueda original
 * @returns {Array} - Array de términos expandidos
 */
function expandirConSinonimos(query) {
  const palabras = query.toLowerCase().split(' ');
  const terminosExpandidos = new Set();
  
  palabras.forEach(palabra => {
    const sinonimos = obtenerSinonimos(palabra);
    sinonimos.forEach(sin => terminosExpandidos.add(sin));
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

console.log('✅ Diccionario de sinónimos cargado');
console.log(`📚 ${Object.keys(SINONIMOS).length} categorías de sinónimos disponibles`);
