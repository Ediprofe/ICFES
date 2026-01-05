---
description: Verificar antes de refactorizar para evitar romper el proyecto
---

## Pre-Refactor Checklist

1. **Verificar entry point**
   ```bash
   cat src/main.jsx | grep "import App"
   ```
   Asegurarse de saber cuál archivo es el App principal.

2. **Antes de eliminar archivos, verificar dependencias**
   ```bash
   grep -r "nombreArchivo" src/
   ```

3. **Build antes y después de cada cambio**
   ```bash
   npm run build
   ```

4. **Si el build falla, revertir inmediatamente**
   ```bash
   git checkout -- .
   ```

5. **La rama `refactor/audit-implementation` es el backup seguro**
   ```bash
   git checkout refactor/audit-implementation  # volver si todo falla
   ```
