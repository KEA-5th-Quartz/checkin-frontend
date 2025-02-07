export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ManagerStats {
  username: string;
  state: {
    status: string;
    ticket_count: number;
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
    };
  };
  dataLabels: {
    enabled: boolean;
    style: { fontSize: string };
  };
  xaxis: { categories: string[] };
  colors: string[];
  legend: {
    position: string;
    horizontalAlign: string;
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

export interface CategoryStat {
  categoryName: string;
  ticketCount: number;
}

export interface ClosedRateResponse {
  closedRate: number;
}
