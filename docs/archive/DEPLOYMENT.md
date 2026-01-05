# 🚀 Guía de Deployment - ICFES Analyzer

## Preparación para Producción

Antes de hacer deployment, asegúrate de:

1. ✅ Todas las funcionalidades están probadas
2. ✅ No hay errores en la consola
3. ✅ El build de producción funciona localmente
4. ✅ Los archivos están optimizados

## Build Local

```bash
# Construir para producción
npm run build

# Esto genera la carpeta dist/ con los archivos optimizados
```

## Opciones de Deployment

### 1. 🔷 Vercel (Recomendado)

**Ventajas:**
- Deploy automático desde Git
- HTTPS gratuito
- CDN global
- Configuración cero

**Pasos:**

1. Instalar Vercel CLI (si no lo tienes):
```bash
npm install -g vercel
```

2. Login en Vercel:
```bash
vercel login
```

3. Deploy:
```bash
# Desde la raíz del proyecto
vercel

# O para producción directamente
vercel --prod
```

4. Sigue las instrucciones en pantalla:
   - Confirma el proyecto
   - Selecciona el scope
   - Deja las configuraciones por defecto

5. ¡Listo! Tu app estará en `https://tu-proyecto.vercel.app`

**Deploy desde GitHub:**

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Haz clic en "Import Project"
4. Selecciona tu repositorio
5. Configura:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy

---

### 2. 🟢 Netlify

**Ventajas:**
- Interfaz muy amigable
- Deploy con drag & drop
- HTTPS automático
- Formularios y funciones serverless

**Opción A: Drag & Drop**

1. Construye el proyecto:
```bash
npm run build
```

2. Ve a [netlify.com](https://netlify.com)
3. Arrastra la carpeta `dist/` a la zona de drop
4. ¡Listo!

**Opción B: Netlify CLI**

1. Instalar Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Deploy:
```bash
# Deploy de prueba
netlify deploy

# Especifica la carpeta dist
# Cuando te pregunte por el publish directory: dist

# Deploy a producción
netlify deploy --prod
```

**Opción C: Deploy desde Git**

1. Sube tu código a GitHub/GitLab/Bitbucket
2. Ve a [netlify.com](https://netlify.com)
3. Click en "New site from Git"
4. Conecta tu repositorio
5. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy

---

### 3. 📘 GitHub Pages

**Ventajas:**
- Gratis para repos públicos
- Integrado con GitHub
- Simple para proyectos estáticos

**Pasos:**

1. Instalar gh-pages:
```bash
npm install -D gh-pages
```

2. Agregar a `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://tu-usuario.github.io/icfes-analyzer"
}
```

3. Configurar vite.config.js:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/icfes-analyzer/' // Nombre de tu repo
})
```

4. Deploy:
```bash
npm run deploy
```

5. Configurar GitHub Pages:
   - Ve a Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / root
   - Save

---

### 4. ☁️ Firebase Hosting

**Ventajas:**
- Hosting rápido de Google
- Integración con otros servicios de Firebase
- SSL automático

**Pasos:**

1. Instalar Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login:
```bash
firebase login
```

3. Inicializar Firebase:
```bash
firebase init hosting
```

4. Configurar:
   - ¿Qué usar como directorio público? `dist`
   - ¿Configurar como SPA? `yes`
   - ¿Sobrescribir index.html? `no`

5. Build y Deploy:
```bash
npm run build
firebase deploy
```

---

### 5. 🔶 AWS S3 + CloudFront

**Ventajas:**
- Escalabilidad infinita
- Control total
- Integración con AWS

**Pasos básicos:**

1. Crear bucket S3
2. Habilitar hosting estático
3. Subir carpeta `dist/`
4. Configurar CloudFront (opcional)
5. Configurar dominio personalizado

---

## Configuración de Dominio Personalizado

### En Vercel:
1. Settings > Domains
2. Agrega tu dominio
3. Configura DNS según instrucciones

### En Netlify:
1. Domain settings
2. Add custom domain
3. Configura DNS

### Registradores comunes:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare

**Configuración DNS:**
```
Type: A
Name: @
Value: [IP del servicio]

Type: CNAME
Name: www
Value: [dominio del servicio]
```

---

## Variables de Entorno

Si necesitas variables de entorno:

1. Crea `.env`:
```bash
VITE_API_URL=https://api.example.com
VITE_API_KEY=tu-key
```

2. Úsalas en el código:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

3. Configura en tu plataforma:
   - **Vercel**: Environment Variables
   - **Netlify**: Environment Variables
   - **GitHub Pages**: No soporta (usa valores públicos)

---

## Optimizaciones Pre-Deploy

### 1. Analizar Bundle
```bash
npm run build
# Revisar el tamaño de dist/
```

### 2. Comprimir Imágenes
- Usa formatos modernos (WebP)
- Comprime con TinyPNG o similares

### 3. Code Splitting
- Vite lo hace automáticamente
- Revisa chunks grandes

### 4. Lazy Loading
```javascript
// Para componentes grandes
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### 5. Service Worker (PWA)
```bash
npm install vite-plugin-pwa -D
```

---

## Monitoreo Post-Deploy

### Analytics
- Google Analytics
- Plausible
- Fathom

### Error Tracking
- Sentry
- LogRocket
- Bugsnag

### Performance
- Lighthouse (DevTools)
- WebPageTest
- GTmetrix

---

## Troubleshooting

### Rutas no funcionan (404)
Configura rewrites/redirects:

**Netlify** - Crea `public/_redirects`:
```
/*    /index.html   200
```

**Vercel** - Crea `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Archivos grandes
- Reduce el tamaño del bundle
- Usa code splitting
- Lazy load componentes

### CORS errors
- Configura headers en tu plataforma
- Usa proxy en desarrollo

---

## Checklist Pre-Deploy ✅

- [ ] Build funciona localmente (`npm run build`)
- [ ] Preview funciona (`npm run preview`)
- [ ] No hay errores en consola
- [ ] No hay warnings críticos
- [ ] Responsive en todos los dispositivos
- [ ] Performance aceptable (Lighthouse > 80)
- [ ] SEO básico configurado
- [ ] Favicon configurado
- [ ] Meta tags configurados
- [ ] README actualizado
- [ ] .env.example creado (si aplica)
- [ ] Documentación completa

---

## 🎯 Recomendación Final

Para este proyecto específico (ICFES Analyzer):

**Mejor opción: Vercel**
- Setup inmediato
- Deploy automático
- URL bonita
- Performance excelente
- Sin configuración extra

**Comando único:**
```bash
vercel --prod
```

---

**¡Tu aplicación estará en producción en minutos!** 🚀✨
