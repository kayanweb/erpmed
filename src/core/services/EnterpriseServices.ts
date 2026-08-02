import { EventBus, DomainEvent } from '../events/EventBus';

const generateId = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BedManagementService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_ER', this.handlePatientArrival.bind(this));
    EventBus.on('PATIENT_DISCHARGED', this.handleDischarge.bind(this));
  }

  private async handlePatientArrival(event: DomainEvent) {
    if (event.payload.severity === 'CRITICAL') {
      await delay(800);
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

  private async handleDischarge(event: DomainEvent) {}
}

export class LaboratoryService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_ER', this.handlePatientArrival.bind(this));
  }

  private async handlePatientArrival(event: DomainEvent) {
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

export class BillingService {
  constructor() {
    EventBus.on('PATIENT_ARRIVED_ER', this.handleArrival.bind(this));
    EventBus.on('LAB_ORDER_CREATED', this.handleCharge.bind(this));
    EventBus.on('MEDICATION_DISPENSED', this.handleCharge.bind(this));
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

  private async handleCharge(event: DomainEvent) {
    await delay(500);
    let amount = 0;
    let description = '';

    if (event.type === 'LAB_ORDER_CREATED') {
      amount = event.payload.tests.length * 150;
      description = `Lab Order: ${event.payload.tests.join(', ')}`;
    } else if (event.type === 'MEDICATION_DISPENSED') {
      amount = event.payload.medications.length * 50; 
      description = `Medications: ${event.payload.medications.join(', ')}`;
    }

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

export const initializeEnterpriseServices = () => {
  new BedManagementService();
  new LaboratoryService();
  new PharmacyService();
  new BillingService();
  console.log('Enterprise Background Services Initialized.');
};
