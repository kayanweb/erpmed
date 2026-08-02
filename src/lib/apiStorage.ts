
export const syncPatients = (callback: (data: any[]) => void) => {
  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();
      callback(data);
    } catch (e) {
      console.error("Error fetching patients:", e);
    }
  };
  fetchPatients();
  const interval = setInterval(fetchPatients, 5000);
  return () => clearInterval(interval);
};

export const savePatient = async (patient: any) => {
  await fetch('/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient),
  });
};

export const deletePatient = async (id: string) => {
  await fetch(`/api/patients/${id}`, { method: 'DELETE' });
};

export const syncPrescriptions = (callback: (data: any[]) => void) => {
  const fetchPrescriptions = async () => {
    try {
      const res = await fetch('/api/prescriptions');
      const data = await res.json();
      callback(data);
    } catch (e) {
      console.error("Error fetching prescriptions:", e);
    }
  };
  fetchPrescriptions();
  const interval = setInterval(fetchPrescriptions, 5000);
  return () => clearInterval(interval);
};

export const savePrescription = async (prescription: any) => {
  await fetch('/api/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prescription),
  });
};

export const syncInvoices = (callback: (data: any[]) => void) => {
  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      callback(data);
    } catch (e) {
      console.error("Error fetching invoices:", e);
    }
  };
  fetchInvoices();
  const interval = setInterval(fetchInvoices, 5000);
  return () => clearInterval(interval);
};

export const saveInvoice = async (invoice: any) => {
  await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });
};

export const saveHISNotification = async (notification: any) => {
  await fetch('/api/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
};

export const syncHISNotifications = (callback: (data: any[]) => void) => {
  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      callback(data);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    }
  };
  fetchNotifs();
  const interval = setInterval(fetchNotifs, 5000);
  return () => clearInterval(interval);
};

export const clearHISNotifications = async (ids: string[]) => {
  await fetch('/api/notifications/clear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
};

export const syncHISMessages = (callback: (data: any[]) => void) => {
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      callback(data);
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };
  fetchMessages();
  const interval = setInterval(fetchMessages, 5000);
  return () => clearInterval(interval);
};

export const saveHISMessage = async (message: any) => {
  await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
};

export const clearHISMessages = async (ids: string[]) => {
  await fetch('/api/messages/clear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
};

export const deleteHISNotification = async (id: string) => {
  await clearHISNotifications([id]);
};

