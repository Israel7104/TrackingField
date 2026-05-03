# Context API

## Implementacion

La aplicacion usa `createContext` para compartir estado global desde `AppProvider`. Ese provider centraliza:

- alimentos
- ejercicios
- dietas
- rutinas
- sesion demo
- estado de red
- acciones para consultar y mutar datos

Los componentes consumidores acceden a ese estado con `useAppContext`, que ademas protege contra un uso fuera del provider.

## Por que usar Context aqui

Sin contexto, `App.tsx` tendria que pasar props a todas las paginas y estas a su vez a varios componentes hijos. Ese prop drilling vuelve mas fragil el codigo y complica la evolucion de la app.

Context API es util cuando:

- varios componentes distantes necesitan el mismo dato
- varias vistas disparan las mismas acciones
- la aplicacion tiene una nocion compartida de sesion, red o colecciones de dominio

## Limites de esta decision

Context API resuelve bien este alcance academico, pero si el dominio creciera mucho podria convenir una solucion mas especializada de gestion de estado. Para el tamaño actual, mantenerlo en React nativo es suficiente y mas facil de explicar.