ESTE PROYECTO REALIZA INFORMES ACADÉMICOS BIEN SEA PARA UNA COHORTE DE ESTUDIANTES O PARA VARIAS COHORTES. LO PRINCIPAL SON DOS HTML QUE SE GENERAN, UN HTML CUANDO EL ANALISIS ES DE UNA SOLA COHORTE, Y OTRO HTML CUANDO EL ANALISIS ES DE VARIAS COHORTES. TODO ESTE ANALISIS SE HACE CON BASE EN UN ARCHIVO EXCEL POR CADA COHORTE, COMO SE OBSERVA EN LA CARPETA DOCS, QUE TIENE LOS ARCHVIVOS EXCEL DE INSUMO (2025, 2024, 2023, 2022). EN ESA MISMA CARPETA ESTÁN LOS DOS ARCHIVOS HTML GENERADOS, UNO PARA UNA COHORTE Y OTRO PARA VARIAS COHORTES (DONDE SE HACEN COMPARATIVOS). CON BASE EN ESO Y CON BASE EN LO QUE TE VOY A DECIR A CONTINUACIÓN QUIERO QUE ME DES OPINIPNES AHÍ SOLICITADAS, SOBRE EL STACK ADECUADO, CÓMO PARTIR, SI MEJOR EMPEZAR DE CERO O TOMAR ALGO, O TOMAR MUCHO DE LO QUE UA ESTÁ. TÚ EVALÚA TAMBIÉN EL ESTADO ACTUAL DEL PROYECTO Y SI HAY O NO BUENAS PRÁCTICAS. YO DE ENTRADA VEO QUE LOS HTML SON MUY LARGOS PERO BUENO AHÍ TE VA UN CONTEXTO QUE ME GENERO UNA IA PARA TI.

⸻

📌 CONTEXTO GENERAL
	•	El proyecto es una herramienta de análisis pedagógico (no un sistema administrativo).
	•	Nace de necesidades reales en colegios (simulacros tipo SABER/ICFES, análisis por cohortes, comparativas).
	•	El autor es docente y funcionario público, lo que impone límites legales y éticos claros:
	•	❌ No vender servicios a colegios públicos
	•	❌ No contratos institucionales
	•	❌ No custodiar datos personales sensibles (nombres)
	•	✔ Venta a personas naturales
	•	✔ Modelo pago por descarga / uso
	•	El valor del producto está en el análisis, interpretación y visualización, no en la entrega administrativa final a padres.

⸻

🎯 OBJETIVO DEL PRODUCTO

Crear una herramienta web que permita a docentes/coordinadores:
	•	Subir archivos Excel con resultados de evaluaciones (simulacros, pruebas internas).
	•	Analizar resultados:
	•	Por cohorte
	•	Por prueba
	•	Comparativas entre cohortes
	•	Evolución de una cohorte en el tiempo
	•	Obtener:
	•	Visualizaciones claras
	•	Métricas pedagógicas
	•	Alertas y tendencias
	•	Descargar informes listos para análisis y toma de decisiones.

👉 No reemplaza los sistemas oficiales del colegio.
👉 Apoya la toma de decisiones pedagógicas.

⸻

🧱 PRINCIPIOS CLAVE DEFINIDOS

1️⃣ Datos personales (CRÍTICO)
	•	El sistema NO debe manejar nombres de estudiantes.
	•	Solo trabaja con:
	•	student_code
	•	resultados académicos
	•	Esto:
	•	reduce riesgo legal
	•	protege al autor
	•	es coherente con venta a personas naturales
	•	La entrega final a padres no es responsabilidad del sistema.

⸻

2️⃣ Modelo de uso realista
	•	Usuario típico:
	•	Docente
	•	Coordinador académico
	•	Persona natural
	•	Flujo esperado:
	1.	Subir Excel con resultados (códigos)
	2.	Explorar resultados
	3.	Descargar informes
	4.	Usar esos informes para:
	•	juntas docentes
	•	planeación
	•	decisiones pedagógicas

⸻

🧩 FORMATOS DE SALIDA (DECISIÓN CLAVE)

🔵 HTML (exploración)
	•	Uso:
	•	análisis interactivo
	•	juntas docentes
	•	exploración de datos
	•	Contenido:
	•	gráficas interactivas
	•	filtros
	•	comparativas
	•	NO es formato de entrega final.

⸻

🟢 Word / PDF (comunicación)

Word (opcional, editable):
	•	Para:
	•	informes internos
	•	borradores
	•	Contiene:
	•	códigos
	•	tablas
	•	gráficas estáticas (PNG)

PDF (recomendado para descarga final):
	•	Para:
	•	impresión
	•	estandarización
	•	Contiene:
	•	códigos
	•	resultados
	•	análisis
	•	Sin nombres.

⸻

❗ Importante
	•	No duplicar lógica:
	•	Un solo motor de análisis
	•	Los mismos datos alimentan:
	•	HTML
	•	PNG
	•	Word/PDF
	•	Solo cambia el render, no el cálculo.

⸻

📊 GRÁFICAS
	•	Fuente única de datos estructurados.
	•	Dos renderizadores:
	•	HTML → interactivo
	•	PNG → informes
	•	PNG:
	•	resolución para impresión
	•	insertadas en Word/PDF
	•	No mezclar interactividad con documentos.

⸻

🧠 INFORMES DEFINIDOS

Tipos de informes viables:
	1.	Comparación de cohortes en una prueba
	2.	Evaluación de una cohorte en una prueba
	3.	Evolución de una cohorte en el tiempo
	4.	(Futuro) Informe individual por student_code (sin nombre)

Cada informe:
	•	Tiene una lógica clara
	•	Usa los mismos datos base
	•	Cambia estructura y visualización

⸻

💰 MODELO DE NEGOCIO
	•	❌ No SaaS institucional
	•	✔ Venta por:
	•	descarga
	•	uso
	•	paquete de informes
	•	Pago hecho por:
	•	persona natural
	•	El producto que se vende es:
	•	el análisis
	•	la visualización
	•	la interpretación

⸻

🧑‍⚖️ POSICIONAMIENTO LEGAL Y ÉTICO

Debe quedar claro en la web:
	•	“Herramienta de apoyo pedagógico”
	•	“No reemplaza sistemas oficiales”
	•	“No almacena datos personales”
	•	“Los datos se usan únicamente para generar análisis”

Esto:
	•	protege al autor
	•	alinea expectativas
	•	evita usos indebidos

⸻

🛠️ STACK Y ARQUITECTURA (IMPLÍCITO)
	•	Backend tipo:
	•	Django (encaja bien con análisis, estabilidad, MVP serio)
	•	Motor de análisis:
	•	datos estructurados como fuente única
	•	Render:
	•	HTML (frontend)
	•	PNG (reportes)
	•	Word/PDF (descarga)
	•	Infraestructura:
	•	bajo costo
	•	orientada a procesamiento puntual, no a custodia de datos

⸻

🧠 IDEA RECTORA FINAL (MUY IMPORTANTE)

El sistema analiza y estructura.
El docente interpreta y comunica.

El producto:
	•	quita carga de análisis
	•	no añade carga administrativa
	•	respeta límites legales
	•	es útil, vendible y sostenible

⸻

