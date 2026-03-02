const translations = {
  es: {
    nav: { title: 'TurnApp' },
    auth: {
      loginTitle: 'Iniciar Sesión',
      registerTitle: 'Crear Cuenta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      name: 'Nombre completo',
      loginBtn: 'Entrar',
      registerBtn: 'Registrarse',
      noAccount: '¿No tenés cuenta?',
      register: 'Registrate',
      hasAccount: '¿Ya tenés cuenta?',
      login: 'Iniciá sesión',
      invalidCredentials: 'Email o contraseña incorrectos',
      registerSuccess: '¡Cuenta creada exitosamente!',
      emailExists: 'El email ya está registrado'
    },
    dashboard: {
      title: 'Turnos Disponibles',
      myAppointments: 'Mis Turnos',
      noSlots: 'No hay turnos disponibles por el momento',
      book: 'Reservar',
      bookSuccess: '¡Turno reservado exitosamente!',
      bookError: 'Error al reservar el turno',
      cancel: 'Cancelar',
      cancelSuccess: 'Turno cancelado exitosamente',
      date: 'Fecha',
      time: 'Hora',
      status: 'Estado',
      actions: 'Acciones',
      logout: 'Cerrar Sesión',
      welcome: 'Bienvenido',
      confirmBook: '¿Querés reservar el turno del',
      at: 'a las',
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      noAppointments: 'No tenés turnos reservados'
    },
    admin: {
      title: 'Panel de Administración',
      createSlot: 'Crear Nuevo Turno',
      slotDate: 'Fecha',
      slotTime: 'Hora',
      createBtn: 'Crear Turno',
      slotCreated: '¡Turno creado exitosamente!',
      allAppointments: 'Todos los Turnos',
      noAppointments: 'No hay turnos reservados',
      client: 'Cliente',
      email: 'Email',
      date: 'Fecha',
      time: 'Hora',
      status: 'Estado',
      logout: 'Cerrar Sesión',
      welcome: 'Bienvenido'
    },
    status: {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado'
    },
    validation: {
      required: 'Por favor completá todos los campos',
      invalidEmail: 'El formato del email no es válido',
      invalidPassword: 'La contraseña debe tener al menos 6 caracteres',
      invalidName: 'El nombre debe tener al menos 2 caracteres'
    }
  },
  en: {
    nav: { title: 'TurnApp' },
    auth: {
      loginTitle: 'Sign In',
      registerTitle: 'Create Account',
      email: 'Email address',
      password: 'Password',
      name: 'Full name',
      loginBtn: 'Sign In',
      registerBtn: 'Register',
      noAccount: "Don't have an account?",
      register: 'Sign up',
      hasAccount: 'Already have an account?',
      login: 'Sign in',
      invalidCredentials: 'Invalid email or password',
      registerSuccess: 'Account created successfully!',
      emailExists: 'Email already registered'
    },
    dashboard: {
      title: 'Available Slots',
      myAppointments: 'My Appointments',
      noSlots: 'No available slots at the moment',
      book: 'Book',
      bookSuccess: 'Appointment booked successfully!',
      bookError: 'Error booking appointment',
      cancel: 'Cancel',
      cancelSuccess: 'Appointment cancelled successfully',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
      logout: 'Sign Out',
      welcome: 'Welcome',
      confirmBook: 'Do you want to book the slot on',
      at: 'at',
      today: 'Today',
      month: 'Month',
      week: 'Week',
      noAppointments: 'You have no appointments yet'
    },
    admin: {
      title: 'Admin Panel',
      createSlot: 'Create New Slot',
      slotDate: 'Date',
      slotTime: 'Time',
      createBtn: 'Create Slot',
      slotCreated: 'Slot created successfully!',
      allAppointments: 'All Appointments',
      noAppointments: 'No appointments yet',
      client: 'Client',
      email: 'Email',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      logout: 'Sign Out',
      welcome: 'Welcome'
    },
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled'
    },
    validation: {
      required: 'Please fill in all fields',
      invalidEmail: 'Invalid email format',
      invalidPassword: 'Password must be at least 6 characters',
      invalidName: 'Name must be at least 2 characters'
    }
  }
};

// ===== FUNCIONES =====
function getLang() {
  return localStorage.getItem('lang') || 'es';
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyTranslations(lang);
  updateLangButton(lang);
}

function updateLangButton(lang) {
  const flag = document.getElementById('lang-flag');
  if (flag) {
    flag.src = lang === 'es'
      ? 'https://flagcdn.com/w40/gb.png'
      : 'https://flagcdn.com/w40/es.png';
    flag.alt = lang === 'es' ? 'Switch to English' : 'Cambiar a Español';
  }
}

function applyTranslations(lang) {
  const t = translations[lang];
  document.documentElement.lang = lang;

  // Index
  if (document.getElementById('login-title')) {
    document.getElementById('login-title').textContent = t.auth.loginTitle;
    document.getElementById('register-title').textContent = t.auth.registerTitle;
    document.getElementById('login-email').placeholder = t.auth.email;
    document.getElementById('login-password').placeholder = t.auth.password;
    document.getElementById('register-name').placeholder = t.auth.name;
    document.getElementById('register-email').placeholder = t.auth.email;
    document.getElementById('register-password').placeholder = t.auth.password;
    document.getElementById('login-btn').textContent = t.auth.loginBtn;
    document.getElementById('register-btn').textContent = t.auth.registerBtn;
    document.getElementById('go-register').textContent = t.auth.register;
    document.getElementById('go-login').textContent = t.auth.login;
  }

  // Dashboard
  if (document.getElementById('slots-title')) {
    document.getElementById('slots-title').textContent = t.dashboard.title;
    document.getElementById('appointments-title').textContent = t.dashboard.myAppointments;
    document.getElementById('logout-btn').textContent = t.dashboard.logout;
    document.getElementById('th-date').textContent = t.dashboard.date;
    document.getElementById('th-time').textContent = t.dashboard.time;
    document.getElementById('th-status').textContent = t.dashboard.status;
    document.getElementById('th-actions').textContent = t.dashboard.actions;
  }

  // Admin
  if (document.getElementById('admin-title')) {
    document.getElementById('admin-title').textContent = t.admin.title;
    document.getElementById('create-slot-title').textContent = t.admin.createSlot;
    document.getElementById('slot-date').placeholder = t.admin.slotDate;
    document.getElementById('slot-time').placeholder = t.admin.slotTime;
    document.getElementById('create-slot-btn').textContent = t.admin.createBtn;
    document.getElementById('all-appointments-title').textContent = t.admin.allAppointments;
    document.getElementById('logout-btn').textContent = t.admin.logout;
    document.getElementById('admin-th-client').textContent = t.admin.client;
    document.getElementById('admin-th-email').textContent = t.admin.email;
    document.getElementById('admin-th-date').textContent = t.admin.date;
    document.getElementById('admin-th-time').textContent = t.admin.time;
    document.getElementById('admin-th-status').textContent = t.admin.status;
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  const lang = getLang();
  applyTranslations(lang);
  updateLangButton(lang);

  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
  }
});