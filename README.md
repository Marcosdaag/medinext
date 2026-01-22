# Medinext 🏥

![Status](https://img.shields.io/badge/Status-En%20Desarrollo-yellow)
![Stack](https://img.shields.io/badge/Stack-Angular%20%7C%20NestJS%20%7C%20Supabase-blue)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-green)

> **Gestión integral e inteligente para entidades de salud.**

---

## 📖 Sobre el Proyecto

**Medinext** es una plataforma SaaS (*Software as a Service*) diseñada para modernizar la gestión de turnos en hospitales y clínicas. El sistema centraliza la administración de personal médico, pacientes y citas, garantizando una experiencia fluida y libre de conflictos gracias a su manejo avanzado de concurrencia.

El objetivo es reducir el ausentismo, optimizar la agenda de los médicos y ofrecer a los pacientes una forma rápida y segura de gestionar su salud, integrando tecnologías modernas como **Inteligencia Artificial** y **Pagos Digitales**.

---

## 🚀 Demo en Vivo

La aplicación se encuentra desplegada y operativa en una arquitectura Serverless. No es necesaria ninguna instalación local para probarla.

🔗 **[Ver Medinext en Vivo Aquí](https://medinext-demo.vercel.app)**

> **Credenciales de prueba sugeridas:**
> * **Admin:** `admin` / `1234`
> * **Médico:** `doctor` / `1234`
> * **Paciente:** `user` / `1234`

---

## 👥 Roles y Funcionalidades

El sistema implementa una lógica de negocio basada en roles jerárquicos:

### 1. 🏢 Super Admin (Gestión Hospitalaria)
* **Administración Global:** Control total para dar de alta/baja médicos, pacientes y turnos.
* **Gestión de Permisos:** Capacidad exclusiva para elevar privilegios de usuarios a rol de "Médico".
* **Monitoreo:** Dashboard con métricas del estado del sistema.

### 2. 👨‍⚕️ Médico (Profesional de Salud)
* **Agenda Dinámica:** Configuración personalizada de días laborales y duración de las consultas.
* **Gestión de Citas:** Visualización de agenda diaria/semanal y detalles de los pacientes asignados.
* **Historial:** Acceso rápido a información de turnos previos.

### 3. 👤 Paciente (Usuario Final)
* **Acceso Simplificado:** Registro manual o mediante **Google OAuth**.
* **Búsqueda Inteligente:** Filtros por especialidad, profesional o fechas disponibles.
* **Asistente IA:** Chatbot integrado para soporte y resolución de dudas.
* **Dashboard Personal:** Gestión de reservas activas e historial médico.

---

## ⚙️ Arquitectura y Aspectos Técnicos

Este proyecto se distingue por implementar prácticas avanzadas de ingeniería de software:

* **🏗️ Arquitectura en Capas (Layered):** Siguiendo los estándares de **NestJS**, el código está desacoplado en Controladores, Servicios y Módulos, facilitando la escalabilidad y el mantenimiento.
* **⚡ Control de Concurrencia:** Algoritmos diseñados para manejar múltiples solicitudes simultáneas, asegurando la integridad de datos en la reserva de turnos (evitando *double-booking*).
* **🔒 Seguridad Robusta:**
    * Autenticación vía **JWT** (JSON Web Tokens).
    * Estrategias de **Passport.js** para validación de identidad.
    * **Guards** personalizados para protección de rutas según roles.
* **💳 Pagos Integrados:** Procesamiento seguro de pagos y copagos mediante la API de **Stripe**.
* **💾 ORM Moderno:** Uso de **Prisma** para un modelado de datos estricto y type-safe sobre PostgreSQL.

---

## 🧪 Calidad de Código y Documentación

Para garantizar la fiabilidad y comprensibilidad del sistema, se han integrado las siguientes herramientas de desarrollo:

### 📘 Documentación de API (Swagger)
El backend cuenta con documentación autogenerada bajo el estándar **OpenAPI**. Esto permite a los desarrolladores frontend y QA visualizar los esquemas de datos y probar los endpoints en tiempo real.
* **Acceso:** Disponible en la ruta `/api/docs` de la aplicación desplegada.

### 🧪 Testing Automatizado (Jest)
La estabilidad del sistema se valida mediante pruebas automatizadas utilizando **Jest**:
* **Unit Testing:** Cobertura de lógica de negocio crítica en los Servicios (especialmente validaciones de turnos y cálculo de horarios).
* **Integration Testing:** Verificación de la comunicación correcta entre los módulos y la base de datos.

---

## 🛠️ Stack Tecnológico

**Frontend (SPA)**
* **Framework:** Angular (Latest)
* **Estilos:** Tailwind CSS
* **Gestión de Estado/Http:** RxJS
* **Hosting:** Vercel

**Backend (API REST)**
* **Framework:** NestJS
* **Lenguaje:** TypeScript
* **Validaciones:** Class-validator / Class-transformer
* **Documentación:** Swagger (OpenAPI)
* **Testing:** Jest
* **Hosting:** Vercel (Serverless Functions)

**Infraestructura y Datos**
* **Base de Datos:** PostgreSQL
* **Cloud Provider:** Supabase
* **Storage:** Supabase Storage (imágenes/docs)

**Servicios Externos**
* **Auth:** Google OAuth
* **Pagos:** Stripe API
* **IA:** OpenAI API
* **Email:** Resend

---
