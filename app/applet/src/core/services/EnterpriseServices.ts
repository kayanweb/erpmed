import { EventBus, DomainEvent } from '../events/EventBus';

const generateId = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

// Helper to simulate asynchronous processing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BedManagementService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_ER', this.handlePatientArrival.bind(this));
    EventBus.on('PATIENT_DISCHARGED', this.handleDischarge.bind(this));
  }

  private async handlePatientArrival(event: DomainEvent) {
    if (event.payload.severity === 'CRITICAL') {
      await delay(800); // simulate thinking
      // Automatically allocate ER Resus bed
      EventBus.publish({
        id: generateId(),
        type: 'BED_ALLOCATED',
        timestamp: now(),
        source: 'BedManagementService',
        correlationId: event.correlationId,
        payload: {
          patientId: event.payload.patientId,
          bedId: 'ER-RESUS-01',
          department: 'Emergency'
        }
      });
    }
  }

  private async handleDischarge(event: DomainEvent) {
    // Logic to free bed
  }
}

export class LaboratoryService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_ER', this.handlePatientArrival.bind(this));
  }

  private async handlePatientArrival(event: DomainEvent) {
    // Automatically order standard ER panels for certain severities
    if (event.payload.severity === 'CRITICAL' || event.payload.pathway === 'STROKE') {
      await delay(1200);
      EventBus.publish({
        id: generateId(),
        type: 'LAB_ORDER_CREATED',
        timestamp: now(),
        source: 'LaboratoryService',
        correlationId: event.correlationId,
        payload: {
          patientId: event.payload.patientId,
          orderId: `ORD-LAB-${generateId()}`,
          tests: ['CBC', 'CMP', 'PT/INR', 'Troponin'],
          priority: 'STAT'
        }
      });
    }
  }
}

export class PharmacyService {
  constructor() {
    EventBus.on('BED_ALLOCATED', this.handleBedAllocated.bind(this));
  }

  private async handleBedAllocated(event: DomainEvent) {
    if (event.payload.department === 'Emergency' && event.payload.bedId.includes('RESUS')) {
      await delay(1500);
      EventBus.publish({
        id: generateId(),
        type: 'MEDICATION_DISPENSED',
        timestamp: now(),
        source: 'PharmacyService',
        correlationId: event.correlationId,
        payload: {
          patientId: event.payload.patientId,
          medications: ['Epinephrine 1mg', 'Amiodarone 300mg', 'NS 1L'],
          location: event.payload.bedId,
          status: 'SENT_VIA_PNEUMATIC_TUBE'
        }
      });
    }
  }
}

export class OPDService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_OPD', this.handleArrival.bind(this));
    EventBus.on('DOCTOR_CONSULTATION_STARTED', this.handleConsultation.bind(this));
  }

  private async handleArrival(event: DomainEvent) {
    await delay(1000);
    EventBus.publish({
      id: generateId(),
      type: 'DOCTOR_CONSULTATION_STARTED',
      timestamp: now(),
      source: 'OPD_Nursing_Station',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        doctorId: event.payload.doctorId,
        room: 'Clinic 5'
      }
    });
  }

  private async handleConsultation(event: DomainEvent) {
    await delay(2000);
    // Doctor orders labs and ends consultation
    EventBus.publish({
      id: generateId(),
      type: 'LAB_ORDER_CREATED',
      timestamp: now(),
      source: 'OPD_Doctor_Terminal',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        orderId: `ORD-LAB-${generateId()}`,
        tests: ['CBC', 'Lipid Panel', 'HbA1c'],
        priority: 'ROUTINE'
      }
    });
    
    await delay(1000);
    EventBus.publish({
      id: generateId(),
      type: 'MEDICATION_PRESCRIBED',
      timestamp: now(),
      source: 'OPD_Doctor_Terminal',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        medications: ['Metformin 500mg', 'Atorvastatin 20mg'],
        status: 'PENDING_DISPENSE'
      }
    });

    await delay(500);
    EventBus.publish({
      id: generateId(),
      type: 'DOCTOR_CONSULTATION_ENDED',
      timestamp: now(),
      source: 'OPD_Doctor_Terminal',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        disposition: 'HOME_WITH_MEDS'
      }
    });
  }
}

export class BillingService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_ER', this.handleArrival.bind(this));
    EventBus.on('OPD_APPOINTMENT_BOOKED', this.handleOPDArrival.bind(this));
    EventBus.on('LAB_ORDER_CREATED', this.handleCharge.bind(this));
    EventBus.on('MEDICATION_DISPENSED', this.handleCharge.bind(this));
    EventBus.on('MEDICATION_PRESCRIBED', this.handleCharge.bind(this));
    EventBus.on('DOCTOR_CONSULTATION_ENDED', this.handleConsultationCharge.bind(this));
  }

  private async handleArrival(event: DomainEvent) {
    await delay(300);
    const folioId = `FOL-${generateId()}`;
    EventBus.publish({
      id: generateId(),
      type: 'BILLING_FOLIO_OPENED',
      timestamp: now(),
      source: 'BillingService',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        folioId: folioId,
        type: 'EMERGENCY'
      }
    });
  }

  private async handleOPDArrival(event: DomainEvent) {
    await delay(300);
    const folioId = `FOL-${generateId()}`;
    EventBus.publish({
      id: generateId(),
      type: 'BILLING_FOLIO_OPENED',
      timestamp: now(),
      source: 'BillingService',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        folioId: folioId,
        type: 'OUTPATIENT'
      }
    });
  }

  private async handleConsultationCharge(event: DomainEvent) {
    await delay(200);
    EventBus.publish({
      id: generateId(),
      type: 'CHARGE_ADDED',
      timestamp: now(),
      source: 'BillingService',
      correlationId: event.correlationId,
      payload: {
        patientId: event.payload.patientId,
        amount: 250, // Consultation fee
        description: `Specialist Consultation`
      }
    });
  }

  private async handleCharge(event: DomainEvent) {
    await delay(500);
    let amount = 0;
    let description = '';

    if (event.type === 'LAB_ORDER_CREATED') {
      amount = event.payload.tests.length * 150; // $150 per test
      description = `Lab Order: ${event.payload.tests.join(', ')}`;
    } else if (event.type === 'MEDICATION_DISPENSED' || event.type === 'MEDICATION_PRESCRIBED') {
      amount = event.payload.medications.length * 50; 
      description = `Medications: ${event.payload.medications.join(', ')}`;
    }

    if (amount > 0) {
      EventBus.publish({
        id: generateId(),
        type: 'CHARGE_ADDED',
        timestamp: now(),
        source: 'BillingService',
        correlationId: event.correlationId,
        payload: {
          patientId: event.payload.patientId,
          amount,
          description
        }
      });
    }
  }
}

// Initialize all services
export const initializeEnterpriseServices = () => {
  new BedManagementService();
  new LaboratoryService();
  new PharmacyService();
  new OPDService();
  new BillingService();
  console.log('Enterprise Background Services Initialized.');
};
