import { DomainEvent } from '../events/EventBus';

export type PatientState = 'REGISTERED' | 'IN_TRIAGE' | 'ER_EVALUATION' | 'ADMITTED' | 'DISCHARGED' | 'BOOKED_OPD' | 'WAITING_OPD' | 'IN_CONSULTATION';

export interface VitalSigns {
  hr?: number;
  bp?: string;
  temp?: number;
  spO2?: number;
}

export class PatientAggregate {
  public id: string;
  public mrn: string;
  public name: string;
  public state: PatientState;
  public currentLocation?: string;
  public assignedBed?: string;
  public latestVitals?: VitalSigns;
  public activeOrders: string[] = [];
  public currentFolioId?: string;
  
  private version: number = 0;

  constructor(id: string, mrn: string, name: string) {
    this.id = id;
    this.mrn = mrn;
    this.name = name;
    this.state = 'REGISTERED';
  }

  public applyEvents(events: DomainEvent[]) {
    for (const event of events) {
      this.applyEvent(event);
    }
  }

  private applyEvent(event: DomainEvent) {
    switch (event.type) {
      case 'PATIENT_ARRIVED_ER':
        this.state = 'IN_TRIAGE';
        this.currentLocation = 'ER Triage';
        break;
      
      case 'TRIAGE_COMPLETED':
        this.state = 'ER_EVALUATION';
        if (event.payload.vitals) {
          this.latestVitals = event.payload.vitals;
        }
        break;

      case 'BED_ALLOCATED':
        this.assignedBed = event.payload.bedId;
        this.currentLocation = event.payload.department;
        break;

      case 'LAB_ORDER_CREATED':
        this.activeOrders.push(event.payload.orderId);
        break;

      case 'BILLING_FOLIO_OPENED':
        this.currentFolioId = event.payload.folioId;
        break;

      case 'PATIENT_ADMITTED_INPATIENT':
        this.state = 'ADMITTED';
        break;

      case 'PATIENT_DISCHARGED':
        this.state = 'DISCHARGED';
        this.currentLocation = undefined;
        this.assignedBed = undefined;
        break;
    }
    this.version++;
  }
}
