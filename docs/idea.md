# Idea del proyecto

## Nombre

TrackingField

## Idea general

TrackingField es una microaplicacion web para personas que quieren controlar nutricion y entrenamiento sin usar varias herramientas separadas. La propuesta es reunir en un mismo espacio el registro de alimentos, el seguimiento de ejercicios y la planificacion de dietas y rutinas.

## Problema que intenta resolver

Muchas personas entrenan con una app, calculan macros con otra, guardan rutinas en notas sueltas y terminan sin una vista global de su progreso. Eso provoca friccion, datos duplicados y poca constancia. TrackingField intenta resolver ese problema ofreciendo una experiencia unica, simple y centrada en decisiones practicas.

## Usuario objetivo

- Personas que entrenan fuerza o hipertrofia y quieren un seguimiento basico.
- Usuarios que prefieren una herramienta ligera antes que una plataforma compleja.
- Estudiantes o usuarios que quieren practicar habitos de registro sin depender de una base de datos externa compleja.

## Funcionalidades principales

- Registro de alimentos con calorias y macronutrientes.
- Registro de ejercicios con series, repeticiones e intensidad.
- Creacion de dietas reutilizables.
- Creacion de rutinas reutilizables.
- Dashboard inicial con resumen rapido de actividad.
- Acceso demo y sesion persistida en LocalStorage.
- Sincronizacion del estado de dominio con una API REST propia.

## Funcionalidades opcionales

- Historial diario o semanal.
- Objetivos por peso corporal o calorias.
- Comparativas entre semanas.
- Etiquetas para clasificar alimentos y ejercicios.
- Exportacion de planes.
- Compartir rutinas con otras personas.

## Mejoras futuras

- Autenticacion real con backend y JWT.
- Base de datos relacional o documental para persistencia real.
- Subida de medidas corporales y progreso con graficas.
- Integracion con una API externa de alimentos.
- Modulos de comunidad o biblioteca compartida de rutinas.

## Decisiones tecnicas de alcance

- El frontend usa React + TypeScript.
- La API usa Node.js + Express.
- Para simplificar el proyecto, la persistencia actual del backend se apoya en un archivo JSON.
- La sesion demo se guarda en LocalStorage porque no es un dato critico de dominio.

## Repositorio GitHub

No se ha creado desde este entorno porque requiere una sesion autenticada en GitHub. La recomendacion es crear un repositorio con un nombre como `trackingfield-fullstack` y subir el contenido actual de este workspace.