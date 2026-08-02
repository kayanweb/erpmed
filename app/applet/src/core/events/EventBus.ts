export type EventType = 
  | 'PATIENT_ARRIVED_ER'
  | 'TRIAGE_COMPLETED'
  | 'BED_ALLOCATED'
  | 'LAB_ORDER_CREATED'
  | 'LAB_SAMPLE_COLLECTED'
  | 'LAB_RESULT_READY'
  | 'MEDICATION_PRESCRIBED'
  | 'MEDICATION_DISPENSED'
  | 'BILLING_FOLIO_OPENED'
  | 'CHARGE_ADDED'
  | 'PATIENT_ADMITTED_INPATIENT'
  | 'PATIENT_DISCHARGED'
  | 'OPD_APPOINTMENT_BOOKED'
  | 'PATIENT_ARRIVED_OPD'
  | 'DOCTOR_CONSULTATION_STARTED'
  | 'DOCTOR_CONSULTATION_ENDED';

export interface DomainEvent {
  id: string;
  type: EventType;
  timestamp: string;
  payload: any;
  source: string; // The service that generated the event
  correlationId?: string; // For tracing a saga/journey
}

type EventCallback = (event: DomainEvent) => void;

class SystemEventBus {
  private eventStore: DomainEvent[] = [];
  private listeners: Record<string, EventCallback[]> = {};

  constructor() {}

  public on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public removeListener(event: string, callback: EventCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  public emit(event: string, payload?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }

  public publish(event: DomainEvent) {
    // 1. Store event (Event Sourcing)
    this.eventStore.push(event);
    
    // 2. Log to console for debugging
    console.log(`[EVENT BUS] ${event.type} from ${event.source}`);

    // 3. Emit to all subscribers
    this.emit(event.type, event);
    this.emit('*', event); // Wildcard for monitoring
  }

  public getEventHistory(): DomainEvent[] {
    return [...this.eventStore];
  }
  
  public getEventsByCorrelationId(correlationId: string): DomainEvent[] {
    return this.eventStore.filter(e => e.correlationId === correlationId);
  }

  public clearHistory() {
    this.eventStore = [];
    this.emit('HISTORY_CLEARED');
  }
}

// Singleton instance
export const EventBus = new SystemEventBus();
