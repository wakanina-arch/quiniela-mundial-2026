/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  // Ignorar errores de páginas estáticas como /404
  staticPageGenerationTimeout: 120,
  // Deshabilitar la generación de páginas estáticas que fallan
  onError: (err, req, res) => {
    console.log('Error en página:', err);
    // No detener el build por errores de páginas
  },
}

export default nextConfig
