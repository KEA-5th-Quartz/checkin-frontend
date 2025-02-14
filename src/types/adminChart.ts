export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ManagerStats {
  userName: string;
  state: {
    categoryName: 'IN_PROGRESS' | 'CLOSED';
    ticketCount: number;
  }[];
}

export interface ChartOptions {
  chart: {
    type: string;
    stacked: boolean;
    toolbar: { show: boolean };
  };
  plotOptions: {
    bar: {
      horizontal: boolean;
      columnWidth: string;
      borderRadius: number;
      distributed: boolean;
    };
  };
  grid: {
    show: boolean;
  };
  dataLabels: {
    enabled: boolean;
    style: { fontSize: string };
  };
  xaxis: {
    categories: string[];
    labels?: {
      maxHeight?: number;
      trim?: boolean;
    };
  };
  colors: string[];
  legend: {
    position: string;
    horizontalAlign: string;
    offsetY: number;
    markers: {
      radius: number;
      shape: string;
    };
  };
}

export interface StatusRate {
  status: string;
  ticketCount: number;
}

export interface StatusRateResponse {
  totalCount: number;
  result: StatusRate[];
}

export interface CategoryStat {
  categoryName: string;
  ticketCount: number;
}

export interface ClosedRateResponse {
  closedCount: number;
  closedRate: number;
  totalCount: number;
  unclosedCount: number;
}
