# 🔒 Política de Privacidad

**Última actualización:** Enero 2026

---

## Resumen Ejecutivo

**ICFES Analyzer** es una aplicación de **procesamiento 100% local**. Esto significa que:

✅ Tus datos **nunca salen de tu dispositivo**  
✅ **No almacenamos** ninguna información personal  
✅ **No hay servidores** que reciban tus archivos Excel  
✅ **No usamos cookies** de rastreo ni analytics  

---

## 1. Procesamiento de Datos

### ¿Qué datos procesa la aplicación?

La aplicación procesa archivos Excel que el usuario carga voluntariamente. Estos archivos pueden contener:
- Nombres y apellidos de estudiantes
- Códigos de identificación
- Grupos/Grados
- Puntajes por asignatura
- Indicadores PIAR

### ¿Dónde se procesan los datos?

**Exclusivamente en tu navegador web.** La aplicación utiliza JavaScript para:
1. Leer el archivo Excel usando la librería `xlsx` (SheetJS)
2. Calcular estadísticas y generar visualizaciones
3. Generar reportes HTML descargables

En ningún momento los datos son enviados a un servidor externo.

---

## 2. Almacenamiento

### ¿Se guardan mis datos en algún lugar?

**No.** La aplicación no tiene:
- Base de datos
- Almacenamiento en la nube
- Cookies persistentes
- LocalStorage con datos sensibles

Cuando cierras la pestaña del navegador, todos los datos procesados **desaparecen de la memoria**.

### ¿Qué pasa con los HTML exportados?

Los reportes HTML que descargas contienen los datos procesados embebidos. **Estos archivos se guardan en tu dispositivo local**, bajo tu control. Eres responsable de:
- Dónde almacenas estos archivos
- Con quién los compartes
- Cuándo los eliminas

---

## 3. Comunicaciones Externas

### ¿La aplicación se comunica con servidores externos?

La aplicación solo carga librerías desde CDNs públicos para su funcionamiento:
- React (unpkg.com)
- Chart.js (jsdelivr.net)
- TailwindCSS (tailwindcss.com)

Estas cargas **no transmiten ningún dato personal**. Son simplemente archivos de código JavaScript/CSS.

### ¿Hay telemetría o analytics?

**No.** No usamos:
- Google Analytics
- Mixpanel
- Hotjar
- Ningún otro servicio de rastreo

---

## 4. Seguridad

### ¿Es seguro usar esta aplicación?

Sí. Al no haber transmisión de datos a servidores:
- No hay riesgo de interceptación de datos en tránsito
- No hay riesgo de brechas de seguridad en servidores
- No hay riesgo de acceso no autorizado a bases de datos

### Recomendaciones de seguridad

Para máxima privacidad, te recomendamos:
1. **No subir los HTML exportados a servicios en la nube** (Google Drive, Dropbox) si contienen datos sensibles
2. **Eliminar los archivos HTML** después de usarlos si contienen información de identificación
3. **Usar la aplicación en modo incógnito** si deseas que no quede rastro en el historial del navegador

---

## 5. Derechos del Usuario

Esta es una herramienta gratuita y de código abierto. Tienes derecho a:
- **Usar** la aplicación libremente
- **Inspeccionar** el código fuente para verificar nuestras prácticas de privacidad
- **Modificar** el código según tus necesidades
- **Distribuir** copias bajo los términos de la licencia MIT

---

## 6. Descargo de Responsabilidad

Esta aplicación se proporciona "tal cual" (AS IS), sin garantías de ningún tipo. Los desarrolladores no son responsables de:
- Errores en los cálculos o visualizaciones
- Uso indebido de los datos procesados
- Pérdida de archivos generados
- Incumplimiento de regulaciones de protección de datos por parte del usuario

El usuario es responsable de cumplir con las leyes de protección de datos aplicables en su jurisdicción (ej: Ley 1581 de 2012 en Colombia, GDPR en Europa).

---

## 7. Contacto

Si tienes preguntas sobre esta política de privacidad o deseas reportar una vulnerabilidad de seguridad, puedes abrir un Issue en el repositorio del proyecto.

---

*Esta política puede actualizarse. La fecha de última actualización se indica al inicio del documento.*
