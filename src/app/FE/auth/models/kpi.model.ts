export interface CreateKpiDto {
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
}

export interface UpdateKpiDto {
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
}

export interface KpiResponseDto {
  kpiId: number;
  kpiName: string;
  description: string;
  kpiType: string;
  measurementUnit: string;
  createdDate: string;
  updatedDate?: string;
}

// Legacy interface for backward compatibility
export interface Kpi {
  KpiName: string;
  Description: string;
  KpiType: string;
  MeasurementUnit: string;
}
