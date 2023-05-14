import { EEstadoRegistro } from '@core/enum/estadoRegistro.enum';
import { Perfil } from '@core/interfaces/seguridad/perfil.interface';
export const perfiles: Array<Perfil> = [
  // {
  //   id: 0,
  //   nombre: 'Perfil prueba 1 xl aaaa1',
  //   descripcion: 'Descripcion dummie',
  //   estadoRegistro: EEstadoRegistro.activo,
  //   nuevo: true
  // },
  // {
  //   id: 0,
  //   nombre: 'Perfil prueba 21',
  //   descripcion: 'Descripcion dummie',
  //   estadoRegistro: EEstadoRegistro.inactivo,
  //   nuevo: true
  // },
  // {
  //   id: 0,
  //   nombre: 'Perfil prueba 1 xl aaaa2',
  //   descripcion: 'Descripcion dummie',
  //   estadoRegistro: EEstadoRegistro.activo,
  //   nuevo: true
  // },
  // {
  //   id: 0,
  //   nombre: 'Perfil prueba 22',
  //   descripcion: 'Descripcion dummie',
  //   estadoRegistro: EEstadoRegistro.inactivo,
  //   nuevo: true
  // },
  // {
  //   id: 0,
  //   nombre: 'Perfil prueba 1 xl aaaa3',
  //   descripcion: 'Descripcion dummie',
  //   estadoRegistro: EEstadoRegistro.activo,
  //   nuevo: true
  // },
  {
    id: 19,
    nombre: 'Perfil prueba 23',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.inactivo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: true
  },
  {
    id: 1,
    nombre: 'Perfil prueba 34',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.activo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: false
  },
  {
    id: 2,
    nombre: 'Perfil prueba 35',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.inactivo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: false
  },
  {
    id: 3,
    nombre: 'Perfil prueba 36',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.activo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: false
  },
  {
    id: 4,
    nombre: 'Perfil prueba 37',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.inactivo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: false
  },
  {
    id: 5,
    nombre: 'Perfil prueba 38',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.activo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: false
  },
  {
    id: 6,
    nombre: 'Perfil prueba 39',
    descripcion: 'Descripcion dummie',
    estadoRegistro: EEstadoRegistro.inactivo,
    usuariosActivos: Math.floor(Math.random() * 30),
    usuariosInactivos: Math.floor(Math.random() * 30),
    nuevo: false
  },
]
