// Tax and Shipping Calculation Utilities

// Tax rates by state (Philippines)
const TAX_RATES = {
  'Metro Manila': 0.12, // 12% VAT
  'Luzon': 0.12,
  'Visayas': 0.12,
  'Mindanao': 0.12,
  'default': 0.12
};

// Shipping zones and rates
const SHIPPING_ZONES = {
  'Metro Manila': {
    baseFee: 100,
    freeShippingThreshold: 1000,
    maxFee: 200
  },
  'Luzon': {
    baseFee: 150,
    freeShippingThreshold: 1500,
    maxFee: 300
  },
  'Visayas': {
    baseFee: 200,
    freeShippingThreshold: 2000,
    maxFee: 400
  },
  'Mindanao': {
    baseFee: 250,
    freeShippingThreshold: 2500,
    maxFee: 500
  },
  'default': {
    baseFee: 200,
    freeShippingThreshold: 2000,
    maxFee: 400
  }
};

// Determine shipping zone based on address
export const getShippingZone = (address) => {
  if (!address || !address.state) return 'default';
  
  const state = address.state.toLowerCase();
  
  // Metro Manila areas
  if (state.includes('metro manila') || state.includes('ncr') || 
      state.includes('manila') || state.includes('quezon city') ||
      state.includes('makati') || state.includes('pasig') ||
      state.includes('taguig') || state.includes('paranaque') ||
      state.includes('mandaluyong') || state.includes('marikina') ||
      state.includes('caloocan') || state.includes('malabon') ||
      state.includes('navotas') || state.includes('san juan') ||
      state.includes('pateros') || state.includes('valenzuela') ||
      state.includes('las pinas') || state.includes('muntinlupa')) {
    return 'Metro Manila';
  }
  
  // Luzon areas (excluding Metro Manila)
  if (state.includes('luzon') || state.includes('calabarzon') ||
      state.includes('central luzon') || state.includes('ilocos') ||
      state.includes('cagayan valley') || state.includes('bicol') ||
      state.includes('cordillera') || state.includes('mimaropa')) {
    return 'Luzon';
  }
  
  // Visayas areas
  if (state.includes('visayas') || state.includes('western visayas') ||
      state.includes('central visayas') || state.includes('eastern visayas') ||
      state.includes('iloilo') || state.includes('cebu') ||
      state.includes('bohol') || state.includes('negros') ||
      state.includes('samar') || state.includes('leyte')) {
    return 'Visayas';
  }
  
  // Mindanao areas
  if (state.includes('mindanao') || state.includes('davao') ||
      state.includes('zamboanga') || state.includes('northern mindanao') ||
      state.includes('soccsksargen') || state.includes('caraga') ||
      state.includes('bangsamoro') || state.includes('cotabato') ||
      state.includes('sulu') || state.includes('tawi-tawi')) {
    return 'Mindanao';
  }
  
  return 'default';
};

// Calculate tax amount
export const calculateTax = (subtotal, address) => {
  if (!subtotal || subtotal <= 0) return 0;
  
  const shippingZone = getShippingZone(address);
  const taxRate = TAX_RATES[shippingZone] || TAX_RATES.default;
  
  return Math.round(subtotal * taxRate * 100) / 100; // Round to 2 decimal places
};

// Calculate shipping fee
export const calculateShippingFee = (subtotal, address) => {
  if (!subtotal || subtotal < 0) return 0;
  
  const shippingZone = getShippingZone(address);
  const zoneConfig = SHIPPING_ZONES[shippingZone] || SHIPPING_ZONES.default;
  
  // Free shipping if order value meets threshold
  if (subtotal >= zoneConfig.freeShippingThreshold) {
    return 0;
  }
  
  // Calculate shipping fee based on order value
  let shippingFee = zoneConfig.baseFee;
  
  // Reduce shipping fee for higher order values
  if (subtotal >= zoneConfig.freeShippingThreshold * 0.7) {
    shippingFee = Math.round(zoneConfig.baseFee * 0.5); // 50% discount
  } else if (subtotal >= zoneConfig.freeShippingThreshold * 0.5) {
    shippingFee = Math.round(zoneConfig.baseFee * 0.7); // 30% discount
  }
  
  // Ensure shipping fee doesn't exceed maximum
  return Math.min(shippingFee, zoneConfig.maxFee);
};

// Calculate total order amount
export const calculateTotal = (subtotal, address) => {
  const tax = calculateTax(subtotal, address);
  const shippingFee = calculateShippingFee(subtotal, address);
  
  return Math.round((subtotal + tax + shippingFee) * 100) / 100;
};

// Get shipping zone information for display
export const getShippingZoneInfo = (address) => {
  const zone = getShippingZone(address);
  const config = SHIPPING_ZONES[zone] || SHIPPING_ZONES.default;
  
  return {
    zone,
    baseFee: config.baseFee,
    freeShippingThreshold: config.freeShippingThreshold,
    maxFee: config.maxFee,
    estimatedDays: zone === 'Metro Manila' ? '1-2 days' : 
                   zone === 'Luzon' ? '2-3 days' :
                   zone === 'Visayas' ? '3-5 days' :
                   zone === 'Mindanao' ? '5-7 days' : '3-5 days'
  };
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

// Get tax rate percentage for display
export const getTaxRatePercentage = (address) => {
  const shippingZone = getShippingZone(address);
  const taxRate = TAX_RATES[shippingZone] || TAX_RATES.default;
  return Math.round(taxRate * 100);
}; 