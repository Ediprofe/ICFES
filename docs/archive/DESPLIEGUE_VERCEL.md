# Guía de Despliegue en Vercel

## Fecha: 10 de octubre de 2025

## ✅ Pre-requisitos completados

- ✅ Build exitoso (`npm run build`)
- ✅ Código actualizado en GitHub
- ✅ Archivo `vercel.json` creado y subido
- ✅ Repositorio: `Ediprofe/ICFES`

---

## 🚀 Opción 1: Despliegue desde Vercel Dashboard (Recomendado)

### Paso 1: Ir a Vercel
1. Abre tu navegador y ve a: **https://vercel.com**
2. Haz clic en **"Sign Up"** o **"Log In"**
3. Selecciona **"Continue with GitHub"**

### Paso 2: Importar el proyecto
1. Una vez dentro del dashboard, haz clic en **"Add New..."**
2. Selecciona **"Project"**
3. Busca tu repositorio: **"ICFES"**
4. Haz clic en **"Import"**

### Paso 3: Configurar el proyecto
Vercel detectará automáticamente que es un proyecto Vite. Verifica que la configuración sea:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Paso 4: Desplegar
1. Haz clic en **"Deploy"**
2. Espera 1-2 minutos mientras se construye
3. ¡Listo! Tu aplicación estará en línea

### Paso 5: Obtener tu URL
Una vez desplegado, verás tu URL pública:
```
https://icfes-[hash].vercel.app
```

O puedes configurar un dominio personalizado si lo tienes.

---

## 🚀 Opción 2: Despliegue con Vercel CLI

### Paso 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Paso 2: Login
```bash
vercel login
```

### Paso 3: Desplegar
```bash
cd /Users/edilbertosuarez/Documents/Proyectos/icfes/icfes-analyzer
vercel
```

Sigue las instrucciones en pantalla:
- ¿Set up and deploy? → **Y**
- Which scope? → Selecciona tu cuenta
- Link to existing project? → **N**
- What's your project's name? → **icfes-analyzer**
- In which directory is your code located? → **./** (Enter)

### Paso 4: Despliegue a producción
```bash
vercel --prod
```

---

## 📋 Configuración en vercel.json

Ya creé el archivo `vercel.json` con la configuración óptima:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

Este archivo asegura que Vercel:
- Use el comando correcto para construir
- Busque los archivos en la carpeta correcta
- Instale las dependencias correctamente

---

## 🔧 Configuración adicional (opcional)

### Variables de entorno
Si necesitas agregar variables de entorno:
1. En el dashboard de Vercel
2. Ve a **Settings** → **Environment Variables**
3. Agrega las variables necesarias

### Dominio personalizado
Si tienes un dominio:
1. En el dashboard de Vercel
2. Ve a **Settings** → **Domains**
3. Agrega tu dominio
4. Configura los registros DNS según las instrucciones

---

## 🎯 Despliegues automáticos

Vercel ahora desplegará automáticamente:
- ✅ Cada vez que hagas `git push` a la rama `main` → Producción
- ✅ Cada vez que abras un Pull Request → Preview
- ✅ Cada commit en cualquier rama → Preview

---

## 📊 Monitoreo

### Ver logs:
1. Dashboard de Vercel
2. Tu proyecto → **Deployments**
3. Clic en cualquier deployment
4. Ver logs de build y runtime

### Analytics:
Vercel ofrece analytics gratuitos:
- Visitas
- Performance
- Errores
- Tiempo de carga

---

## 🐛 Solución de problemas

### Si el build falla:

1. **Verificar dependencias:**
```bash
npm install
npm run build
```

2. **Verificar logs:**
- En Vercel dashboard → Deployment → View Function Logs

3. **Verificar Node version:**
Vercel usa Node.js 18 por defecto. Si necesitas otra versión:

Crea `.nvmrc`:
```
18
```

O en `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

### Si falta la imagen:

Asegúrate de que `public/image.png` esté en el repositorio:
```bash
git add public/image.png
git commit -m "Add template image"
git push
```

---

## ✅ Checklist de despliegue

### Antes de desplegar:
- [x] Build exitoso localmente
- [x] Código actualizado en GitHub
- [x] Archivo vercel.json creado
- [x] Imagen en public/ (verificar)

### Durante el despliegue:
- [ ] Cuenta de Vercel creada/conectada
- [ ] Repositorio importado
- [ ] Configuración verificada
- [ ] Deploy iniciado

### Después del despliegue:
- [ ] URL funciona correctamente
- [ ] Imagen de ejemplo se muestra
- [ ] Botón de descarga funciona
- [ ] Análisis de datos funciona
- [ ] PDF se genera correctamente
- [ ] Enlaces de redes sociales funcionan

---

## 🎊 Resultado final

Una vez desplegado, tendrás:
- ✅ URL pública accesible desde cualquier lugar
- ✅ HTTPS automático (seguro)
- ✅ CDN global (rápido en todo el mundo)
- ✅ Despliegues automáticos con cada push
- ✅ Preview de cada Pull Request
- ✅ SSL certificado incluido

---

## 📱 Tu aplicación estará disponible en:

```
https://icfes-analyzer-[tu-usuario].vercel.app
```

O con dominio personalizado:
```
https://tudominio.com
```

---

## 🔗 Enlaces útiles

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentación Vercel:** https://vercel.com/docs
- **Vite en Vercel:** https://vercel.com/docs/frameworks/vite
- **Dominios en Vercel:** https://vercel.com/docs/concepts/projects/domains

---

## 💡 Comandos rápidos

### Redeploy desde terminal:
```bash
vercel --prod
```

### Ver logs:
```bash
vercel logs [deployment-url]
```

### Ver información del proyecto:
```bash
vercel inspect [deployment-url]
```

---

## 🎉 ¡Listo para desplegar!

Todo está configurado correctamente. Solo necesitas:

1. Ir a **https://vercel.com**
2. Conectar con GitHub
3. Importar el repositorio **ICFES**
4. Hacer clic en **Deploy**

**¡En 2 minutos tu aplicación estará en línea!** 🚀

---

## 📞 Soporte

Si encuentras algún problema:
- Revisa los logs en Vercel Dashboard
- Verifica que la imagen `public/image.png` esté en el repo
- Asegúrate de que el build funcione localmente
- Consulta la documentación de Vercel

**¡Éxito con tu despliegue!** 🎊
