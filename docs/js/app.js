const API = 'http://localhost:3006/api';

// ===== UTILIDADES =====
function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function showMessage(elementId, text, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'message'; }, 4000);
}

// ===== VALIDACIONES =====
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function isValidName(name) {
  return name.trim().length >= 2;
}

async function apiFetch(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API}${endpoint}`, options);
  return res.json();
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(timeStr) {
  return timeStr.substring(0, 5);
}

// ===== INDEX (LOGIN / REGISTRO) =====
if (document.getElementById('login-form')) {

  // Alternar entre login y registro
  document.getElementById('go-register').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
  });

  document.getElementById('go-login').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
  });

  // Login
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const t = translations[getLang()];

  if (!email || !password) {
    showMessage('auth-message', t.validation.required, 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showMessage('auth-message', t.validation.invalidEmail, 'error');
    return;
  }

  const data = await apiFetch('/auth/login', 'POST', { email, password });
  if (data.token) {
    saveSession(data.token, data.user);
    window.location.href = data.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
  } else {
    showMessage('auth-message', t.auth.invalidCredentials, 'error');
  }
});

  // Registro
  document.getElementById('register-btn').addEventListener('click', async () => {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const t = translations[getLang()];

    if (!name || !email || !password) {
      showMessage('auth-message', t.validation.required, 'error');
      return;
    }
    if (!isValidName(name)) {
      showMessage('auth-message', t.validation.invalidName, 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showMessage('auth-message', t.validation.invalidEmail, 'error');
      return;
    }
    if (!isValidPassword(password)) {
      showMessage('auth-message', t.validation.invalidPassword, 'error');
      return;
    }

    const data = await apiFetch('/auth/register', 'POST', { name, email, password });
    if (data.message === 'User registered successfully') {
      showMessage('auth-message', t.auth.registerSuccess, 'success');
      setTimeout(() => {
        document.getElementById('register-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
      }, 1500);
    } else {
      showMessage('auth-message', t.auth.emailExists, 'error');
    }
  });
}

// ===== DASHBOARD (CLIENTE) =====
if (document.getElementById('calendar')) {
  const user = getUser();
  if (!user) window.location.href = 'index.html';

  document.getElementById('user-name').textContent = user.name;

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearSession();
    window.location.href = 'index.html';
  });

  let calendar;
  let availableSlots = [];

  // Cargar slots y renderizar calendario
  async function loadSlots() {
    availableSlots = await apiFetch('/slots');

    const events = availableSlots.map(slot => {
      const dateStr = slot.date.substring(0, 10);
      const timeStr = slot.time.substring(0, 5);
      return {
        id: slot.id,
        title: `🕐 ${timeStr}`,
        start: `${dateStr}T${slot.time}`,
        extendedProps: { slotId: slot.id }
      };
    });

    const calendarEl = document.getElementById('calendar');

    if (calendar) {
      calendar.destroy();
    }

    const t = translations[getLang()];

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: getLang() === 'es' ? 'es' : 'en',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek'
      },
      events: events,
      eventClick: function(info) {
        const slotId = info.event.extendedProps.slotId;
        const date = formatDate(info.event.startStr);
        const time = formatTime(info.event.startStr.split('T')[1] || '');

        if (confirm(`${t.dashboard.confirmBook} ${date} ${t.dashboard.at} ${time}?`)) {
          bookSlot(slotId);
        }
      },
      buttonText: {
        today: t.dashboard.today,
        month: t.dashboard.month,
        week: t.dashboard.week
      }
    });

    calendar.render();
  }

  // Reservar turno
  async function bookSlot(slotId) {
    const t = translations[getLang()];
    const data = await apiFetch('/appointments', 'POST', { slot_id: slotId });
    if (data.message === 'Appointment created successfully') {
      showMessage('dashboard-message', t.dashboard.bookSuccess, 'success');
      loadSlots();
      loadAppointments();
    } else {
      showMessage('dashboard-message', t.dashboard.bookError, 'error');
    }
  }

  // Cargar mis turnos
  async function loadAppointments() {
    const appointments = await apiFetch('/appointments');
    const tbody = document.getElementById('appointments-tbody');
    const t = translations[getLang()];
    tbody.innerHTML = '';

    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:20px;">${t.dashboard.noAppointments}</td></tr>`;
      return;
    }

    appointments.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatDate(a.date)}</td>
        <td>${formatTime(a.time)}</td>
        <td><span class="badge badge-${a.status}">${t.status[a.status]}</span></td>
        <td>${a.status === 'pending' ? `<button class="btn-danger" onclick="cancelAppointment(${a.id})">${t.dashboard.cancel}</button>` : '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.cancelAppointment = async (id) => {
    const t = translations[getLang()];
    const data = await apiFetch(`/appointments/${id}/cancel`, 'PUT');
    if (data.message === 'Appointment cancelled successfully') {
      showMessage('dashboard-message', t.dashboard.cancelSuccess, 'success');
      loadSlots();
      loadAppointments();
    }
  };

  loadSlots();
  loadAppointments();
}

// ===== ADMIN =====
if (document.getElementById('admin-tbody')) {
  const user = getUser();
  if (!user || user.role !== 'admin') window.location.href = 'index.html';

  document.getElementById('admin-name').textContent = user.name;

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearSession();
    window.location.href = 'index.html';
  });

  // Crear slot
  document.getElementById('create-slot-btn').addEventListener('click', async () => {
    const date = document.getElementById('slot-date').value;
    const time = document.getElementById('slot-time').value;
    const t = translations[getLang()];

    if (!date || !time) {
      showMessage('admin-message', t.validation.required, 'error');
      return;
    }

    const data = await apiFetch('/slots', 'POST', { date, time });
    if (data.message === 'Slot created') {
      showMessage('admin-message', t.admin.slotCreated, 'success');
      document.getElementById('slot-date').value = '';
      document.getElementById('slot-time').value = '';
    }
  });

  // Cargar todos los turnos
  async function loadAllAppointments() {
    const appointments = await apiFetch('/appointments');
    const tbody = document.getElementById('admin-tbody');
    const t = translations[getLang()];
    tbody.innerHTML = '';

    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">${t.admin.noAppointments}</td></tr>`;
      return;
    }

    appointments.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.name}</td>
        <td>${a.email}</td>
        <td>${formatDate(a.date)}</td>
        <td>${formatTime(a.time)}</td>
        <td><span class="badge badge-${a.status}">${t.status[a.status]}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  loadAllAppointments();
}
