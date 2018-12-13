export enum AlertSeverity {
	Low = 1,
	Medium,
	High,
	Urgent
}

export class AlertType {
	id: number;
	name: string;
	severity: number;
}
