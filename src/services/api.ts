export const getPatients = async () => {
  const response = await fetch('/api/patients');
  if (!response.ok) {
    throw new Error('Failed to fetch patients list');
  }
  return response.json();
};

export const getPatientWithConsumables = async (patientId: string) => {
  const response = await fetch(`/api/patients/${patientId}/consumables`);
  if (!response.ok) {
    throw new Error('Failed to fetch patient data');
  }
  return response.json();
};

export const issueConsumable = async (data: { patientId: string, itemName: string, quantity: number, store: string }) => {
  const response = await fetch('/api/consumables/issue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to issue consumable');
  }
  return response.json();
};
