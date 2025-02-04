export interface ChartSeries {
  name: string;
  data: number[];
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
  yaxis: { max: number };
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
