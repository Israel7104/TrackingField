# Hooks de React

## useState

Se usa para manejar estado local de formularios y toggles visuales. Por ejemplo, los nombres de rutinas, los datos de login y el modo expandido de algunas tarjetas viven en `useState` porque solo interesan al componente que los renderiza.

## useEffect

Se usa para lanzar efectos secundarios cuando el frontend necesita sincronizarse con elementos externos. En este proyecto aparece sobre todo en el hook `usePersistentState` y en el `AppProvider`, donde se carga el dashboard inicial desde la API.

## useMemo

Se usa para derivar datos sin recalcular en cada render. El caso mas claro es el calculo de totales nutricionales a partir de la lista de alimentos.

## useCallback

Se usa para estabilizar acciones compartidas por el contexto, como crear alimentos, refrescar datos o cerrar sesion. Esto ayuda a que el valor del contexto sea mas estable y reduce renders innecesarios en consumidores.

## Custom hook: usePersistentState

`usePersistentState` encapsula la lectura y escritura en LocalStorage. Gracias a ese hook, la logica de persistencia de sesion demo y cuentas demo no esta repartida por toda la aplicacion.

### Como funciona

- Lee el valor inicial desde LocalStorage.
- Si no existe o esta corrupto, usa un valor por defecto.
- Cada vez que el estado cambia, actualiza LocalStorage.
- Si el nuevo valor es `null`, elimina la clave.

## Por que este enfoque es util

Separar comportamiento en hooks mantiene los componentes mas limpios y facilita reutilizacion. En este proyecto el hook personalizado resuelve un problema real y repetible, no una abstraccion artificial.