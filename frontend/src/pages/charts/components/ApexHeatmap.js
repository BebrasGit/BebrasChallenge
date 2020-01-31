import React from "react";
import { useTheme } from "@material-ui/styles";
import ApexCharts from "react-apexcharts";

const series = [
  {
    name: "Competition1",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition2",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition3",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition4",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition5",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition6",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition7",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition8",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
  {
    name: "Competition9",
    data: generateData(18, {
      min: 0,
      max: 90,
    }),
  },
];

export default function ApexLineChart() {
  var theme = useTheme();

  return (
    <ApexCharts
      options={themeOptions(theme)}
      series={series}
      type="heatmap"
      height={350}
    />
  );
}

// ##################################################################
function generateData(count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = "D" + (i + 1).toString();
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: x,
      y: y,
    });
    i++;
  }

  return series;
}

function themeOptions(theme) {
  return {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [theme.palette.primary.main],
  };
}
