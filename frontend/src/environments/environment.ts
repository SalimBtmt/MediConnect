export const environment = {
  production: false,
  backend: {
    protocol: 'http',
    host: '0.0.0.0',
    port: '3000',
    endpoints: {
      allPatients: '/patient',
      onePatient: '/patient/:id',
    },
  },
};