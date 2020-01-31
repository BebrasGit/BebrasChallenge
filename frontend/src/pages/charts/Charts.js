import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// components
import Widget from "../../components/Widget/Widget";
import ApexLineChart from "./components/ApexLineChart";
import ApexHeatmap from "./components/ApexHeatmap";
import PageTitle from "../../components/PageTitle/PageTitle";

const lineChartData = [
  {
    name: "Gujarat",
    Hindi: 40,
    English: 24,
    amt: 2400,
  },
  {
    name: "Maharashtra",
    Hindi: 30,
    English: 13,
    amt: 2210,
  },
  {
    name: "Karnataka",
    Hindi: 20,
    English: 98,
    amt: 2290,
  },
  {
    name: "Kerala",
    Hindi: 27,
    English: 39,
    amt: 2000,
  },
  {
    name: "Andhra Pradesh",
    Hindi: 18,
    English: 48,
    amt: 2181,
  },
  {
    name: "Assam",
    Hindi: 23,
    English: 38,
    amt: 2500,
  },
  {
    name: "Rajasthan",
    Hindi: 34,
    English: 43,
    amt: 2100,
  },
];

const pieChartData = [
  { name: "Aryabhatta", value: 400 },
  { name: "Bhaskara", value: 300 },
  { name: "Mahavira", value: 300 },
  { name: "Ramanujan", value: 200 },
];

export default function Charts(props) {
  var theme = useTheme();

  // local
  var [activeIndex, setActiveIndexId] = useState(0);

  return (
    <>
      <PageTitle title="Competition Overview" button="Latest Reports" />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Widget disableWidgetMenu="true" title="State Wise Participation" upperTitle noBodyPadding>
            <ApexLineChart />
          </Widget>
        </Grid>
        <Grid item xs={12} md={6}>
          <Widget disableWidgetMenu="true" title="Comparison of past data" upperTitle noBodyPadding>
            <ApexHeatmap />
          </Widget>
        </Grid>
        <Grid item xs={12} md={8}>
          <Widget disableWidgetMenu="true" title="State wise Highest Scores(Language Wise)" noBodyPadding upperTitle>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                width={500}
                height={300}
                data={lineChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Hindi"
                  stroke={theme.palette.primary.main}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="English"
                  stroke={theme.palette.secondary.main}
                />
              </LineChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>
        <Grid item xs={12} md={4}>
          <Widget disableWidgetMenu="true" title="Age Group wise Participation" noBodyPadding upperTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={200} height={300}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={pieChartData}
                  cx={200}
                  cy={150}
                  innerRadius={60}
                  outerRadius={80}
                  fill={theme.palette.primary.main}
                  dataKey="value"
                  onMouseEnter={(e, id) => setActiveIndexId(id)}
                />
              </PieChart>
            </ResponsiveContainer>
          </Widget>
        </Grid>
      </Grid>
    </>
  );
}

// ################################################################

function renderActiveShape(props) {
  var RADIAN = Math.PI / 180;
  var {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  var sin = Math.sin(-RADIAN * midAngle);
  var cos = Math.cos(-RADIAN * midAngle);
  var sx = cx + (outerRadius + 10) * cos;
  var sy = cy + (outerRadius + 10) * sin;
  var mx = cx + (outerRadius + 30) * cos;
  var my = cy + (outerRadius + 30) * sin;
  var ex = mx + (cos >= 0 ? 1 : -1) * 22;
  var ey = my;
  var textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Participation ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
}
