# 📤 Instrucciones para Subir a GitHub

## 🔍 Situación Actual

- ✅ Código listo y commiteado
- ✅ Remote configurado: `https://github.com/eduardo-daniel/app-pajan.git`
- ⚠️ El repositorio requiere autenticación (es privado o necesita token)

## 🚀 Solución: Usar Personal Access Token

GitHub **no acepta contraseñas**. Necesitas un **token**.

### Paso 1: Generar Token

1. Ve a: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Configura:
   - **Note:** `app-pajan-push`
   - **Expiration:** Elige una fecha (o "No expiration")
   - **Select scopes:** ✅ Marca **`repo`** (todos los permisos)
4. Click **"Generate token"**
5. **⚠️ COPIA EL TOKEN** (solo se muestra una vez)

### Paso 2: Usar el Token

**Opción A: En la URL (Recomendado)**

```powershell
# Reemplaza TU_TOKEN con el token que copiaste
git remote set-url origin https://TU_TOKEN@github.com/eduardo-daniel/app-pajan.git
git push -u origin main
```

**Opción B: Cuando Git Pida Credenciales**

```powershell
git push -u origin main
```

Cuando te pida:
- **Username:** `eduardo-daniel`
- **Password:** [PEGA TU TOKEN AQUÍ]

## ✅ Verificar que Funcionó

Deberías ver:
```
Enumerating objects: 205, done.
Counting objects: 100% (205/205), done.
Writing objects: 100% (205/205), done.
To https://github.com/eduardo-daniel/app-pajan.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 🔍 Si el Repositorio No Existe

Si ves "Repository not found", el repositorio puede no existir aún:

1. Ve a: **https://github.com/new**
2. **Repository name:** `app-pajan`
3. **Visibility:** Privado o Público
4. Puedes marcar "Add a README file"
5. Click **"Create repository"**
6. Luego intenta el push de nuevo

## 📝 Comandos Rápidos

```powershell
# Ver remote actual
git remote -v

# Cambiar remote con token
git remote set-url origin https://TU_TOKEN@github.com/eduardo-daniel/app-pajan.git

# Hacer push
git push -u origin main

# Ver estado
git status
```

## 🆘 Troubleshooting

### Error: "Repository not found"
- Verifica que el repositorio existe en GitHub
- Verifica que tienes acceso al repositorio
- Verifica que el nombre sea exactamente `app-pajan`

### Error: "Authentication failed"
- Asegúrate de usar un **token**, no tu contraseña
- Verifica que el token tenga el scope `repo`
- Verifica que el token no haya expirado

### Error: "Permission denied"
- Verifica que tengas permisos de escritura en el repositorio
- Verifica que el token tenga el scope correcto

